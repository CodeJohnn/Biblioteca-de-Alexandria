// ======================================================================
// PESQUISA GLOBAL
// Depende das variáveis do script.js: categorias, livros, jogos, Sites,
// dadosCursos, dadosAndroid e das funções abrirPaginaJogo / fecharPaginaJogo.
// Cole no FINAL do script.js (ou carregue como arquivo separado DEPOIS dele).
// ======================================================================

console.log('[busca-global] arquivo carregado');

// Tira acentos e deixa minúsculo: "acao" encontra "Ação"
const normalizarBusca = (t) =>
    String(t ?? '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

let indiceGlobal = null;

// Junta todos os dados do site em uma lista única
function montarIndiceGlobal() {
    const indice = [];

    const add = (secao, cat, item, tipo = 'link') => {
        if (!item || !item.nome) return;
        indice.push({
            secao,
            cat,
            tipo,
            nome: item.nome,
            imagem: item.imagem,
            link: item.link,
            busca: normalizarBusca(`${item.nome} ${secao} ${cat}`)
        });
    };

    // Cada fonte fica protegida: se uma falhar, as outras continuam
    const fonte = (rotulo, fn) => {
        try { fn(); } catch (err) { console.error(`[busca-global] falha em "${rotulo}":`, err); }
    };

    fonte('ISOs', () => Object.entries(categorias).forEach(([cat, l]) => l.forEach(i => add('ISOs', cat, i))));
    fonte('Livros', () => Object.entries(livros).forEach(([cat, l]) => l.forEach(i => add('Livros', cat, i))));
    // jogos abrem a página própria do jogo (tipo 'jogo')
    fonte('Jogos', () => Object.entries(jogos).forEach(([cat, l]) => l.forEach(i => add('Jogos', cat, i, 'jogo'))));
    fonte('Sites', () => Object.entries(Sites).forEach(([cat, l]) => l.forEach(i => add('Sites', cat, i))));
    fonte('Cursos', () => Object.entries(dadosCursos).forEach(([cat, l]) => l.forEach(i => add('Cursos', cat, i))));
    fonte('Android', () => Object.entries(dadosAndroid).forEach(([cat, l]) => l.forEach(i => add('Android', cat, i))));

    // Itens cadastrados pelo AlexandriaContent
    fonte('AlexandriaContent', () => {
        if (!window.AlexandriaContent) return;
        const fontes = [
            ['Isos', Object.keys(categorias), 'ISOs', 'link'],
            ['Livros', Object.keys(livros), 'Livros', 'link'],
            ['Sites', Object.keys(Sites), 'Sites', 'link'],
            ['Torrent', Object.keys(jogos), 'Jogos', 'link']
        ];
        fontes.forEach(([secaoApi, cats, rotulo, tipo]) => {
            cats.forEach(cat => {
                try {
                    (window.AlexandriaContent.getItemsFor(secaoApi, cat, []) || [])
                        .forEach(i => add(rotulo, cat, i, tipo));
                } catch (err) {
                    console.error(`[busca-global] AlexandriaContent ${secaoApi}/${cat}:`, err);
                }
            });
        });
    });

    fonte('DevTools', () => {
        const snippets = window.AlexandriaDevTools?.getItems() || [];
        snippets.forEach(item => {
            indice.push({
                id: item.id,
                secao: 'DevTools',
                cat: item.language,
                tipo: 'snippet',
                nome: item.title,
                busca: normalizarBusca(`${item.title} ${item.description} ${item.language} ${item.code}`)
            });
        });
    });

    console.log(`[busca-global] índice montado com ${indice.length} itens`);
    return indice;
}

// Todas as palavras digitadas precisam aparecer no nome, na seção ou na categoria
function pesquisarGlobal(termo) {
    const palavras = normalizarBusca(termo).split(/\s+/).filter(Boolean);
    if (!palavras.length) return [];
    if (!indiceGlobal) indiceGlobal = montarIndiceGlobal();
    return indiceGlobal.filter(r => palavras.every(p => r.busca.includes(p)));
}

// Desenha os resultados (sem innerHTML, para evitar injeção de HTML)
function renderResultadosGlobais(resultados, termo) {
    const ul = document.getElementById('resultadosGlobais');
    if (!ul) return;
    ul.replaceChildren();
    if (!termo.trim()) return;

    if (!resultados.length) {
        const li = document.createElement('li');
        li.style.justifyContent = 'center';
        li.textContent = `Nenhum resultado para "${termo}"`;
        ul.appendChild(li);
        return;
    }

    const contador = document.createElement('li');
    contador.className = 'resultados-contador';
    contador.textContent = `${resultados.length} resultado${resultados.length === 1 ? '' : 's'}`;
    ul.appendChild(contador);

    resultados.forEach(r => {
        const li = document.createElement('li');

        if (r.imagem) {
            const img = document.createElement('img');
            img.src = r.imagem;
            img.alt = r.nome;
            img.className = 'list-icon';
            li.appendChild(img);
        }

        const a = document.createElement('a');
        a.textContent = r.nome;

        if (r.tipo === 'jogo') {
            a.href = '#';
            a.addEventListener('click', (e) => {
                e.preventDefault();
                fecharPaginaJogo();               // fecha uma página de jogo que já esteja aberta
                abrirPaginaJogo(r.cat, r.nome);   // abre a do jogo clicado
            });
        } else if (r.tipo === 'snippet') {
            a.href = '#';
            a.addEventListener('click', (e) => {
                e.preventDefault();
                window.AlexandriaDevTools?.openItem(r.id);
            });
        } else {
            a.href = r.link || '#';
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
        }
        li.appendChild(a);

        const tag = document.createElement('small');
        tag.textContent = `${r.secao} › ${r.cat}`;
        li.appendChild(tag);

        ul.appendChild(li);
    });
}

// Liga a barra de pesquisa da página (#searchForm / #searchInput)
function iniciarBuscaGlobal() {
    const form = document.getElementById('searchForm');
    const input = document.getElementById('searchInput');
    if (!form || !input) {
        console.error('[busca-global] #searchForm ou #searchInput não encontrado nesta página');
        return;
    }

    // Cria a lista de resultados logo abaixo da barra, se ainda não existir
    let lista = document.getElementById('resultadosGlobais');
    if (!lista) {
        lista = document.createElement('ul');
        lista.id = 'resultadosGlobais';
        lista.className = 'resultados-globais';
        (form.closest('.search-container') || form).after(lista);
    }

    const buscar = () => {
        try {
            renderResultadosGlobais(pesquisarGlobal(input.value), input.value);
        } catch (err) {
            console.error('[busca-global] erro ao pesquisar:', err);
        }
    };

    // Botão "Pesquisar" ou Enter: não recarrega a página
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        buscar();
    });

    // Pesquisa enquanto digita
    input.addEventListener('input', buscar);

    // Esc limpa a busca
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            input.value = '';
            buscar();
        }
    });

    console.log('[busca-global] busca ligada');
}

// Roda agora se a página já carregou, ou espera carregar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarBuscaGlobal);
} else {
    iniciarBuscaGlobal();
}

document.addEventListener('alexandria:uploads-updated', () => {
    indiceGlobal = null;
    const input = document.getElementById('searchInput');
    if (input?.value.trim()) renderResultadosGlobais(pesquisarGlobal(input.value), input.value);
});

document.addEventListener('alexandria:devtools-updated', () => {
    indiceGlobal = null;
    const input = document.getElementById('searchInput');
    if (input?.value.trim()) renderResultadosGlobais(pesquisarGlobal(input.value), input.value);
});