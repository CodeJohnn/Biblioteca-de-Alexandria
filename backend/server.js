"use strict";

const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const express = require("express");
const multer = require("multer");

const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.resolve(process.env.ALEXANDRIA_DATA_DIR || path.join(ROOT, "data"));
const UPLOAD_DIR = path.join(DATA_DIR, "uploads");
const TEMP_DIR = path.join(DATA_DIR, "temporary");
const METADATA_FILE = path.join(DATA_DIR, "uploads.json");
const DEVTOOLS_FILE = path.join(DATA_DIR, "devtools.json");
const PORT = Number(process.env.PORT || 3000);
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_STORAGE = Number(process.env.MAX_TOTAL_STORAGE_BYTES || 1024 * 1024 * 1024);
const UPLOADS_PER_HOUR = 5;
const RATE_WINDOW_MS = 60 * 60 * 1000;
const TRUST_PROXY_HOPS = Number(process.env.TRUST_PROXY_HOPS || 0);
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DEVTOOLS_MAX_ITEMS = 500;
const DEVTOOLS_MAX_CODE_LENGTH = 20000;
const DEVTOOLS_MAX_CODE_BYTES = 64 * 1024;
const DEVTOOLS_RATE_LIMIT = 5;
const DEVTOOLS_LANGUAGES = new Set([
    "plaintext", "javascript", "typescript", "python", "html", "css", "json", "bash",
    "sql", "c", "cpp", "csharp", "java", "php", "go", "rust", "powershell"
]);

const CATEGORIES = {
    Isos: {
        label: "ISOs",
        categories: {
            linux: "Linux",
            windows: "Windows",
            jogos: "Jogos (ISOs)"
        }
    },
    Livros: {
        label: "Livros",
        categories: {
            programacao: "Programação",
            romance: "Romance",
            ciencia: "Ciência e Tecnologia",
            filosofia: "Filosofia",
            aventura: "Aventura"
        }
    },
    Torrent: {
        label: "Torrent",
        categories: { jogos: "Jogos para PC" }
    },
    Sites: {
        label: "Sites",
        categories: {
            IA: "Inteligência Artificial",
            Filmes_e_Series: "Filmes e Séries",
            conversores: "Conversores",
            Wallpapers: "Wallpapers",
            Editores: "Editores de imagem",
            Dark_Web: "Dark Web",
            Esporte_e_Tv_aberta: "Esporte e TV aberta",
            Fontes: "Fontes"
        }
    }
};

const EXTENSIONS = new Set([".pdf", ".txt", ".md", ".png", ".jpg", ".jpeg", ".webp", ".gif"]);
const TEXT_EXTENSIONS = new Set([".txt", ".md"]);
let records = [];
let storedBytes = 0;
let reservedBytes = 0;
let metadataWriteQueue = Promise.resolve();
const uploadAttempts = new Map();
let devtoolsRecords = [];
let devtoolsWriteQueue = Promise.resolve();
const devtoolsAttempts = new Map();

function createError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}

function cleanText(value, maxLength, fieldName, required) {
    if (typeof value !== "string") throw createError(400, `${fieldName} inválido.`);
    const text = value.trim();
    if ((required && !text) || text.length > maxLength || /[\u0000-\u001f\u007f]/.test(text)) {
        throw createError(400, `${fieldName} é obrigatório e deve ter até ${maxLength} caracteres.`);
    }
    return text;
}

function isValidCategory(section, subcategory) {
    return Boolean(CATEGORIES[section]?.categories[subcategory]);
}

function checkUploadRate(req, res, next) {
    const now = Date.now();
    for (const [ip, attempt] of uploadAttempts) {
        if (now - attempt.startedAt >= RATE_WINDOW_MS) uploadAttempts.delete(ip);
    }

    const ip = req.ip;
    let attempt = uploadAttempts.get(ip);
    if (!attempt || now - attempt.startedAt >= RATE_WINDOW_MS) {
        attempt = { startedAt: now, count: 0 };
        uploadAttempts.set(ip, attempt);
    }
    if (uploadAttempts.size > 10000) {
        return res.status(503).json({ error: "Envios temporariamente indisponíveis. Tente novamente mais tarde." });
    }
    if (attempt.count >= UPLOADS_PER_HOUR) {
        res.set("Retry-After", String(Math.ceil((attempt.startedAt + RATE_WINDOW_MS - now) / 1000)));
        return res.status(429).json({ error: "Limite de 5 envios por hora atingido. Tente novamente mais tarde." });
    }
    attempt.count += 1;
    next();
}

function requireSameOrigin(req, res, next) {
    const origin = req.get("origin");
    if (!origin) return res.status(403).json({ error: "A origem da solicitação não foi informada." });
    try {
        const parsedOrigin = new URL(origin);
        if (parsedOrigin.host !== req.get("host") || parsedOrigin.protocol !== `${req.protocol}:`) {
            return res.status(403).json({ error: "Envios só são aceitos pelo próprio site." });
        }
    } catch {
        return res.status(403).json({ error: "Origem da solicitação inválida." });
    }
    next();
}

function checkDevToolsRate(req, res, next) {
    const now = Date.now();
    for (const [ip, attempt] of devtoolsAttempts) {
        if (now - attempt.startedAt >= RATE_WINDOW_MS) devtoolsAttempts.delete(ip);
    }
    const ip = req.ip;
    let attempt = devtoolsAttempts.get(ip);
    if (!attempt || now - attempt.startedAt >= RATE_WINDOW_MS) {
        attempt = { startedAt: now, count: 0 };
        devtoolsAttempts.set(ip, attempt);
    }
    if (devtoolsAttempts.size > 10000) {
        return res.status(503).json({ error: "Envio de códigos temporariamente indisponível." });
    }
    if (attempt.count >= DEVTOOLS_RATE_LIMIT) {
        res.set("Retry-After", String(Math.ceil((attempt.startedAt + RATE_WINDOW_MS - now) / 1000)));
        return res.status(429).json({ error: "Limite de 5 códigos por hora atingido." });
    }
    attempt.count += 1;
    next();
}

function cleanSnippetText(value, maxLength, field, required) {
    if (typeof value !== "string") throw createError(400, `${field} inválido.`);
    const text = value.trim();
    if ((required && !text) || text.length > maxLength || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(text)) {
        throw createError(400, `${field} é obrigatório e deve ter até ${maxLength} caracteres.`);
    }
    return text;
}

function validateSnippetCode(value) {
    if (typeof value !== "string" || !value.trim() || value.length > DEVTOOLS_MAX_CODE_LENGTH ||
        /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
        throw createError(400, `Código é obrigatório e deve ter até ${DEVTOOLS_MAX_CODE_LENGTH} caracteres.`);
    }
    if (Buffer.byteLength(value, "utf8") > DEVTOOLS_MAX_CODE_BYTES) {
        throw createError(400, "O código ultrapassa o limite de 64 KiB.");
    }
    return value;
}

function publicSnippet(record) {
    return {
        id: record.id,
        title: record.title,
        description: record.description,
        language: record.language,
        code: record.code,
        createdAt: record.createdAt
    };
}

async function persistSnippet(record) {
    const task = devtoolsWriteQueue.then(async () => {
        if (devtoolsRecords.length >= DEVTOOLS_MAX_ITEMS) {
            throw createError(507, "A biblioteca de códigos atingiu o limite de itens.");
        }
        const nextRecords = [...devtoolsRecords, record];
        const temporaryFile = path.join(DATA_DIR, `devtools-${crypto.randomUUID()}.tmp`);
        try {
            await fs.promises.writeFile(temporaryFile, JSON.stringify(nextRecords, null, 2), { flag: "wx" });
            await fs.promises.rename(temporaryFile, DEVTOOLS_FILE);
            devtoolsRecords = nextRecords;
        } finally {
            await fs.promises.rm(temporaryFile, { force: true });
        }
    });
    devtoolsWriteQueue = task.catch(() => {});
    await task;
}

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, TEMP_DIR),
    filename: (_req, _file, callback) => callback(null, `${crypto.randomUUID()}.part`)
});

const receiveFile = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
        fields: 4,
        fieldSize: 4000,
        parts: 5,
        fieldNameSize: 40
    },
    fileFilter: (_req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        if (!EXTENSIONS.has(extension)) {
            return callback(createError(400, "Formato não permitido. Envie PDF, TXT, MD, PNG, JPG, WEBP ou GIF."));
        }
        callback(null, true);
    }
}).single("arquivo");

async function hasValidFileSignature(filePath, extension) {
    const handle = await fs.promises.open(filePath, "r");
    try {
        const { size } = await handle.stat();
        if (!size) return false;
        const prefix = Buffer.alloc(Math.min(size, 16));
        await handle.read(prefix, 0, prefix.length, 0);

        if (extension === ".pdf") {
            if (!prefix.toString("ascii").startsWith("%PDF-")) return false;
            const trailer = Buffer.alloc(Math.min(size, 2048));
            await handle.read(trailer, 0, trailer.length, Math.max(0, size - trailer.length));
            return trailer.toString("latin1").includes("%%EOF");
        }
        if (extension === ".png") return prefix.length >= 8 && prefix.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
        if (extension === ".jpg" || extension === ".jpeg") return prefix.length >= 3 && prefix[0] === 0xff && prefix[1] === 0xd8 && prefix[2] === 0xff;
        if (extension === ".gif") return ["GIF87a", "GIF89a"].includes(prefix.subarray(0, 6).toString("ascii"));
        if (extension === ".webp") return prefix.length >= 12 && prefix.toString("ascii", 0, 4) === "RIFF" && prefix.toString("ascii", 8, 12) === "WEBP";
        if (TEXT_EXTENSIONS.has(extension)) {
            const content = await fs.promises.readFile(filePath);
            if (content.includes(0)) return false;
            try {
                const decoded = new TextDecoder("utf-8", { fatal: true }).decode(content);
                return !/[\u0001-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(decoded);
            } catch {
                return false;
            }
        }
        return false;
    } finally {
        await handle.close();
    }
}

async function persistRecord(record) {
    const task = metadataWriteQueue.then(async () => {
        const nextRecords = [...records, record];
        const temporaryFile = path.join(DATA_DIR, `uploads-${crypto.randomUUID()}.tmp`);
        try {
            await fs.promises.writeFile(temporaryFile, JSON.stringify(nextRecords, null, 2), { flag: "wx" });
            await fs.promises.rename(temporaryFile, METADATA_FILE);
            records = nextRecords;
            storedBytes += record.size;
        } finally {
            await fs.promises.rm(temporaryFile, { force: true });
        }
    });
    metadataWriteQueue = task.catch(() => {});
    await task;
}

function publicRecord(record) {
    return {
        id: record.id,
        section: record.section,
        subcategory: record.subcategory,
        nome: record.nome,
        descricao: record.descricao,
        link: `/api/uploads/${record.id}/download`,
        imagem: "",
        fileName: record.fileName,
        size: record.size,
        createdAt: record.createdAt
    };
}

async function start() {
    if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) throw new Error("PORT inválida.");
    if (!Number.isInteger(TRUST_PROXY_HOPS) || TRUST_PROXY_HOPS < 0 || TRUST_PROXY_HOPS > 2) {
        throw new Error("TRUST_PROXY_HOPS deve ser um número inteiro entre 0 e 2.");
    }
    if (!Number.isSafeInteger(MAX_TOTAL_STORAGE) || MAX_TOTAL_STORAGE < MAX_FILE_SIZE) {
        throw new Error("MAX_TOTAL_STORAGE_BYTES deve ser pelo menos 25 MiB.");
    }

    await fs.promises.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.promises.mkdir(TEMP_DIR, { recursive: true });
    try {
        const saved = JSON.parse(await fs.promises.readFile(METADATA_FILE, "utf8"));
        if (!Array.isArray(saved) || !saved.every(record =>
            record &&
            typeof record.id === "string" &&
            UUID_PATTERN.test(record.id) &&
            typeof record.section === "string" &&
            typeof record.subcategory === "string" &&
            typeof record.fileName === "string" &&
            Number.isSafeInteger(record.size) &&
            record.size > 0 &&
            record.size <= MAX_FILE_SIZE &&
            isValidCategory(record.section, record.subcategory)
        )) {
            throw new Error("O catálogo persistido de uploads tem formato inválido.");
        }
        records = saved;
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }

    for (const record of records) {
        const extension = path.extname(record.fileName).toLowerCase();
        if (!EXTENSIONS.has(extension)) throw new Error(`Extensão inválida no registro ${record.id}.`);
        const filePath = path.join(UPLOAD_DIR, `${record.id}${extension}`);
        const stat = await fs.promises.stat(filePath);
        if (!stat.isFile() || stat.size !== record.size) throw new Error(`Arquivo ausente ou inválido para o registro ${record.id}.`);
        storedBytes += stat.size;
    }
    if (storedBytes > MAX_TOTAL_STORAGE) throw new Error("Os arquivos existentes ultrapassam o limite total configurado.");
    try {
        const savedSnippets = JSON.parse(await fs.promises.readFile(DEVTOOLS_FILE, "utf8"));
        if (!Array.isArray(savedSnippets) || savedSnippets.length > DEVTOOLS_MAX_ITEMS || !savedSnippets.every(item =>
            item &&
            typeof item.id === "string" &&
            UUID_PATTERN.test(item.id) &&
            typeof item.title === "string" &&
            item.title.length > 0 &&
            item.title.length <= 100 &&
            typeof item.description === "string" &&
            item.description.length <= 300 &&
            DEVTOOLS_LANGUAGES.has(item.language) &&
            typeof item.code === "string" &&
            item.code.length > 0 &&
            item.code.length <= DEVTOOLS_MAX_CODE_LENGTH &&
            Buffer.byteLength(item.code, "utf8") <= DEVTOOLS_MAX_CODE_BYTES
        )) {
            throw new Error("A biblioteca DevTools persistida tem formato inválido.");
        }
        devtoolsRecords = savedSnippets;
    } catch (error) {
        if (error.code !== "ENOENT") throw error;
    }
    for (const name of await fs.promises.readdir(TEMP_DIR)) {
        if (/^[0-9a-f-]{36}\.part$/i.test(name)) {
            await fs.promises.rm(path.join(TEMP_DIR, name), { force: true });
        }
    }

    const app = express();
    app.disable("x-powered-by");
    app.set("trust proxy", TRUST_PROXY_HOPS);
    app.use((_req, res, next) => {
        res.set({
            "X-Content-Type-Options": "nosniff",
            "Referrer-Policy": "same-origin",
            "Cross-Origin-Resource-Policy": "same-origin"
        });
        next();
    });

    app.get("/api/categories", (_req, res) => {
        res.json({
            sections: Object.entries(CATEGORIES).map(([key, section]) => ({
                key,
                label: section.label,
                categories: Object.entries(section.categories).map(([categoryKey, label]) => ({ key: categoryKey, label }))
            })),
            maxFileSize: MAX_FILE_SIZE,
            allowedExtensions: [...EXTENSIONS]
        });
    });

    app.get("/api/devtools", (_req, res) => {
        res.set("Cache-Control", "no-store");
        res.json(devtoolsRecords.map(publicSnippet));
    });

    app.post(
        "/api/devtools",
        requireSameOrigin,
        checkDevToolsRate,
        express.json({ limit: "96kb", strict: true }),
        async (req, res, next) => {
            try {
                if (!req.body || typeof req.body !== "object" || Array.isArray(req.body)) {
                    throw createError(400, "Dados do código inválidos.");
                }
                const title = cleanSnippetText(req.body.title, 100, "Título", true);
                const description = cleanSnippetText(req.body.description || "", 300, "Descrição", false);
                const language = cleanSnippetText(req.body.language, 20, "Linguagem", true);
                const code = validateSnippetCode(req.body.code);
                if (!DEVTOOLS_LANGUAGES.has(language)) throw createError(400, "Escolha uma linguagem válida.");
                const record = {
                    id: crypto.randomUUID(),
                    title,
                    description,
                    language,
                    code,
                    createdAt: new Date().toISOString()
                };
                await persistSnippet(record);
                res.status(201).json(publicSnippet(record));
            } catch (error) {
                next(error);
            }
        }
    );

    app.get("/api/uploads", (req, res) => {
        const { section, subcategory } = req.query;
        if (section !== undefined && typeof section !== "string") return res.status(400).json({ error: "Seção inválida." });
        if (subcategory !== undefined && typeof subcategory !== "string") return res.status(400).json({ error: "Categoria inválida." });
        const result = records
            .filter(record => (!section || record.section === section) && (!subcategory || record.subcategory === subcategory))
            .map(publicRecord);
        res.set("Cache-Control", "no-store");
        res.json(result);
    });

    app.post("/api/uploads", requireSameOrigin, checkUploadRate, (req, res, next) => {
        receiveFile(req, res, async error => {
            if (error) {
                if (req.file?.path) await fs.promises.rm(req.file.path, { force: true });
                return next(error);
            }

            let reserved = 0;
            let finalPath;
            try {
                if (!req.file) throw createError(400, "Selecione um arquivo para enviar.");
                const nome = cleanText(req.body.nome, 80, "Nome", true);
                const descricao = cleanText(req.body.descricao || "", 300, "Descrição", false);
                const section = cleanText(req.body.section, 30, "Seção", true);
                const subcategory = cleanText(req.body.subcategory, 50, "Categoria", true);
                if (!isValidCategory(section, subcategory)) throw createError(400, "Escolha uma categoria válida.");

                const extension = path.extname(req.file.originalname).toLowerCase();
                if (!await hasValidFileSignature(req.file.path, extension)) {
                    throw createError(400, "O conteúdo do arquivo não corresponde a um formato permitido.");
                }
                if (storedBytes + reservedBytes + req.file.size > MAX_TOTAL_STORAGE) {
                    throw createError(507, "O armazenamento de uploads está cheio.");
                }

                reservedBytes += req.file.size;
                reserved = req.file.size;
                const id = crypto.randomUUID();
                finalPath = path.join(UPLOAD_DIR, `${id}${extension}`);
                await fs.promises.rename(req.file.path, finalPath);

                const originalName = path.basename(req.file.originalname.replace(/\\/g, "/"))
                    .replace(/[\u0000-\u001f\u007f]/g, "").slice(0, 180);
                const record = {
                    id,
                    section,
                    subcategory,
                    nome,
                    descricao,
                    fileName: originalName,
                    size: req.file.size,
                    createdAt: new Date().toISOString()
                };
                await persistRecord(record);
                reservedBytes -= reserved;
                reserved = 0;
                res.status(201).json(publicRecord(record));
            } catch (uploadError) {
                if (reserved) reservedBytes -= reserved;
                await fs.promises.rm(req.file.path, { force: true });
                if (finalPath) await fs.promises.rm(finalPath, { force: true });
                next(uploadError);
            }
        });
    });

    app.get("/api/uploads/:id/download", async (req, res, next) => {
        if (!UUID_PATTERN.test(req.params.id)) {
            return res.status(404).json({ error: "Arquivo não encontrado." });
        }
        const record = records.find(item => item.id === req.params.id);
        if (!record) return res.status(404).json({ error: "Arquivo não encontrado." });
        const extension = path.extname(record.fileName).toLowerCase();
        res.set("Cache-Control", "private, no-store");
        res.download(path.join(UPLOAD_DIR, `${record.id}${extension}`), record.fileName, error => {
            if (error && !res.headersSent) next(error);
        });
    });

    app.use(["/data", "/node_modules"], (_req, res) => res.sendStatus(404));
    app.use(["/server.js", "/backend/server.js", "/package.json", "/package-lock.json"], (_req, res) => res.sendStatus(404));
    app.use(express.static(ROOT, {
        dotfiles: "deny",
        index: "index.html",
        fallthrough: true
    }));

    app.use((error, _req, res, _next) => {
        if (res.headersSent) return;
        if (error instanceof multer.MulterError) {
            const message = error.code === "LIMIT_FILE_SIZE"
                ? "O arquivo ultrapassa o limite de 25 MiB."
                : "O envio ultrapassou os limites permitidos.";
            return res.status(400).json({ error: message });
        }
        const status = Number.isInteger(error.status) ? error.status : 500;
        if (status >= 500) console.error("Erro no servidor de uploads:", error);
        res.status(status).json({ error: status >= 500 ? "Erro interno ao processar o envio." : error.message });
    });

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Biblioteca de Alexandria disponível na porta ${PORT}.`);
    });
}

start().catch(error => {
    console.error("Não foi possível iniciar o servidor de uploads:", error);
    process.exitCode = 1;
});
