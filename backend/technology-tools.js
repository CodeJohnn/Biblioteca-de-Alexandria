"use strict";

(() => {
    // Cadastre as ferramentas aqui. Cada item aparece para todos os visitantes.
    // { name: "Nome", category: "Desenvolvimento", description: "Descrição", url: "https://exemplo.com" },
    const tools = [];
    const tabs = [...document.querySelectorAll(".devtools-tab")];
    const list = document.getElementById("technologyToolsList");
    const search = document.getElementById("technologyToolsSearch");
    const count = document.getElementById("technologyToolsCount");
    if (!list || !search || !count) return;

    function selectTab(tab, focus = false) {
        tabs.forEach(candidate => {
            const selected = candidate === tab;
            candidate.setAttribute("aria-selected", String(selected));
            candidate.tabIndex = selected ? 0 : -1;
            document.getElementById(candidate.getAttribute("aria-controls")).hidden = !selected;
        });
        if (focus) tab.focus();
    }

    tabs.forEach((tab, index) => {
        tab.addEventListener("click", () => selectTab(tab));
        tab.addEventListener("keydown", event => {
            let target;
            if (event.key === "ArrowRight") target = tabs[(index + 1) % tabs.length];
            if (event.key === "ArrowLeft") target = tabs[(index + tabs.length - 1) % tabs.length];
            if (event.key === "Home") target = tabs[0];
            if (event.key === "End") target = tabs[tabs.length - 1];
            if (target) {
                event.preventDefault();
                selectTab(target, true);
            }
        });
    });

    // A busca global de códigos deve sempre abrir a aba correspondente.
    const originalOpenItem = window.AlexandriaDevTools?.openItem;
    if (originalOpenItem) window.AlexandriaDevTools.openItem = function (id) {
        selectTab(document.getElementById("devtoolsCodesTab"));
        originalOpenItem.call(this, id);
    };

    const normalize = value => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const validTools = tools.filter(tool => {
        try {
            return tool.name && ["https:", "http:"].includes(new URL(tool.url).protocol);
        } catch { return false; }
    });

    function render() {
        const query = normalize(search.value.trim());
        const matches = validTools.filter(tool => normalize(`${tool.name} ${tool.category || ""} ${tool.description || ""}`).includes(query));
        count.textContent = `${matches.length} ferramenta${matches.length === 1 ? "" : "s"} encontrada${matches.length === 1 ? "" : "s"}.`;
        list.replaceChildren();
        if (!matches.length) {
            const empty = document.createElement("li");
            empty.className = "devtools-empty";
            empty.textContent = validTools.length ? "Nenhuma ferramenta corresponde à busca." : "Nenhuma ferramenta cadastrada ainda. Em breve, os links estarão reunidos aqui.";
            list.appendChild(empty);
        }
        matches.forEach(tool => {
            const entry = document.createElement("li");
            entry.className = "devtools-entry";
            const heading = document.createElement("div");
            heading.className = "devtools-entry-heading";
            const title = document.createElement("h3");
            title.textContent = tool.name;
            const link = document.createElement("a");
            link.className = "devtools-copy";
            link.textContent = "Acessar ferramenta ↗";
            link.href = tool.url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.setAttribute("aria-label", `Acessar ${tool.name} (abre em nova aba)`);
            heading.append(title, link);
            const category = document.createElement("code");
            category.textContent = tool.category || "Tecnologia";
            const description = document.createElement("p");
            description.textContent = tool.description || "";
            entry.append(heading, category, description);
            list.appendChild(entry);
        });
    }
    search.addEventListener("input", render);
    render();
})();
