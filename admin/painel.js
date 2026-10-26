(function () {
    "use strict";

    const API = window.AlexandriaContent;
    const $ = (id) => document.getElementById(id);

    if (!API || typeof API.getNestedItems !== "function") {
        const aviso = $("erroApi");
        if (aviso) aviso.hidden = false;
        return;
    }

    // ------------------------------------------------------------------
    // Seções e categorias. As CHAVES (linux, programacao, IA...) precisam
    // ser as mesmas que o script.js do site usa. Para liberar uma categoria
    // nova no painel, adicione a chave aqui E o botão dela no site.
    // ------------------------------------------------------------------
    const CATALOGO = {
        Isos: {
            rotulo: "ISOs",
            subs: { linux: "Linux", windows: "Windows", jogos: "Jogos (ISOs)" }
        },
        Livros: {
            rotulo: "Livros",
            subs: {
                programacao: "Programação",
                romance: "Romance",
                ciencia: "Ciência e Tecnologia",
                filosofia: "Filosofia",
                aventura: "Aventura"
            }
        },
        Torrent: {
            rotulo: "Jogos",
            subs: { jogos: "Jogos" }
        },
        Sites: {
            rotulo: "Sites",
            subs: {
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

    let itens = API.getNestedItems();
    let editandoId = null;

    // ------------------------------------------------------------------
    // Utilitários
    // ------------------------------------------------------------------
    function novoId() {
        if (window.crypto && typeof window.crypto.randomUUID === "function") {
            return window.crypto.randomUUID();
        }
        return "item-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 8);
    }

    function toast(mensagem, erro) {
        const el = $("toast");
        el.textContent = mensagem;
        el.className = "toast show" + (erro ? " erro" : "");
        clearTimeout(toast.timer);
        toast.timer = setTimeout(() => { el.className = "toast"; }, 3500);
    }

    function rotuloSecao(secao) {
        return (CATALOGO[secao] && CATALOGO[secao].rotulo) || secao;
    }

    function rotuloSub(secao, sub) {
        return (CATALOGO[secao] && CATALOGO[secao].subs[sub]) || sub;
    }

    function persistir() {
        try {
            API.saveNestedItems(itens);
            return true;
        } catch (erro) {
            console.error("Falha ao salvar:", erro);
            toast("Não foi possível salvar: " + erro.message, true);
            itens = API.getNestedItems();
            return false;
        }
    }

    // ------------------------------------------------------------------
    // Selects (formulário e filtros)
    // ------------------------------------------------------------------
    function preencherSecoes(select, comTodas) {
        select.replaceChildren();
        if (comTodas) select.appendChild(new Option("Todas as seções", ""));
        Object.entries(CATALOGO).forEach(([chave, secao]) => {
            select.appendChild(new Option(secao.rotulo, chave));
        });
    }

    function preencherSubs(selectSecao, selectSub, comTodas) {
        const secao = CATALOGO[selectSecao.value];
        selectSub.replaceChildren();
        if (comTodas) selectSub.appendChild(new Option("Todas as categorias", ""));
        if (secao) {
            Object.entries(secao.subs).forEach(([chave, rotulo]) => {
                selectSub.appendChild(new Option(rotulo, chave));
            });
        }
        selectSub.disabled = comTodas && !secao;
    }

    // ------------------------------------------------------------------
    // Formulário
    // ------------------------------------------------------------------
    function lerFormulario() {
        const dados = {
            section: $("secao").value,
            subcategory: $("subcategoria").value,
            nome: $("nome").value.trim(),
            descricao: $("descricao").value.trim(),
            link: $("link").value.trim(),
            imagem: $("imagem").value.trim()
        };
        if (!dados.section || !dados.subcategory) return { erro: "Escolha a seção e a categoria." };
        if (!dados.nome) return { erro: "Informe o nome." };
        if (!dados.link || !API.isSafeUrl(dados.link, false)) {
            return { erro: "Link inválido. Use http(s)://... ou um caminho do próprio site." };
        }
        if (dados.imagem && !API.isSafeUrl(dados.imagem, true)) {
            return { erro: "Imagem inválida. Use http(s)://... ou um caminho do próprio site." };
        }
        return { dados };
    }

    function atualizarPreview() {
        const caixa = $("preview");
        const url = $("imagem").value.trim();
        caixa.replaceChildren();
        if (!url || !API.isSafeUrl(url, true)) {
            caixa.textContent = url ? "imagem inválida" : "sem imagem";
            return;
        }
        const img = new Image();
        img.alt = "Pré-visualização";
        img.onerror = () => { caixa.textContent = "não foi possível carregar a imagem"; };
        img.src = url;
        caixa.appendChild(img);
    }

    function limparCamposItem() {
        ["nome", "descricao", "link", "imagem"].forEach(id => { $(id).value = ""; });
        atualizarPreview();
    }

    function sairDoModoEdicao() {
        editandoId = null;
        $("tituloForm").textContent = "Adicionar item";
        $("btnSalvar").textContent = "Adicionar";
        $("btnCancelar").hidden = true;
        limparCamposItem();
    }

    function iniciarEdicao(id) {
        const item = itens.find(i => i.id === id);
        if (!item) return;
        editandoId = id;

        const selSecao = $("secao");
        if (!CATALOGO[item.section]) selSecao.appendChild(new Option(item.section, item.section));
        selSecao.value = item.section;
        preencherSubs(selSecao, $("subcategoria"), false);
        if (!rotuloSubExiste(item.section, item.subcategory)) {
            $("subcategoria").appendChild(new Option(item.subcategory, item.subcategory));
        }
        $("subcategoria").value = item.subcategory;

        $("nome").value = item.nome;
        $("descricao").value = item.descricao;
        $("link").value = item.link;
        $("imagem").value = item.imagem;
        atualizarPreview();

        $("tituloForm").textContent = "Editar item";
        $("btnSalvar").textContent = "Atualizar";
        $("btnCancelar").hidden = false;
        $("nome").focus();
        $("formItem").scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function rotuloSubExiste(secao, sub) {
        return Boolean(CATALOGO[secao] && CATALOGO[secao].subs[sub]);
    }

    function aoEnviar(evento) {
        evento.preventDefault();
        const { dados, erro } = lerFormulario();
        if (erro) { toast(erro, true); return; }

        const duplicado = itens.some(i =>
            i.id !== editandoId &&
            i.section === dados.section &&
            i.subcategory === dados.subcategory &&
            i.nome.toLowerCase() === dados.nome.toLowerCase()
        );
        if (duplicado && !window.confirm("Já existe um item com esse nome nessa categoria. Salvar mesmo assim?")) {
            return;
        }

        const edicao = Boolean(editandoId);
        if (edicao) {
            const indice = itens.findIndex(i => i.id === editandoId);
            if (indice >= 0) itens[indice] = { id: editandoId, ...dados };
        } else {
            itens.push({ id: novoId(), ...dados });
        }

        if (!persistir()) { renderTudo(); return; }

        if (edicao) {
            sairDoModoEdicao();
            toast("Item atualizado.");
        } else {
            // mantém seção/categoria para cadastrar vários seguidos
            limparCamposItem();
            $("nome").focus();
            toast("Item adicionado.");
        }
        renderTudo();
    }

    function excluir(id) {
        const item = itens.find(i => i.id === id);
        if (!item) return;
        if (!window.confirm(`Excluir "${item.nome}"?`)) return;
        itens = itens.filter(i => i.id !== id);
        if (editandoId === id) sairDoModoEdicao();
        if (!persistir()) { renderTudo(); return; }
        toast("Item excluído.");
        renderTudo();
    }

    // ------------------------------------------------------------------
    // Lista, filtros e resumo
    // ------------------------------------------------------------------
    function itensFiltrados() {
        const secao = $("fSecao").value;
        const sub = $("fSub").value;
        const texto = $("fTexto").value.trim().toLowerCase();
        return itens
            .filter(i => !secao || i.section === secao)
            .filter(i => !sub || i.subcategory === sub)
            .filter(i => !texto ||
                `${i.nome} ${i.descricao} ${i.link}`.toLowerCase().includes(texto))
            .sort((a, b) =>
                rotuloSecao(a.section).localeCompare(rotuloSecao(b.section), "pt-BR") ||
                rotuloSub(a.section, a.subcategory).localeCompare(rotuloSub(b.section, b.subcategory), "pt-BR") ||
                a.nome.localeCompare(b.nome, "pt-BR"));
    }

    function renderChips() {
        const caixa = $("chips");
        caixa.replaceChildren();
        const total = document.createElement("span");
        total.className = "chip";
        const totalNum = document.createElement("b");
        totalNum.textContent = String(itens.length);
        total.append("Total: ", totalNum);
        caixa.appendChild(total);

        Object.keys(CATALOGO).forEach(chave => {
            const qtd = itens.filter(i => i.section === chave).length;
            const chip = document.createElement("span");
            chip.className = "chip";
            const num = document.createElement("b");
            num.textContent = String(qtd);
            chip.append(`${rotuloSecao(chave)}: `, num);
            caixa.appendChild(chip);
        });
    }

    function criarLinha(item) {
        const li = document.createElement("li");
        li.className = "item";

        const thumb = document.createElement("div");
        thumb.className = "thumb";
        if (item.imagem && API.isSafeUrl(item.imagem, true)) {
            const img = new Image();
            img.alt = "";
            img.loading = "lazy";
            img.onerror = () => { img.remove(); thumb.textContent = "sem img"; };
            img.src = item.imagem;
            thumb.appendChild(img);
        } else {
            thumb.textContent = "sem img";
        }

        const info = document.createElement("div");
        const nome = document.createElement("div");
        nome.className = "nome";
        nome.textContent = item.nome;
        const meta = document.createElement("div");
        meta.className = "meta";
        meta.textContent = `${rotuloSecao(item.section)} › ${rotuloSub(item.section, item.subcategory)}`;
        info.append(nome, meta);
        if (item.descricao) {
            const desc = document.createElement("div");
            desc.className = "desc";
            desc.textContent = item.descricao;
            info.appendChild(desc);
        }
        const url = document.createElement("a");
        url.className = "url";
        url.textContent = item.link;
        if (API.isSafeUrl(item.link, false)) {
            url.href = item.link;
            url.target = "_blank";
            url.rel = "noopener noreferrer";
        }
        info.appendChild(url);

        const botoes = document.createElement("div");
        botoes.className = "botoes";
        const editar = document.createElement("button");
        editar.type = "button";
        editar.className = "mini sec";
        editar.textContent = "Editar";
        editar.setAttribute("aria-label", `Editar ${item.nome}`);
        editar.addEventListener("click", () => iniciarEdicao(item.id));
        const apagar = document.createElement("button");
        apagar.type = "button";
        apagar.className = "mini perigo";
        apagar.textContent = "Excluir";
        apagar.setAttribute("aria-label", `Excluir ${item.nome}`);
        apagar.addEventListener("click", () => excluir(item.id));
        botoes.append(editar, apagar);

        li.append(thumb, info, botoes);
        return li;
    }

    function renderLista() {
        const lista = $("lista");
        lista.replaceChildren();
        const visiveis = itensFiltrados();
        $("contagem").textContent = `${visiveis.length} de ${itens.length} itens`;

        if (!visiveis.length) {
            const vazio = document.createElement("li");
            vazio.className = "vazio";
            vazio.textContent = itens.length
                ? "Nenhum item corresponde aos filtros."
                : "Nenhum item cadastrado ainda. Use o formulário ao lado para adicionar o primeiro.";
            lista.appendChild(vazio);
            return;
        }
        visiveis.forEach(item => lista.appendChild(criarLinha(item)));
    }

    function renderTudo() {
        renderChips();
        renderLista();
    }

    // ------------------------------------------------------------------
    // Exportar / importar / apagar tudo
    // ------------------------------------------------------------------
    function exportar() {
        const blob = new Blob([JSON.stringify(itens, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `alexandria-itens-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        toast(`${itens.length} itens exportados.`);
    }

    function normalizarImportado(bruto) {
        if (!bruto || typeof bruto !== "object") return null;
        const texto = (v) => (typeof v === "string" ? v.trim() : "");
        const item = {
            id: texto(bruto.id) || novoId(),
            section: texto(bruto.section),
            subcategory: texto(bruto.subcategory),
            nome: texto(bruto.nome),
            descricao: texto(bruto.descricao),
            link: texto(bruto.link),
            imagem: texto(bruto.imagem)
        };
        if (!rotuloSubExiste(item.section, item.subcategory)) return null;
        if (!item.nome || !item.link) return null;
        if (!API.isSafeUrl(item.link, false)) return null;
        if (item.imagem && !API.isSafeUrl(item.imagem, true)) return null;
        return item;
    }

    function importar(arquivo) {
        const leitor = new FileReader();
        leitor.onerror = () => toast("Não consegui ler o arquivo.", true);
        leitor.onload = () => {
            let dados;
            try {
                dados = JSON.parse(String(leitor.result));
            } catch (erro) {
                toast("Arquivo JSON inválido.", true);
                return;
            }
            if (!Array.isArray(dados)) {
                toast("O JSON precisa ser uma lista de itens.", true);
                return;
            }

            const validos = [];
            let descartados = 0;
            dados.forEach(bruto => {
                const item = normalizarImportado(bruto);
                if (item) validos.push(item); else descartados++;
            });

            if (!validos.length) {
                toast("Nenhum item válido no arquivo.", true);
                return;
            }

            const modo = $("modoImport").value;
            const anterior = itens;
            let adicionados = 0;
            let repetidos = 0;

            if (modo === "substituir") {
                if (!window.confirm(`Substituir os ${itens.length} itens atuais por ${validos.length} do arquivo?`)) return;
                const ids = new Set();
                itens = validos.map(item => {
                    if (ids.has(item.id)) item.id = novoId();
                    ids.add(item.id);
                    return item;
                });
                adicionados = itens.length;
            } else {
                const ids = new Set(itens.map(i => i.id));
                const chaves = new Set(itens.map(i => `${i.section}|${i.subcategory}|${i.nome.toLowerCase()}|${i.link}`));
                validos.forEach(item => {
                    const chave = `${item.section}|${item.subcategory}|${item.nome.toLowerCase()}|${item.link}`;
                    if (chaves.has(chave)) { repetidos++; return; }
                    if (ids.has(item.id)) item.id = novoId();
                    ids.add(item.id);
                    chaves.add(chave);
                    itens.push(item);
                    adicionados++;
                });
            }

            if (!persistir()) { itens = anterior; renderTudo(); return; }
            sairDoModoEdicao();
            renderTudo();
            const partes = [`${adicionados} importados`];
            if (repetidos) partes.push(`${repetidos} repetidos ignorados`);
            if (descartados) partes.push(`${descartados} inválidos descartados`);
            toast(partes.join(" · "));
        };
        leitor.readAsText(arquivo);
    }

    function apagarTudo() {
        if (!itens.length) { toast("Não há itens para apagar."); return; }
        if (!window.confirm(`Apagar TODOS os ${itens.length} itens? Exporte um backup antes se quiser guardá-los.`)) return;
        itens = [];
        sairDoModoEdicao();
        if (!persistir()) { renderTudo(); return; }
        renderTudo();
        toast("Todos os itens foram apagados.");
    }

    // ------------------------------------------------------------------
    // Inicialização
    // ------------------------------------------------------------------
    preencherSecoes($("secao"), false);
    preencherSubs($("secao"), $("subcategoria"), false);
    preencherSecoes($("fSecao"), true);
    preencherSubs($("fSecao"), $("fSub"), true);

    $("secao").addEventListener("change", () => preencherSubs($("secao"), $("subcategoria"), false));
    $("fSecao").addEventListener("change", () => {
        preencherSubs($("fSecao"), $("fSub"), true);
        renderLista();
    });
    $("fSub").addEventListener("change", renderLista);
    $("fTexto").addEventListener("input", renderLista);
    $("imagem").addEventListener("input", atualizarPreview);

    $("formItem").addEventListener("submit", aoEnviar);
    $("btnCancelar").addEventListener("click", sairDoModoEdicao);

    $("btnExportar").addEventListener("click", exportar);
    $("btnImportar").addEventListener("click", () => $("arquivoImport").click());
    $("arquivoImport").addEventListener("change", (e) => {
        const arquivo = e.target.files && e.target.files[0];
        if (arquivo) importar(arquivo);
        e.target.value = "";
    });
    $("btnLimpar").addEventListener("click", apagarTudo);

    renderTudo();
})();