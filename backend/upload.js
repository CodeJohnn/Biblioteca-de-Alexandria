"use strict";

const form = document.getElementById("uploadForm");
const sectionSelect = form.elements.namedItem("section");
const categorySelect = form.elements.namedItem("subcategory");
const fileInput = form.elements.namedItem("arquivo");
const submitButton = document.getElementById("submitUpload");
const statusMessage = document.getElementById("uploadStatus");
const fileHint = document.getElementById("fileHint");
const serverStatus = document.getElementById("serverStatus");
let categories = [];
let maxFileSize = 25 * 1024 * 1024;

function setStatus(message, isError = false) {
    statusMessage.replaceChildren();
    statusMessage.classList.toggle("error", isError);
    statusMessage.textContent = message;
}

function setServerUnavailable(unavailable) {
    if (serverStatus) serverStatus.hidden = !unavailable;
}

function updateCategories() {
    const section = categories.find(item => item.key === sectionSelect.value);
    categorySelect.replaceChildren(new Option(section ? "Selecione uma categoria" : "Selecione uma seção", ""));
    if (!section) {
        categorySelect.disabled = true;
        return;
    }
    section.categories.forEach(category => categorySelect.add(new Option(category.label, category.key)));
    categorySelect.disabled = false;
}

async function loadUploadOptions() {
    try {
        const response = await fetch("/api/categories", { headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        if (!Array.isArray(data.sections) || !Number.isSafeInteger(data.maxFileSize)) {
            throw new Error("A resposta de categorias tem formato inválido.");
        }
        categories = data.sections;
        maxFileSize = data.maxFileSize;
        sectionSelect.replaceChildren(new Option("Selecione uma seção", ""));
        categories.forEach(section => sectionSelect.add(new Option(section.label, section.key)));
        sectionSelect.disabled = false;
        submitButton.disabled = false;
        setServerUnavailable(false);
        fileHint.textContent =
            "PDF, TXT, MD, PNG, JPG, WEBP ou GIF. Máximo: 25 MiB. Os formatos são verificados no servidor.";
    } catch (error) {
        console.error("Não foi possível carregar as categorias de upload:", error);
        setServerUnavailable(true);
        setStatus("Não foi possível conectar ao servidor. O envio de arquivos está indisponível.", true);
    }
}

sectionSelect.addEventListener("change", updateCategories);

fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && file.size > maxFileSize) {
        fileInput.value = "";
        setStatus("O arquivo ultrapassa o limite de 25 MiB.", true);
    } else {
        setStatus("");
    }
});

form.addEventListener("submit", async event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const file = fileInput.files[0];
    if (!file) return setStatus("Selecione um arquivo.", true);
    if (file.size > maxFileSize) return setStatus("O arquivo ultrapassa o limite de 25 MiB.", true);

    const data = new FormData(form);
    submitButton.disabled = true;
    setStatus("Enviando e validando o arquivo...");
    try {
        const response = await fetch("/api/uploads", {
            method: "POST",
            body: data,
            headers: { Accept: "application/json" }
        });
        const result = await response.json();
        if (!response.ok) {
            if (response.status >= 500) setServerUnavailable(true);
            throw new Error(result.error || `O servidor respondeu com HTTP ${response.status}.`);
        }

        setServerUnavailable(false);
        form.reset();
        updateCategories();
        setStatus("");
        const confirmation = document.createElement("span");
        confirmation.textContent = "Arquivo enviado! Ele já está disponível na categoria selecionada. ";
        const link = document.createElement("a");
        link.href = result.link;
        link.textContent = "Baixar arquivo";
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        statusMessage.append(confirmation, link);
    } catch (error) {
        console.error("Falha ao enviar arquivo:", error);
        if (error instanceof TypeError) setServerUnavailable(true);
        setStatus(error.message || "Não foi possível enviar o arquivo.", true);
    } finally {
        submitButton.disabled = false;
    }
});

loadUploadOptions();
