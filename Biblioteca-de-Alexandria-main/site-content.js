(function () {
    "use strict";

    const STORAGE_KEY = "bibliotecaAlexandria.itensInternos.v1";
    const defaultBanners = [
        {
            nome: "Resident Evil 4 Remake",
            imagem: "Assets/icon/Categorias 2/Torrent/Jp/8.png"
        },
        {
            nome: "Hollow Knight Silksong",
            imagem: "Assets/icon/Categorias 2/Torrent/Jp/5.png"
        },
        {
            nome: "Homem aranha 2 - 2023",
            imagem: "Assets/icon/Categorias 2/Torrent/Jp/3.png"
        },
        {
            nome: "Red Dead Redemption 2",
            imagem: "Assets/icon/Categorias 2/Torrent/Jp/33.png"
        }
    ];

    function getNestedItems() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            if (saved === null) return [];
            const items = JSON.parse(saved);
            if (!Array.isArray(items) || !items.every(item =>
                item &&
                typeof item.id === "string" &&
                typeof item.section === "string" &&
                typeof item.subcategory === "string" &&
                typeof item.nome === "string" &&
                typeof item.descricao === "string" &&
                typeof item.link === "string" &&
                typeof item.imagem === "string"
            )) {
                throw new Error("Os itens internos salvos possuem formato inválido.");
            }
            return items;
        } catch (error) {
            console.error("Não foi possível carregar os itens internos:", error);
            return [];
        }
    }

    function saveNestedItems(items) {
        if (!Array.isArray(items) || !items.every(item =>
            item &&
            typeof item.id === "string" &&
            typeof item.section === "string" &&
            typeof item.subcategory === "string" &&
            typeof item.nome === "string" &&
            typeof item.descricao === "string" &&
            typeof item.link === "string" &&
            typeof item.imagem === "string"
        )) {
            throw new TypeError("A lista contém um item interno inválido.");
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }

    function getItemsFor(section, subcategory, originalItems) {
        const addedItems = getNestedItems()
            .filter(item => item.section === section && item.subcategory === subcategory)
            .map(({ nome, link, imagem, descricao }) => ({ nome, link, imagem, descricao }));
        return [...originalItems, ...addedItems];
    }

    function isSafeUrl(value, image) {
        const url = value.trim();
        if (!url || /[\u0000-\u001f]/.test(url) || /^\/\//.test(url)) return false;
        if (/^[a-z][a-z0-9+.-]*:/i.test(url) && !/^https?:\/\//i.test(url)) return false;
        if (image && url.startsWith("#")) return false;
        return true;
    }

    window.AlexandriaContent = {
        getItems: () => defaultBanners.map(item => ({ ...item })),
        getNestedItems,
        saveNestedItems,
        getItemsFor,
        isSafeUrl
    };
})();
