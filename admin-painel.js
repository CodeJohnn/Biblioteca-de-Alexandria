(function () {
    "use strict";

    const USERNAME = "admin";
    const PASSWORD = "admin";
    const AUTH_KEY = "bibliotecaAlexandria.adminLogado";
    const categories = {
        Isos: [
            ["linux", "Linux"],
            ["windows", "Windows"],
            ["jogos", "Jogos"]
        ],
        Livros: [
            ["programacao", "Programação"],
            ["aventura", "Aventura"],
            ["romance", "Romance"],
            ["ciencia", "Ciência"],
            ["filosofia", "Filosofia"]
        ],
        Torrent: [["jogos", "Jogos para PC"]],
        Sites: [
            ["IA", "Inteligência Artificial"],
            ["Filmes_e_Series", "Filmes e Séries"],
            ["conversores", "Conversores"],
            ["Wallpapers", "Wallpapers"],
            ["Editores", "Editores"],
            ["Dark_Web", "Dark Web"],
            ["Esporte_e_Tv_aberta", "Esporte e TV aberta"],
            ["Fontes", "Fontes"]
        ]
    };

    const loginPanel = document.getElementById("login-panel");
    const dashboard = document.getElementById("dashboard");
    const loginForm = document.getElementById("login-form");
    const loginError = document.getElementById("login-error");
    const form = document.getElementById("item-form");
    const list = document.getElementById("item-list");
    const count = document.getElementById("item-count");
    const message = document.getElementById("form-message");
    const cancelEdit = document.getElementById("cancel-edit");
    const sectionSelect = document.getElementById("item-section");
    const subcategorySelect = document.getElementById("item-subcategory");
    let items = window.AlexandriaContent.getNestedItems();
    let editingItemId = null;

    function updateSubcategories(selectedValue) {
        const options = categories[sectionSelect.value];
        subcategorySelect.replaceChildren(...options.map(([value, label]) => {
            const option = document.createElement("option");
            option.value = value;
            option.textContent = label;
            return option;
        }));
        if (selectedValue && options.some(([value]) => value === selectedValue)) {
            subcategorySelect.value = selectedValue;
        }
    }

    function renderItems() {
        const section = sectionSelect.value;
        const subcategory = subcategorySelect.value;
        const visibleItems = items.filter(item =>
            item.section === section && item.subcategory === subcategory
        );
        count.textContent = `${visibleItems.length} ${visibleItems.length === 1 ? "item" : "itens"}`;
        if (!visibleItems.length) {
            const empty = document.createElement("p");
            empty.className = "empty-list";
            empty.textContent = "Nenhum conteúdo adicionado nesta categoria. Os itens originais do site continuam disponíveis.";
            list.replaceChildren(empty);
            return;
        }

        const fragment = document.createDocumentFragment();
        visibleItems.forEach(item => {
            const row = document.createElement("article");
            row.className = "managed-item";
            const details = document.createElement("div");
            const title = document.createElement("h3");
            title.textContent = item.nome;
            const summary = document.createElement("p");
            summary.textContent = item.link;
            details.append(title, summary);

            const actions = document.createElement("div");
            actions.className = "item-actions";
            const edit = document.createElement("button");
            edit.type = "button";
            edit.className = "secondary-button";
            edit.textContent = "Editar";
            edit.addEventListener("click", () => editItem(item.id));
            const remove = document.createElement("button");
            remove.type = "button";
            remove.className = "delete-button";
            remove.textContent = "Excluir";
            remove.addEventListener("click", () => removeItem(item.id));
            actions.append(edit, remove);
            row.append(details, actions);
            fragment.appendChild(row);
        });
        list.replaceChildren(fragment);
    }

    function setAuthenticated(isAuthenticated) {
        loginPanel.hidden = isAuthenticated;
        dashboard.hidden = !isAuthenticated;
        if (isAuthenticated) renderItems();
    }

    function resetForm() {
        form.reset();
        editingItemId = null;
        document.getElementById("item-id").value = "";
        document.getElementById("form-heading").textContent = "Adicionar conteúdo";
        cancelEdit.hidden = true;
        updateSubcategories();
        message.textContent = "";
        message.classList.remove("error-message");
    }

    function persistItems() {
        try {
            window.AlexandriaContent.saveNestedItems(items);
            return true;
        } catch (error) {
            console.error("Falha ao salvar conteúdo da categoria:", error);
            message.classList.add("error-message");
            message.textContent = "Não foi possível salvar. Verifique o espaço disponível no navegador.";
            return false;
        }
    }

    function editItem(id) {
        const item = items.find(entry => entry.id === id);
        if (!item) return;
        editingItemId = item.id;
        sectionSelect.value = item.section;
        updateSubcategories(item.subcategory);
        document.getElementById("item-id").value = item.id;
        document.getElementById("item-title").value = item.nome;
        document.getElementById("item-description").value = item.descricao;
        document.getElementById("item-url").value = item.link;
        document.getElementById("item-image").value = item.imagem;
        document.getElementById("form-heading").textContent = "Editar conteúdo";
        cancelEdit.hidden = false;
        message.textContent = "";
        renderItems();
        document.getElementById("item-title").focus();
    }

    function removeItem(id) {
        const item = items.find(entry => entry.id === id);
        if (!item || !window.confirm(`Excluir "${item.nome}" desta categoria?`)) return;
        items = items.filter(entry => entry.id !== id);
        if (!persistItems()) return;
        if (editingItemId === id) resetForm();
        renderItems();
        message.classList.remove("error-message");
        message.textContent = "Conteúdo excluído.";
    }

    loginForm.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(loginForm);
        const valid = data.get("username") === USERNAME && data.get("password") === PASSWORD;
        loginError.hidden = valid;
        if (valid) {
            sessionStorage.setItem(AUTH_KEY, "true");
            loginForm.reset();
            setAuthenticated(true);
        }
    });

    document.getElementById("logout-button").addEventListener("click", () => {
        sessionStorage.removeItem(AUTH_KEY);
        resetForm();
        setAuthenticated(false);
    });

    sectionSelect.addEventListener("change", () => {
        updateSubcategories();
        renderItems();
    });
    subcategorySelect.addEventListener("change", renderItems);
    cancelEdit.addEventListener("click", resetForm);

    form.addEventListener("submit", event => {
        event.preventDefault();
        const data = new FormData(form);
        const entry = {
            id: editingItemId || `item-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
            section: data.get("section"),
            subcategory: data.get("subcategory"),
            nome: data.get("title").trim(),
            descricao: data.get("description").trim(),
            link: data.get("url").trim(),
            imagem: data.get("image").trim()
        };

        if (!window.AlexandriaContent.isSafeUrl(entry.link, false)) {
            message.textContent = "Informe um link http(s) ou um caminho relativo válido.";
            message.classList.add("error-message");
            return;
        }
        if (entry.imagem && !window.AlexandriaContent.isSafeUrl(entry.imagem, true)) {
            message.textContent = "A imagem deve usar um endereço http(s) ou caminho relativo seguro.";
            message.classList.add("error-message");
            return;
        }

        const previousItems = items;
        if (editingItemId) {
            items = items.map(item => item.id === editingItemId ? entry : item);
        } else {
            items = [...items, entry];
        }
        if (!persistItems()) {
            items = previousItems;
            return;
        }

        resetForm();
        renderItems();
        message.textContent = "Conteúdo salvo. Atualize a página inicial para ver a alteração.";
    });

    updateSubcategories();
    setAuthenticated(sessionStorage.getItem(AUTH_KEY) === "true");
})();
