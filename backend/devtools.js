"use strict";

(() => {
    const list = document.getElementById("devtoolsList");
    const form = document.getElementById("devtoolsForm");
    const status = document.getElementById("devtoolsStatus");
    const submitButton = form?.querySelector('button[type="submit"]');
    const serverWarning = document.getElementById("devtoolsServerWarning");
    const items = [];
    const languages = [
        ["plaintext", "Texto simples"], ["javascript", "JavaScript"], ["typescript", "TypeScript"],
        ["python", "Python"], ["html", "HTML"], ["css", "CSS"], ["json", "JSON"], ["bash", "Bash"],
        ["sql", "SQL"], ["c", "C"], ["cpp", "C++"], ["csharp", "C#"], ["java", "Java"],
        ["php", "PHP"], ["go", "Go"], ["rust", "Rust"], ["powershell", "PowerShell"]
    ];

    function setStatus(message, error = false) {
        if (!status) return;
        status.textContent = message;
        status.classList.toggle("error", error);
    }

    function languageName(key) {
        return languages.find(([value]) => value === key)?.[1] || key;
    }

    async function copyCode(code, button) {
        try {
            await navigator.clipboard.writeText(code);
        } catch (error) {
            const temporary = document.createElement("textarea");
            temporary.value = code;
            temporary.setAttribute("readonly", "");
            temporary.style.position = "fixed";
            temporary.style.opacity = "0";
            document.body.appendChild(temporary);
            temporary.select();
            const copied = document.execCommand("copy");
            temporary.remove();
            if (!copied) {
                console.error("Não foi possível copiar o código:", error);
                button.textContent = "Falha ao copiar";
                return;
            }
        }
        button.textContent = "Copiado!";
        window.setTimeout(() => { button.textContent = "Copiar código"; }, 1800);
    }

    function renderItems() {
        if (!list) return;
        list.replaceChildren();
        if (!items.length) {
            const empty = document.createElement("li");
            empty.className = "devtools-empty";
            empty.textContent = "Nenhum código cadastrado ainda.";
            list.appendChild(empty);
            return;
        }

        [...items].reverse().forEach(item => {
            const entry = document.createElement("li");
            entry.className = "devtools-entry";
            entry.dataset.snippetId = item.id;

            const heading = document.createElement("div");
            heading.className = "devtools-entry-heading";
            const title = document.createElement("h3");
            title.textContent = item.title;
            const copyButton = document.createElement("button");
            copyButton.type = "button";
            copyButton.className = "devtools-copy";
            copyButton.textContent = "Copiar código";
            copyButton.addEventListener("click", () => copyCode(item.code, copyButton));
            heading.append(title, copyButton);
            entry.appendChild(heading);

            const language = document.createElement("code");
            language.textContent = languageName(item.language);
            entry.appendChild(language);

            if (item.description) {
                const description = document.createElement("p");
                description.textContent = item.description;
                entry.appendChild(description);
            }

            const pre = document.createElement("pre");
            const code = document.createElement("code");
            code.textContent = item.code;
            pre.appendChild(code);
            entry.appendChild(pre);
            list.appendChild(entry);
        });
    }

    async function refresh() {
        if (!list && !form) return;
        try {
            const response = await fetch("/api/devtools", { headers: { Accept: "application/json" } });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const result = await response.json();
            if (!Array.isArray(result)) throw new Error("A resposta de DevTools tem formato inválido.");
            items.splice(0, items.length, ...result);
            renderItems();
            if (serverWarning) serverWarning.hidden = true;
            window.dispatchEvent(new CustomEvent("alexandria:devtools-updated"));
        } catch (error) {
            console.error("Não foi possível carregar a biblioteca DevTools:", error);
            if (serverWarning) serverWarning.hidden = false;
            if (list && !items.length) {
                list.replaceChildren();
                const offline = document.createElement("li");
                offline.className = "devtools-empty";
                offline.textContent = "Servidor indisponível. Os códigos públicos não puderam ser carregados.";
                list.appendChild(offline);
            }
        }
    }

    if (form) {
        const languageSelect = form.elements.namedItem("language");
        languageSelect.replaceChildren(...languages.map(([value, label]) => new Option(label, value)));
        form.addEventListener("submit", async event => {
            event.preventDefault();
            if (!form.reportValidity()) return;
            submitButton.disabled = true;
            setStatus("Publicando código...");
            try {
                const response = await fetch("/api/devtools", {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Accept: "application/json" },
                    body: JSON.stringify({
                        title: form.elements.namedItem("title").value,
                        description: form.elements.namedItem("description").value,
                        language: languageSelect.value,
                        code: form.elements.namedItem("code").value
                    })
                });
                const result = await response.json();
                if (!response.ok) throw new Error(result.error || `HTTP ${response.status}`);
                form.reset();
                setStatus("Código publicado para todos os visitantes.");
                await refresh();
            } catch (error) {
                console.error("Não foi possível publicar o código:", error);
                setStatus(error.message || "Não foi possível conectar ao servidor.", true);
            } finally {
                submitButton.disabled = false;
            }
        });
    }

    window.AlexandriaDevTools = {
        getItems: () => items.map(item => ({ ...item })),
        openItem(id) {
            const modal = document.getElementById("modalDevTools");
            if (modal) window.openModal?.("modalDevTools");
            const entry = list?.querySelector(`[data-snippet-id="${CSS.escape(id)}"]`);
            entry?.scrollIntoView({ behavior: "smooth", block: "center" });
            if (entry) {
                entry.classList.add("devtools-entry-highlight");
                window.setTimeout(() => entry.classList.remove("devtools-entry-highlight"), 1600);
            }
        }
    };

    refresh();
})();
