            // Lista de anúncios (use as imagens dos seus jogos torrent)
        

/* PEGA TODOS OS LINKS */

const links = document.querySelectorAll("a");

/* OVERLAY */

const transition =
document.querySelector(".page-transition");

/* CLIQUE */

links.forEach(link => {

    link.addEventListener("click", function(e){

        const href =
        this.getAttribute("href");

        /* IGNORA LINKS VAZIOS */

        if(
            !href ||
            href === "#" ||
            href === "?" ||
            href.startsWith("javascript")
        ){
            return;
        }

        e.preventDefault();

        if (transition) {
            transition.classList.add("active");
            setTimeout(() => {
                window.location.href = href;
            }, 450);
        } else {
            // Se não houver elemento de transição, navega imediatamente
            window.location.href = href;
        }

    });

});

/* REMOVE AO CARREGAR */

window.addEventListener("load", () => {

    if (transition) {
        transition.classList.remove("active");
    }

});


            const anuncios = [
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
                // Adicione mais jogos conforme desejar
            ];

        let anuncioAtual = 0;
        let intervaloAnuncio;

        function mostrarAnuncio(idx) {
            const slide = document.getElementById('anuncio-slide');
            if (!slide) return;
            slide.innerHTML = `<img src="${anuncios[idx].imagem}" alt="${anuncios[idx].nome}" style="width:100%; height:100%; object-fit:cover; border-radius:16px; box-shadow:0 0 16px #00ff00; background:#000; display:block;">`;
        }

        function iniciarRotacao() {
            if (intervaloAnuncio) clearInterval(intervaloAnuncio);
            intervaloAnuncio = setInterval(proximoAnuncio, 5000);
        }

        function proximoAnuncio() {
            anuncioAtual = (anuncioAtual + 1) % anuncios.length;
            mostrarAnuncio(anuncioAtual);
        }

            // Função auxiliar: encontra a categoria do jogo pelo nome (procura exata e parcial)
            function findMatchJogo(nomeJogo) {
                // evita erro se a variável de dados não existe ainda
                if (typeof jogos === 'undefined') return null;
                const termo = (nomeJogo || '').toLowerCase().trim();
                // Procura correspondência exata
                for (const key in jogos) {
                    if (!Object.prototype.hasOwnProperty.call(jogos, key)) continue;
                    const itemExata = (jogos[key] || []).find(item => (item.nome || '').toLowerCase() === termo);
                    if (itemExata) return { cat: key, item: itemExata };
                }
                // Procura correspondência parcial
                for (const key in jogos) {
                    if (!Object.prototype.hasOwnProperty.call(jogos, key)) continue;
                    const itemParcial = (jogos[key] || []).find(item => (item.nome || '').toLowerCase().includes(termo));
                    if (itemParcial) return { cat: key, item: itemParcial };
                }
                return null;
            }

            // Função para abrir a página do jogo ao clicar na imagem
            const anuncioSlide = document.getElementById('anuncio-slide');
            if (anuncioSlide) {
                anuncioSlide.style.cursor = 'pointer';
                anuncioSlide.onclick = function () {
                const nomeJogo = anuncios[anuncioAtual].nome;
                console.log('anuncio clicado:', nomeJogo);
                const match = findMatchJogo(nomeJogo);
                if (match) {
                    console.log('encontrado match em categoria', match.cat, 'item', match.item.nome);
                    abrirPaginaJogo(match.cat, match.item.nome);
                } else {
                    console.log('nenhum match direto encontrado, abrindo modal e pesquisando por', nomeJogo);
                    openModal('modalJogos');
                    setTimeout(() => showJogos('jogos', nomeJogo), 60);
                }
            };
            }

            // Botões de navegação
            const btnPrev = document.getElementById('anuncio-prev');
            if (btnPrev) {
                btnPrev.onclick = function () {
                anuncioAtual = (anuncioAtual - 1 + anuncios.length) % anuncios.length;
                mostrarAnuncio(anuncioAtual);
                iniciarRotacao(); // Reinicia o tempo ao clicar
            };
            }
            const btnNext = document.getElementById('anuncio-next');
            if (btnNext) {
                btnNext.onclick = function () {
                proximoAnuncio();
                iniciarRotacao(); // Reinicia o tempo ao clicar
            };
            }

            // Inicializa o anúncio
            mostrarAnuncio(anuncioAtual);
            iniciarRotacao();

        const container = document.querySelector('.lista-codigos');
        // Adicionado verificação para garantir que o container exista antes de tentar popular
        if (container) {
            for (let i = 1; i <= 50; i++) {
                const div = document.createElement('div');
                div.textContent = `CÓDIGO LIMPO ${i}`;
                container.appendChild(div);
            }
        }

        const dadosAndroid = {
            apps: [
                { nome: "App Exemplo", link: "https://play.google.com/", imagem: "Assets/banner/p.png.png" }
            ],
            jogos: [
                { nome: "Jogo Mobile Exemplo", link: "https://play.google.com/", imagem: "Assets/icon/Categorias/jogos.png" }
            ],
            sites: [
                { nome: "Site Útil Exemplo", link: "https://site.com/", imagem: "Assets/banner/p.png.png" }
            ]
        };

        function showAndroid(cat, termoPesquisa = '') {
            document.getElementById("android-categorias").style.display = "none";
            document.getElementById("android-arquivos").style.display = "block";
            document.getElementById("voltarAndroid").style.display = "inline-block";
            document.getElementById("search-container-android").style.display = "flex";

            const ul = document.getElementById("android-arquivos");
            ul.dataset.categoria = cat;
            const termo = (termoPesquisa || document.getElementById("searchInputAndroid").value || '').toLowerCase();
            const appsFiltrados = (dadosAndroid[cat] || []).filter(item => item.nome.toLowerCase().includes(termo));

            const titulos = { apps: "Aplicativos Android", jogos: "Jogos Android", sites: "Sites úteis" };
            document.querySelector("#modalJogosMobile .modal-card h2").textContent = titulos[cat] || "Android";

            ul.innerHTML = appsFiltrados.length === 0 ? `<li style="justify-content:center;">Nenhum item encontrado para "${termo}"</li>` : '';

            appsFiltrados.forEach(item => {
                const imageHtml = item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" class="list-icon">` : '<i class="fab fa-android"></i>';
                ul.innerHTML += `
                    <li>
                        ${imageHtml}
                        <a href="${item.link}" target="_blank">${item.nome}</a>
                    </li>
                `;
            });
        }

        const dadosCursos = {
            programacao: [
                { nome: "Coddy Tech (Grátis)", link: "https://coddy.tech/courses", imagem: "Assets/icon/Categorias 2/Cursos/1.png" },
                { nome: "Alura (Pago)", link: "https://www.alura.com.br/", imagem: "Assets/icon/Categorias 2/Cursos/2.png" },
                { nome: "Udemy Academy (Pago)", link: "https://www.udemy.com/pt/", imagem: "Assets/icon/Categorias 2/Cursos/3.png" },
                { nome: "Tryhackme (Grátis)", link: "https://tryhackme.com/", imagem: "Assets/icon/Categorias 2/Cursos/4.png" },
                { nome: "CodeCademy", link: "https://www.codecademy.com/pages/paid-plans", imagem: "Assets/icon/Categorias 2/Cursos/5.png" },
            ],
        };

        // Dados de exemplo
        const categorias = {
            linux: [
                { nome: "LINUX MIT 64bits", link: "https://drive.google.com/file/d/1UtcZrC33vQYB9Os4u7XtMhr30v3SF2bC/view?usp=drive_link", imagem: "Assets/icon/Categorias 2/Isos/sistema operacional/Linux-mint.png" },
                { nome: "UBUNTU LINUX", link: "https://www.mediafire.com/file/pmrgkv40cc2ogee/ubuntu-24.04.3-desktop-amd64.iso/file", imagem: "Assets/icon/Categorias 2/Isos/sistema operacional/ubuntu.png" },
                { nome: "KALI Linux", link: "https://www.mediafire.com/file/lsr4ifcpaehm6jx/kali-linux-2025.2-installer-netinst-amd64.iso/file", imagem: "Assets/icon/Categorias 2/Isos/sistema operacional/kali.png" },
                { nome: "DEBIAN LINUX", link: "https://www.debian.org/distrib/", imagem: "https://files.tecnoblog.net/wp-content/uploads/2025/05/logo-debian.png" },
                { nome: "ARCH LINUX", link: "https://archlinux.org/download/", imagem: "https://linuxiac.b-cdn.net/wp-content/uploads/2020/06/archlinux.jpg" },
                { nome: "OPENSUSE LINUX", link: "https://get.opensuse.org/", imagem: "https://tse1.mm.bing.net/th/id/OIP.jmVxCeLRtPRxj5AKHVzLuQHaEr?rs=1&pid=ImgDetMain&o=7&rm=3" },
                { nome: "REDHAT LINUX", link: "https://access.redhat.com/downloads", imagem: "https://toppng.com/uploads/preview/linux-red-hat-vector-logo-11574084106ao6h0hbgc3.png" },
                { nome: "PUPPY LINUX", link: "https://puppylinux-woof-ce.github.io/", imagem: "https://tse3.mm.bing.net/th/id/OIP.70LUqCjWH3QFeSXI_sVQvwAAAA?w=320&h=268&rs=1&pid=ImgDetMain&o=7&rm=3" },
                { nome: "FEDORA LINUX", link: "https://fedoraproject.org//", imagem: "https://tse2.mm.bing.net/th/id/OIP.gKchmOgfeaN2ai9nCi_yMAHaE8?w=718&h=479&rs=1&pid=ImgDetMain&o=7&rm=3" },
            ],
            windows: [
                { nome: "Windows 11 24h2 - sem defender lite", link: "http://www.mediafire.com/file/j1ku2zncj5gaqwy/Windows_11.24h2_sem_defender_lite.ISO", imagem: "https://tse1.mm.bing.net/th/id/OIP.S5kbP295TE17RiNtLlEhTAHaEO?rs=1&pid=ImgDetMain&o=7&rm=3" },
                { nome: "Windows 11 25h2 Oficial", link: "https://www.microsoft.com/pt-br/software-download/windows11?msockid=368847f339cc61dc37bb516c38586065", imagem: "https://www.bleepstatic.com/content/hl-images/2023/02/13/Windows_11.jpg" },
                { nome: "Windows 10", link: "https://drive.google.com/file/d/1VJ3fZkvhAJf3pfaAc0RZ3a5ehes2suDC/view?usp=drive_link", imagem: "Assets/icon/Categorias 2/Isos/sistema operacional/w10.png" },
                { nome: "Windows 7 Ultimate 64bits", link: "https://www.mediafire.com/file/9iz03bjmwi9q5tw/Super_ISO_Windows_7_-_New_Boss_-.rar", imagem: "Assets/icon/Categorias 2/Isos/sistema operacional/W7.png" },
                { nome: "Windows 7 Ultimate 32bits", link: "https://www.mediafire.com/file/pnnn85k4zs31xnd/pt_windows_7_ultimate_with_sp1_x86_dvd_u_677457.iso/file", imagem: "Assets/icon/Categorias 2/Isos/sistema operacional/W7.png" },
            ],
            jogos: [
                { nome: "Emulador Ps2", link: "https://pcsx2.net/downloads/", imagem: "https://cdn2.steamgriddb.com/file/sgdb-cdn/icon/9a32ff36c65e8ba30915a21b7bd76506/32/256x256.png" },
                { nome: "Bios do emulador Emulador Ps2", link: "https://drive.google.com/file/d/160TJtC5_WYDPATipiEocN1J4eZfo887F/view?usp=sharing", imagem: "https://images.sftcdn.net/images/t_app-icon-m/p/49090629-c6b1-4ad1-b31d-42c85deb0edb/4235869713/ps2-bios-ps2-bios-icon.jpg" },
                { nome: "BURNOUT 3", link: "https://www.mediafire.com/file/zh6cp5bfgo1bfga/BURNOUT_3.iso/file", imagem: "Assets/icon/Categorias 2/Isos/ps2/3.png" },
                { nome: "GOD OF WAR 1 DUBLADO", link: "https://drive.google.com/file/d/1S1zyogsGB1n-Uo9s-qyqSV2JX1jQ2oeO/view?usp=sharing", imagem: "https://tse4.mm.bing.net/th/id/OIP.7NwkXDMZBEKA7mLPRJZCzAHaKZ?rs=1&pid=ImgDetMain&o=7&rm=3" },
                { nome: "GOD OF WAR 2 DUBLADO", link: "https://drive.google.com/file/d/1MX7NSrC8AoruocCD7PqQZYMiEBCPwqcR/view?usp=sharing", imagem: "https://tse4.mm.bing.net/th/id/OIP.7xBAaJyPLj43u1efAxB2mQAAAA?rs=1&pid=ImgDetMain&o=7&rm=3" },
                { nome: "GTA SAN ANDREAS", link: "https://coolrom.com.au/roms/ps2/41807/Grand_Theft_Auto_-_San_Andreas.php", imagem: "https://i5.walmartimages.com/asr/c9a5eb28-f5f4-4ffa-ae00-4025ef7d63d9_1.613c9e4abd4f7846ae6e4cb937f84d17.jpeg?odnWidth=1000&odnHeight=1000&odnBg=ffffff" },
                { nome: "DragonBall Z - Budokai Tenkaichi 3", link: "https://coolrom.com.au/roms/ps2/41799/DragonBall_Z_-_Budokai_Tenkaichi_3.php", imagem: "https://tse4.mm.bing.net/th/id/OIP.yvMgaAt4EdStLwduLHMEEAHaKj?rs=1&pid=ImgDetMain&o=7&rm=3" },
                { nome: "DragonBall Z - Budokai Tenkaichi 3 DUBLADO", link: "https://x-link.notion.site/Dragon-Ball-Z-Budokai-Tenkachi-3-Dublado-23887afde8008190bed1c79e885e5b51?source=copy_link", imagem: "https://tse4.mm.bing.net/th/id/OIP.yvMgaAt4EdStLwduLHMEEAHaKj?rs=1&pid=ImgDetMain&o=7&rm=3" },
                { nome: "Downhill Domination", link: "https://coolrom.com.au/roms/ps2/41557/Downhill_Domination.php", imagem: "https://assets-prd.ignimgs.com/2022/05/17/downhill-domination-button-1652747391683.jpg" },
                { nome: "Crash Bandicoot", link: "https://coolrom.com.au/roms/psx/39123/Crash_Bandicoot.php", imagem: "https://image.api.playstation.com/vulcan/img/rnd/202010/2621/z8upfOkL4hLU1wWc2tDiAusM.png" },
                { nome: "BOMBA PATCH 2026", link: "https://www.mediafire.com/file/263rv5ipjffvuqf/BOMBA+PATCH+CAMERA+NORMAL.iso/file", imagem: "https://superbombapatch.com/cdn/shop/files/PSP-PSVita-Super_Bomba_Patch_2026_V02.fw.png?v=1754715649&width=360" },
                { nome: "BOMBA PATCH 2025", link: "https://www.mediafire.com/file/qswr2s5pqh4rd30/BOMBA_PATCH_ATUALIZADO_MYMAX_2025.rar/file", imagem: "https://superbombapatch.com/cdn/shop/files/PS2-Super_Bomba_Patch_2025_v17.fw.png?v=1737939407&width=493" },
                { nome: "RESIDENT EVIL 5 LEGENDADO PS2", link: "https://4br.me/RE4PTBRRIP", imagem: "https://m.media-amazon.com/images/M/MV5BOGVkNjEyN2EtMjRiYi00ZWY1LThkOWItZTNkNjA0MTE4YmRhXkEyXkFqcGdeQXVyNjUxNDQwMzA@._V1_FMjpg_UX1000_.jpg" },
                { nome: "DragonBall Z - Budokai Tenkaichi 4 SUPER", link: "https://www.mediafire.com/file/fdphliesn4mpo9z/DESCARGA_ACTUALIZACION_V2.4_ISO_DBZ_BT3_UNITED_UNIVERSE_V2.4_REMAKE_BY_XJOS%25C3%2589BT3.rar/file", imagem: "https://senkai.com.br/wp-content/uploads/2025/02/ssj4-1-scaled.webp" },
                { nome: "NEED FOR SPEED UNDERGROUND 2 DUBLADO EM PT-BR", link: "https://drive.google.com/file/d/17rCy5oqo9wNnUZ6r4_qK9MSQY-VKTGO0/view", imagem: "https://www.lukiegames.com/assets/images/PS2/ps2_need_for_speed_underground_2_p_dmd4m2.jpg" },


            ]
        };

        const livros = {
            programacao: [
                {
                    nome: "A Web Mobile - Programe para um Mundo de Muitos Dispositivos",
                    link: "https://drive.google.com/file/d/14anVXCj1UwbrQHsRp6WOvCFgCrZz2RJt/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/Web Mobile.png"
                },
                {
                    nome: "Aplicações web real time com Node-js",
                    link: "https://drive.google.com/file/d/1ZYq9Mxlu3Df1p3b0bPyha8yhcRbyxmep/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/NODE JS.png"
                },
                {
                    nome: "Código Limpo",
                    link: "https://drive.google.com/file/d/1bFVwLgmt4o8zU1qyr91w9hs9hAfiEoHn/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/CÓDIGO LIMPO.png"
                },
                {
                    nome: "CSS Eficiente - Técnicas e ferramentas que fazem a diferença nos seus estilos",
                    link: "https://drive.google.com/file/d/1o5HvmLrdwCHkdeXt5IVpiUoM1_TCTkAz/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/CSS EFICIENTE.png"
                },
                {
                    nome: "Entendendo Algoritmos - Um Guia Ilustrado Para Programadores e Outros Curiosos",
                    link: "https://drive.google.com/file/d/1tXHyB-edy4X1dwYgTwcjCwad4fTuBT60/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/ENTENDENDO ALGORITMOS.png"
                },
                {
                    nome: "Lógica de Programação - Crie seus primeiros programas usando Javascript e HTML",
                    link: "https://drive.google.com/file/d/1Rg32cVxffqLadyiq_bHXKveMX5-1wGPK/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/Logica de.png"
                },
                {
                    nome: "O Programador Pragmático",
                    link: "https://drive.google.com/file/d/1KNG_zoZVW9ulBbK3bTbOPec-iG886edY/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/Programador pragmático.png"
                },
                {
                    nome: "Web Design Responsivo - Páginas adaptáveis para todos os dispositivos",
                    link: "https://drive.google.com/file/d/1vywBJjHH7fSsvkxYxhUJ069KIhZbKFoC/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/programação/web responsivo.png"
                },
            ],
            romance: [
                {
                    nome: "A Hipótese do Amor",
                    link: "https://drive.google.com/file/d/1XaY_6EHoZCjX_djrSqjDlVHnfE9MGA7E/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/romance/hipótese do amor.png"
                },
                {
                    nome: "O Pequeno Príncipe - Antoine de Saint-Exupéry",
                    link: "https://drive.google.com/file/d/19VoKxlR_pN-q3YcwDFpdOzJSJ_jV93KG/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/romance/pequeno principe.png"
                },
            ],
            ciencia: [
                {
                    nome: "Cosmos - Carl Sagan",
                    link: "https://drive.google.com/file/d/1xOo3ZAnE1_Ooyxvudfg2KXbwlGinVU1G/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/ciencia/cosmos.png"
                },
                {
                    nome: "Um Pálido Ponto Azul - Carl Sagan",
                    link: "https://drive.google.com/file/d/1j1wkh4X4Rjtb7S7Bv79CitrknUmkL7w4/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/ciencia/palido ponto azul.png"
                },
            ],
            filosofia: [
                {
                    nome: "Bíblia",
                    link: "https://drive.google.com/file/d/129xvAMbGIW-nbhhjdScK1gJl35aVnYQI/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/filosofia/Biblia.png"
                },
                {
                    nome: "O Homem Mais Rico da Babilônia",
                    link: "https://drive.google.com/file/d/1J30L7CCyZZgcSbEqwwfNAri3BDg79aHK/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/filosofia/O Homem mais rico .png"
                },
                {
                    nome: "Cabalion",
                    link: "https://drive.google.com/file/d/1hqp6BnONITe7OMLWaHC_B9NX5l5CKaK9/view?usp=sharing",
                    imagem: "Assets/icon/Categorias 2/Livros/filosofia/cabalion.png"
                },

            ],
            aventura: [
                {
                    "nome": "01 - Harry Potter e a Pedra Filosofal",
                    "link": "https://drive.google.com/file/d/1QrVLSxJlR2l75UJgn7GnM46WIwBP1cA2/view?usp=sharing",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/1.png"
                },
                {
                    "nome": "02 - Harry Potter e a Câmara Secreta",
                    "link": "https://drive.google.com/file/d/15Rw9jR5zMu_EiY2fbd5pW2oWDPBazhPg/view?usp=sharing",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/2.png"
                },
                {
                    "nome": "03 - Harry Potter e o Prisioneiro de Azkaban",
                    "link": "https://drive.google.com/file/d/1zPIs0povJ429Zzg8Ltb2WlTpGAloJGYh/view?usp=sharing",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/3.png"
                },
                {
                    "nome": "04 - Harry Potter e o Cálice de Fogo",
                    "link": "https://drive.google.com/file/d/1-wWgN8X2PNSXAiYmbo5Y47-D6TCPWXlA/view?usp=sharing",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/4.png"
                },
                {
                    "nome": "05 - Harry Potter e a Ordem da Fênix",
                    "link": "https://drive.google.com/file/d/1WfiKcMb-FoGW3-B_OBMuO_GSC4CVpmgf/view?usp=drive_link",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/5.png"
                },
                {
                    "nome": "06 - Harry Potter e o Enigma do Príncipe",
                    "link": "https://drive.google.com/file/d/1Mwn8sP_ABfZPG5vxr-8LBNoJzfuCSVLC/view?usp=sharing",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/6.png"
                },
                {
                    "nome": "07 - Harry Potter e as Relíquias da Morte",
                    "link": "https://drive.google.com/file/d/1HYL8tleTF4tkqj3d-rh7UfJx7Ta1IxPI/view?usp=sharing",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/7.png"
                },
                {
                    "nome": "08 - Harry Potter e a Criança Amaldiçoada",
                    "link": "https://drive.google.com/file/d/1pvBxDhi7s4CiGMaauEqeGB1Pa4o6GxS3/view?usp=sharing",
                    "imagem": "Assets/icon/Categorias 2/Livros/av/8.png"
                }
            ]
        };

        const jogos = {
            "jogos": [
                {
            "nome": "Far Cry 1",
            "linkJogo": "xt=urn:btih:fc23af879dd338888071d31d664ce9a8f472bf00&dn=Cyberpunk%202077%20-%20Ultimate%20Edition%20%5BSteam-Rip%5D%20by%20Ksenia&tr=http%3a%2f%2fbt.piratbit.club%2f0012c87e9bda94fbe36d7baa708bb010%2fannounce",
            "linkJogo2": "https://reidoplacar.com/post/ab1843",
            "linkJogo3": "https://shortmine.com/e602d3",
            "imagem": "https://cdn1.epicgames.com/71f938f91f0a4ccfaba0be708a930e8a/offer/GameName_Store_Landscape_2560x1440-2560x1440-83f5fc72a43aa3aaec79d56b094b8505.jpg",
            "videosDemo": [
                "https://www.youtube.com/watch?v=NeyY5P35ARs."
            ],
            "requisitos": {
                "intel": "Mínimo: Pentium III 1 GHz; Recomendado: Pentium 4 2-3 GHz.",
                "amd": "Mínimo: Athlon 1 GHz; Recomendado: Athlon 2-3 GHz."
            }
        },
        {
            "nome": "Far Cry 2",
            "linkJogo": "https://encurtalink.online/8lyhr",
            "linkJogo2": "https://reidoplacar.com/post/b2e0a9",
            "linkJogo3": "https://mineurl.com/d318fa",
            "imagem": "https://cdn1.epicgames.com/offer/a0b8d4482f3d4f939f35f87a3f367865/FC_FC2_Store_Landscape_2560x1440_2560x1440-e94a6a2fa597ea3fe74932be67d62519",
            "videosDemo": [
                "https://mineurl.com/d318fa"
            ],
            "requisitos": {
                "intel": "Mínimo (1080p, 30 FPS): Pentium D @ 2.66 GHz; Recomendado (1080p, 60 FPS): Core2 Duo E6400 @ 2.13 GHz.",
                "amd": "Mínimo (1080p, 30 FPS): Athlon 64 3500+ @ 2.2 GHz; Recomendado (1080p, 60 FPS): Phenom II X4 955 @ 3.2 GHz."
            }
        },
        {
            "nome": "Far Cry 3",
            "linkJogo": "https://encurtalink.online/w6rlJNguAD",
            "linkJogo2": "https://reidoplacar.com/post/19212e",
            "linkJogo3": "https://shortmine.com/911f06",
            "imagem": "https://image.api.playstation.com/cdn/UP0001/CUSA10357_00/YoJmqdJ3jDHz0ZQI6DrkzofAXaATiA8K.png",
            "videosDemo": [
                "https://shortmine.com/911f06"
            ],
            "requisitos": {
                "intel": "Mínimo (1080p, 30 FPS): Core 2 Duo E6700 @ 2.6 GHz; Recomendado (1080p, 60 FPS): Core i3-530 @ 2.9 GHz.",
                "amd": "Mínimo (1080p, 30 FPS): Athlon 64 X2 6000+ @ 3.0 GHz; Recomendado (1080p, 60 FPS): Phenom II X2 @ 3.1 GHz."
            }
        },
        {
            "nome": "Far Cry 4",
            "linkJogo": "https://4br.me/i0E0BJKyJ",
            "linkJogo2": "https://4br.me/i0E0BJKyJ",
            "linkJogo3": "https://4br.me/i0E0BJKyJ",
            "imagem": "https://images.sftcdn.net/images/t_optimized,f_auto/p/7ce82fac-96d1-11e6-bc1a-00163ed833e7/1016599245/far-cry-4-logo.jpg",
            "videosDemo": [
                "https://4br.me/i0E0BJKyJ"
            ],
            "requisitos": {
                "intel": "Mínimo: Core i5-750 @ 2.6 GHz; Recomendado: Core i5-2400S @ 2.5 GHz ou superior.",
                "amd": "Mínimo: Phenom II X4 955 @ 3.2 GHz; Recomendado: FX-8350 @ 4.0 GHz ou superior."
            }
        },
        {
            "nome": "Far Cry 5",
            "linkJogo": "https://encurtalink.online/PA30vW",
            "linkJogo2": "https://reidoplacar.com/post/b2eb6c",
            "linkJogo3": "https://shortmine.com/a5c8bd",
            "imagem": "https://wallpapercave.com/wp/wp3279172.jpg",
            "videosDemo": [
                "https://shortmine.com/a5c8bd"
            ],
            "requisitos": {
                "intel": "Mínimo (720p, 30 FPS): Core i5-2400 @ 3.1 GHz; Recomendado (1080p, 60 FPS): Core i7-3770 @ 3.5 GHz.",
                "amd": "Mínimo (720p, 30 FPS): FX-6300 @ 3.5 GHz; Recomendado (1080p, 60 FPS): FX-8350 @ 4.0 GHz."
            }
        },
        {
            "nome": "Far Cry 6",
            "linkJogo": "https://encurtalink.online/Q7rEXzBe8",
            "linkJogo2": "https://reidoplacar.com/post/908cd8",
            "linkJogo3": "https://shortmine.com/506730",
            "imagem": "https://cdn1.epicgames.com/b4565296c22549e4830c13bc7506642d/offer/TETRA_PREORDER_STANDARD%20EDITION_EPIC_Store_Landscape_2560x1440-2560x1440-827a9d1823ad230a0ea5a2efc7936370.jpg",
            "videosDemo": [
                "https://shortmine.com/506730"
            ],
            "requisitos": {
                "intel": "Mínimo (1080p, 30 FPS): Core i5-4460 @ 3.2 GHZ; Recomendado (1080p, 60 FPS): Core i7-7700 @ 3.6 Ghz.",
                "amd": "Mínimo (1080p, 30 FPS): Ryzen 3 1200 @ 3.1 GHZ; Recomendado (1080p, 60 FPS): Ryzen 5 3600X @ 3.8 Ghz."
            }
        },
                
                {
                    "nome": "STAR WARS Jedi: Survivor",
                    "linkJogo": "https://fir3.net/p47PIk",
                    "linkJogo2": "https://fir3.net/TEQjvijS",
                    "imagem": "https://assets-prd.ignimgs.com/2022/12/05/star-wars-jedi-survivor-button-02a-1670263740893.jpg",
                    videosDemo: [
                        "https://www.youtube.com/embed/VRaobDJjiec",
                    ],
                    // "linkcrack": "https://exemplo.com/dublagem-miles-morales",
                    //"linksExtras": [],
                    //"linksExtras": [],
                    "requisitos": {
                        "intel": "Mínimos: i7-7700, 8GB RAM, GTX 1070 (8GB) | Recomendados: i5-11600K, 16GB RAM, RTX 2070 (8GB)",
                        "amd": "Mínimos: Ryzen 5 1400, 8GB RAM, RX 580 (8GB) | Recomendados: Ryzen 5 5600X, 16GB RAM, RX 6700 XT (8GB)"
                    },


                },
                {
                    "nome": "Miles Morales",
                    "linkJogo": "https://seulink.net/tTCbgtT",
                    "linkDublagem": "https://fir3.net/xRl9USZhi",
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/1.png",
                    videosDemo: [
                        "https://www.youtube.com/embed/GqPLeQJ6lJk?si=atyg8pQc09Gk_pXI",
                    ],
                    // "linkcrack": "https://exemplo.com/dublagem-miles-morales",
                    //"linksExtras": [],
                    //"linksExtras": [],
                    "requisitos": {
                        "intel": "Mínimos: CPU i5, 8GB RAM, GTX 950 | Recomendados: CPU i7, 16GB RAM, RTX 2060",
                        "amd": "Mínimos: CPU Ryzen 3, 8GB RAM, RX 480 | Recomendados: CPU Ryzen 5, 16GB RAM, RX 5700"
                    },

                },
                {
                    "nome": "Little Nightmares I",
                    "linkJogo": "https://4br.me/VTzq9",
                    "linkJogo2": "https://4br.me/QYNKC",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/2.png",
                    "requisitos": {
                        "intel": "Mínimos: Intel Core i3, 4GB RAM, GTX 460",
                        "amd": "Mínimos: AMD Phenom II X4, 4GB RAM, R7 260"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/aOadxZBsPiA",
                    ]
                },
                {
                    "nome": "STRAY",
                    "linkJogo": "https://fir3.net/3mquoyru",
                    "linkJogo2": "https://mineurl.com/2e1b1b",
                    "linkJogo3": "https://reidoplacar.com/post/ce8188",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "https://i.ytimg.com/vi/4uP2MyUL49s/maxresdefault.jpg",
                    "requisitos": {
                        "intel": "Mínimos: Intel Core i5-2300, 8 GB RAM, GTX 650 Ti",
                        "amd": "Mínimos: AMD FX-6350, 8 GB RAM, Radeon R7 360"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/b-ugdyfd0ao",
                    ]
                },
                {
                    "nome": "Homem aranha 2 - 2023",
                    "linkJogo": "https://fir3.net/bTVinv8A",
                    "linkJogo2": "https://fir3.net/bTVinv8A",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/3.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i7-8700, 16GB RAM, SSD 100GB",
                        "amd": "Mínimos: CPU Ryzen 5 3600, 16GB RAM, SSD 100GB"

                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/07bcyesxbrg",
                    ]
                },
                {
                    "nome": "The Last of Us Part II Remastered",
                    "linkJogo": "https://fir3.net/KW683vfQ",
                    "linkJogo2": "https://fir3.net/KW683vfQ",
                    //"linkDublagem": "https://exemplo.com/dublagem-last-of-us-2",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/4.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-8400, 16GB RAM, RTX 2060, SSD",
                        "amd": "Mínimos: CPU Ryzen 5 2600, 16GB RAM, RX 5700, SSD"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/vhII1qlcZ4E",
                    ]
                },
                {
                    "nome": "Hollow Knight Silksong",
                    "linkJogo": "https://drive.google.com/file/d/1fmVJhhywGwcYazmE_GdID7DhmejendOa/view?usp=sharing",
                    "linkJogo2": "https://4br.me/UGIXv2",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/5.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Dual Core 2.0 GHz, 4GB RAM, 10GB Espaço (Compatível com Intel HD Graphics)",
                        "amd": "Mínimos: CPU Dual Core 2.0 GHz, 4GB RAM, 10GB Espaço (Compatível com AMD APUs)"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/vn0U9_SeYJQ",
                    ]
                },
                {
                    "nome": "Hollow Knight",
                    "linkJogo": "https://drive.google.com/file/d/1fmVJhhywGwcYazmE_GdID7DhmejendOa/view?usp=sharing",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "https://images.squarespace-cdn.com/content/v1/606d159a953867291018f801/1619987265163-9XILMVT3TK4HZ5X6538M/VH_01_1080pjpg.jpg",
                    "requisitos": {
                        "intel": "Mínimos: CPU Dual Core 2.0 GHz, 4GB RAM, 10GB Espaço (Compatível com Intel HD Graphics)",
                        "amd": "Mínimos: CPU Dual Core 2.0 GHz, 4GB RAM, 10GB Espaço (Compatível com AMD APUs)"
                    },

                },
                {
                    "nome": "CALL OF DUTY: MODERN WARFARE – REMASTERED",
                    "linkJogo": "https://fir3.net/QeotOH9",
                    "linkJogo2": "https://fir3.net/QeotOH9",
                    "linkcrack": "https://www.mediafire.com/file/pzk89leps27bl21/MWII+Campaign+Patch+V2.7z/file",
                    // "linkDublagem": "",
                    // "link": "",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/6.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core 2 Duo, 6GB RAM, GTX 470",
                        "amd": "Mínimos: CPU Phenom II X6, 6GB RAM, HD 7850"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/bH1lHCirCGI",
                    ]
                },
                {
                    "nome": "SPLINT FICTION",
                    "linkJogo": "https://fir3.net/EcjSZjBU",
                    //"linkDublagem": "",
                    //  "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/7.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-4460, 8GB RAM, GTX 960",
                        "amd": "Mínimos: CPU Ryzen 3 1200, 8GB RAM, RX 460"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/fcwngWPXQtg",
                    ]
                },
                {
                    "nome": "Resident Evil 4 Remake",
                    "linkJogo": "https://fir3.net/mR6GWmR9",
                    "linkJogo2": "https://fir3.net/EcjSZjBU",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/8.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-4460, 8GB RAM, GTX 960 | Recomendados: CPU i7-8700, 16GB RAM, GTX 1070",
                        "amd": "Mínimos: CPU Ryzen 3 1200, 8GB RAM, RX 460 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX 5700"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/C_IdgsdHwAo",
                    ]
                },
                {
                    "nome": "GTA V",
                    "linkJogo": "https://fir3.net/nFqV0fyyCK",
                    "linkJogo": "https://fir3.net/nFqV0fyyCK",
                    //"linkDublagem": "https://exemplo.com/dublagem-gta-v",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/9.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-3470, 8GB RAM, GTX 660 | Recomendados: CPU i5-9600K, 16GB RAM, RTX 3060",
                        "amd": "Mínimos: CPU FX-8350, 8GB RAM, HD 7870 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX 6600 XT"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/QkkoHAzjnUs",
                    ]
                },
                {
                    "nome": "WACTH DOGS I",
                    "linkJogo": "https://fir3.net/CITDby",
                    "linkJogo2": "https://fir3.net/TMSs0VYz",
                    "linkcrack": "https://4br.me/69H2z5Q",
                    // "linkDublagem": "",
                    // "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/10.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-2400, 6GB RAM, GTX 460 | Recomendados: CPU i7-3770, 8GB RAM, GTX 560 Ti",
                        "amd": "Mínimos: CPU Phenom II X4 940, 6GB RAM, HD 6850 | Recomendados: CPU FX-8350, 8GB RAM, HD 7850"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/DqoQG_XYF-8",
                    ]
                },
                {
                    "nome": "WACTH DOGS 2",
                    "linkJogo": "https://fir3.net/uaZrfyD2e",
                    "linkJogo2": "https://fir3.net/QISl8i2V",
                    //"linkcrack": "",
                    // "linkDublagem": "",
                    // "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/44.png",
                    "requisitos": {
                        "intel": "CPU Intel Core i5-3470 @ 3,2 GHz, 8 GB RAM, GPU GeForce GTX 780 ou melhor",
                        "amd": "CPU AMD FX 6120 @ 3,5 GHz, 6 GB RAM, GPU Radeon HD 7870 (2 GB)"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/hh9x4NqW0Dw",
                    ]
                },
                {
                    "nome": "FIFA 23",
                    "linkJogo": "https://fir3.net/MIcL490",
                    "linkJogo2": "https://fir3.net/QBh5E",
                    "linkJogo3": "https://fir3.net/HUpb70qQJn",
                    "linkJogo4": "https://fir3.net/Fopm0s6a",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/11.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-6600K, 8GB RAM, GTX 1050 Ti | Recomendados: CPU i7-9700K, 16GB RAM, RTX 2060",
                        "amd": "Mínimos: CPU Ryzen 5 1600, 8GB RAM, RX 570 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX 6600 XT"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/o3V-GvvzjE4",
                    ]
                },
                {
                    "nome": "FINAL FANTASY VII",
                    "linkJogo": "https://clica.so/2SsFt",
                    "linkJogo2": "https://clica.so/2SsFt",
                    "linkJogo3": "https://clica.so/p3GB",
                    // "linkDublagem": "https://exemplo.com/dublagem-ffvii",
                    // "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/12.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core 2 Duo 2.4GHz, 2GB RAM, GeForce 8800 GT | Recomendados: CPU Core 2 Quad Q6600, 2GB RAM, Radeon HD 4650",
                        "amd": "Mínimos: CPU Athlon II X4 600e, 2GB RAM, GeForce 8800 GT | Recomendados: CPU Athlon II X4 600e, 2GB RAM, Radeon HD 4650"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/sz9QWTcbXYE",
                    ]
                },
                {
                    "nome": "FIFA 2013",
                    "linkJogo": "https://fir3.net/DIU0D49ONZ",
                    "linkJogo2": "https://mineurl.com/79a179",
                    "linkJogo3": "https://fir3.net/DIU0D49ONZ",
                    "linkcrack": "https://encurtalink.online/YB9J0yF",
                    //"linkDublagem": "",
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/13.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core 2 Duo 2.4GHz, 2GB RAM, GeForce 8800 GT | Recomendados: CPU Core 2 Quad Q6600, 2GB RAM, GTX 960",
                        "amd": "Mínimos: CPU Athlon II X4 600e, 2GB RAM, HD 2900 XT | Recomendados: CPU Athlon II X4 600e, 2GB RAM, RX 570"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/Ia43OgdBHaE",
                    ]
                },
                {
                    "nome": "CALL OF DUTY BLACK OPS 6",
                    "linkJogo": "https://4br.me/xgXsZM",
                    //"linkDublagem": "",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/14.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-6600, 8GB RAM, GTX 960 | Recomendados: CPU i7-6700K, 16GB RAM, GTX 1080 Ti",
                        "amd": "Mínimos: CPU Ryzen 5 1400, 8GB RAM, RX 470 | Recomendados: CPU Ryzen 5 1600X, 16GB RAM, RX 6600 XT"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/h0uxvKUjsj4",
                    ]
                },
                {
                    "nome": "DRAGON BALL Sparking ZERO",
                    "linkJogo": "https://4br.me/dOqXskcv",
                    //"linkDublagem": "https://exemplo.com/dublagem-dbz-sparking",
                    //"linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/15.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i7-9700K, 16GB RAM, RTX 2060 | Recomendados: CPU i7-9700K, 16GB RAM, RTX 2060",
                        "amd": "Mínimos: CPU Ryzen 5 3600, 16GB RAM, RX Vega 64 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX Vega 64"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/SqOH3zqtfCM",
                    ]
                },
                {
                    "nome": "DRAGON BALL Z: KAKAROT – ULTIMATE EDITION",
                    //"linkJogo": "https://encurtalink.online/Nz6EL",
                    //"linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/16.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-2400, 4GB RAM, GTX 750 Ti | Recomendados: CPU i5-3470, 8GB RAM, GTX 960",
                        "amd": "Mínimos: CPU Phenom II X6 1100T, 4GB RAM, HD 7950 | Recomendados: CPU Ryzen 3 1200, 8GB RAM, RX 570"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/rk-wIgg9fNk",
                    ]
                },
                {
                    "nome": "NARUTO SHIPPUDEN Ultimate Ninja Storm 4",
                    "linkJogo": "https://fir3.net/UE94EgbX",
                    "linkDublagem": "https://exemplo.com/dublagem-naruto-storm4",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/17.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-2400, 4GB RAM, GTX 750 Ti | Recomendados: CPU i5-3470, 8GB RAM, GTX 960",
                        "amd": "Mínimos: CPU Phenom II X6 1100T, 4GB RAM, HD 7950 | Recomendados: CPU Ryzen 3 1200, 8GB RAM, RX 570"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/9Vm4m15r2Xc",
                    ]
                },
                {
                    "nome": "The Last of Us 1 Dublado e legendado",
                    "linkJogo": "https://fir3.net/NS7ZWE5ONj",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/18.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core 2 Duo 2.4GHz, 2GB RAM, GeForce 8800 GT | Recomendados: CPU Core 2 Quad Q6600, 2GB RAM, GTX 960",
                        "amd": "Mínimos: CPU Athlon II X4 600e, 2GB RAM, HD 2900 XT | Recomendados: CPU Athlon II X4 600e, 2GB RAM, RX 570"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/kE7li_u1nmg",
                    ]
                },
                {
                    "nome": "MORTAL KOMBAT 11",
                    "linkJogo": "https://encurtalink.online/SOqV",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/19.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-2300, 8GB RAM, GTX 660 | Recomendados: CPU i7-6700K, 16GB RAM, GTX 1080 / RTX 2060",
                        "amd": "Mínimos: CPU FX-6300, 8GB RAM, HD 7850 | Recomendados: CPU Ryzen 5 1600X, 16GB RAM, RX 5700"
                    },
                    videosDemo: [
                        "https://www.youtube.com/embed/UoTams2yc0s",
                    ]
                },
                {
                    "nome": "Euro Truck Simulator 2 v1.54.1.0s-P2P",
                    "linkJogo": "https://fir3.net/LSn1yG",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/20.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core i5-760, 4GB RAM, GTX 260 | Recomendados: CPU i5-2500, 8GB RAM, GTX 660",
                        "amd": "Mínimos: CPU Phenom II X4 965, 4GB RAM, HD 5770 | Recomendados: CPU Ryzen 3 1200, 8GB RAM, RX 460"
                    },
                    videosDemo: [
                        "https://www.youtube.com/",
                    ]
                },

                {
                    "nome": "Forza Horizon 5: Premium Edition",
                    "linkJogo": "https://4br.me/EHqBo3",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/21.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-4460, 8GB RAM, GTX 970 | Recomendados: CPU i7-10700K, 16GB RAM, RTX 2080",
                        "amd": "Mínimos: CPU Ryzen 3 1200, 8GB RAM, RX 470 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX 5700 XT"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/W-SpP-Z0Uu8"
                    ]
                },
                {
                    "nome": "Nymphomaniac: Sex Addict – v11750 + Windows 7 Fix",
                    "linkJogo": "https://fir3.net/aFWbaIyc",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/22.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-2400, 4GB RAM, GTX 750 | Recomendados: CPU i5-3470, 8GB RAM, GTX 960",
                        "amd": "Mínimos: CPU Phenom II X4 940, 4GB RAM, HD 6850 | Recomendados: CPU Ryzen 3 1200, 8GB RAM, RX 460"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/Gdxzno5Xp2Y"
                    ]
                },
                {
                    "nome": "SILENT HILL 2 REMATERED GOG",
                    "linkJogo": "https://fir3.net/uWOv",
                    "linkDublagem": "https://exemplo.com/dublagem-silent-hill-2",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/23.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-2500, 4GB RAM, GTX 460 | Recomendados: CPU i7-3770, 8GB RAM, GTX 660",
                        "amd": "Mínimos: CPU FX-6300, 4GB RAM, HD 7850 | Recomendados: CPU Ryzen 3 1200, 8GB RAM, RX 570"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/1J653_o26tE"
                    ]
                },
                {
                    "nome": "RESIDENT EVIL: VILLAGE – GOLD EDITION",
                    "linkJogo": "https://fir3.net/6c1iQ0u",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/24.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-4460, 8GB RAM, GTX 960 | Recomendados: CPU i7-8700, 16GB RAM, GTX 1070",
                        "amd": "Mínimos: CPU Ryzen 3 1200, 8GB RAM, RX 460 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX 5700"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/0SgVvS3XG78"
                    ]
                },
                {
                    "nome": "FIFA 18 + UPDATE 2",
                    "linkJogo": "https://encurtalink.online/ZvpMIJd",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/25.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-6600, 8GB RAM, GTX 1050 Ti | Recomendados: CPU i7-9700, 16GB RAM, GTX 1660 Ti",
                        "amd": "Mínimos: CPU Ryzen 5 1600, 8GB RAM, RX 570 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX 5600 XT"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/l1FJfr_spJQ"
                    ]
                },
                {
                    "nome": "Detroit: Become Human",
                    "linkJogo": "https://4br.me/PvgSGhC",
                    "linkDublagem": "https://exemplo.com/dublagem-detroit",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/26.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-3470, 8GB RAM, GTX 660 | Recomendados: CPU i7-6700K, 16GB RAM, GTX 1060",
                        "amd": "Mínimos: CPU FX-8350, 8GB RAM, HD 7870 | Recomendados: CPU Ryzen 5 1600, 16GB RAM, RX 580"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/8a-EObAhYrg"
                    ]
                },
                {
                    "nome": "God of War Ragnarok",
                    "linkJogo": "https://fir3.net/zhpL",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/27.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-6600K, 8GB RAM, GTX 1060 | Recomendados: CPU i7-9700K, 16GB RAM, RTX 2070",
                        "amd": "Mínimos: CPU Ryzen 5 1600, 8GB RAM, RX 580 | Recomendados: CPU Ryzen 5 3600, 16GB RAM, RX 5700 XT"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/g1wr0DfV73E"
                    ]
                },
                {
                    "nome": "Batman Arkham Knight Complete Edition",
                    "linkJogo": "https://encurtalink.online/q4NpASda0",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/28.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-750, 6GB RAM, GTX 460 | Recomendados: CPU i7-3770, 8GB RAM, GTX 1060",
                        "amd": "Mínimos: CPU Phenom II X4 940, 6GB RAM, HD 6850 | Recomendados: CPU Ryzen 3 1200, 8GB RAM, RX 580"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/JeGAQXY2FzI"
                    ]
                },
                {
                    "nome": "Pes 2021",
                    "linkJogo": "https://encurtalink.online/U9B5t1i6",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/29.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-750, 6GB RAM, GTX 460 | Recomendados: CPU i7-3770, 8GB RAM, GTX 1060",
                        "amd": "Mínimos: CPU Phenom II X4 940, 6GB RAM, HD 6850 | Recomendados: CPU Ryzen 3 1200, 8GB RAM, RX 580"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/GSXViWOyEO4"
                    ]
                },
                {
                    "nome": "GTA: San Andreas – The Definitive Edition",
                    "linkJogo": "https://fir3.net/TsUweUftMx",
                    "linkDublagem": "https://exemplo.com/dublagem-gta-sa",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/30.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core i5-6600K, 8GB RAM, GTX 760 2GB | Recomendados: CPU Core i7-2700K, 16GB RAM, GTX 970 4GB",
                        "amd": "Mínimos: CPU FX-6300, 8GB RAM, Radeon R9 280 3GB | Recomendados: CPU Ryzen 5 2600, 16GB RAM, Radeon RX 570 4GB"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/D71cBUeAL58"
                    ]
                },
                {
                    "nome": "GTA: Vice City – The Definitive Edition",
                    "linkJogo": "https://fir3.net/TQQOQbe",
                    "linkDublagem": "https://exemplo.com/dublagem-gta-vc",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/31.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core i5-6600K, 8GB RAM, GTX 760 2GB | Recomendados: CPU Core i7-2700K, 16GB RAM, GTX 970 4GB",
                        "amd": "Mínimos: CPU FX-6300, 8GB RAM, Radeon R9 280 3GB | Recomendados: CPU Ryzen 5 2600, 16GB RAM, Radeon RX 570 4GB"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/N6g0YoJC3V4"
                    ]
                },
                {
                    "nome": "Red Dead Redemption",
                    "linkJogo": "https://4br.me/1CnIH1",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/32.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-4670, 8 GB RAM, GTX 960 | Recomendados: CPU i5-8500, 8 GB RAM, RTX 2070",
                        "amd": "Mínimos: CPU FX-9590, 8 GB RAM, R7 360 | Recomendados: CPU Ryzen 5 3500X, 8 GB RAM, RX 5700 XT"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/-o7rES_3ymA"
                    ]
                },
                {
                    "nome": "Red Dead Redemption 2",
                    "linkJogo": "https://fir3.net/VWGN",
                    "linkDublagem": "https://exemplo.com/dublagem-rdr2",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/33.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-2500K, 8 GB RAM, GTX 770 2GB | Recomendados: CPU i7-4770K, 12 GB RAM, GTX 1060 6GB",
                        "amd": "Mínimos: CPU FX-6300, 8 GB RAM, Radeon R9 280 3GB | Recomendados: CPU Ryzen 5 1500X, 12 GB RAM, Radeon RX 480 4GB"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/gmA6MrX81z4"
                    ]
                },
                {
                    "nome": "Ghost of Tsushima Director's Cut",
                    "linkJogo": "https://fir3.net/gAfGpBLn",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/34.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i3 7100, 8 GB RAM, GTX 960 4GB | Recomendados: CPU i5 8600, 16 GB RAM, RTX 2060",
                        "amd": "Mínimos: CPU Ryzen 3 1200, 8 GB RAM, Radeon RX 5500 XT | Recomendados: CPU Ryzen 5 3600, 16 GB RAM, Radeon RX 5600 XT"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/xLwE5eD7Bf4"
                    ]
                },
                {
                    "nome": "Assassin's Creed Mirage",
                    "linkJogo": "https://fir3.net/JUnnLmey",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/35.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i7-4790K, 8 GB RAM, GTX 1060 6GB | Recomendados: CPU i7-8700K, 16 GB RAM, GTX 1660 Ti  6GB",
                        "amd": "Mínimos: CPU Ryzen 5 1600, 8 GB RAM, RX 570 4GB | Recomendados: CPU Ryzen 5 3600, 16 GB RAM, RX 5600 XT 6GB"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/x55lAlFtXmw"
                    ]
                },
                {
                    "nome": "Sons Of The Forest",
                    "linkJogo": "https://fir3.net/lsngy8TaOa",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/36.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5-8400, 12 GB RAM, GTX 1060 3GB | Recomendados: CPU i5-8700K, 16 GB RAM, GTX 1080 Ti",
                        "amd": "Mínimos: CPU Ryzen 3300X, 12 GB RAM, RX 570 4GB | Recomendados: CPU Ryzen 3600X, 16 GB RAM, RX 5700 XT"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/8sghWJKPWno"
                    ]
                },
                {
                    "nome": "It Takes Two",
                    "linkJogo": "https://fir3.net/nDsUX",
                    "linkDublagem": "https://exemplo.com/dublagem-it-takes-two",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/37.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i3-2100T, 8 GB RAM, GTX 660 | Recomendados: CPU i5 3570K, 16 GB RAM, GTX 960",
                        "amd": "Mínimos: CPU FX 6100, 8 GB RAM, R7 260X | Recomendados: CPU Ryzen 3 1300X, 16 GB RAM, R9 290"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/ohClxMmNLQQ"
                    ]
                },
                {
                    "nome": "Grounded",
                    "linkJogo": "https://4br.me/hRZjlJlO",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/38.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i3-3225, 4 GB RAM, GTX 650 Ti | Recomendados: CPU i7-4790K, 8 GB RAM, GTX 970",
                        "amd": "Mínimos: CPU equivalente, 4 GB RAM, equivalente | Recomendados: CPU Ryzen 5 1500X, 8 GB RAM, Radeon R9 290"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/ciVgq5xO5G0"
                    ]
                },
                {
                    "nome": "GTA 4",
                    "linkJogo": "https://fir3.net/X4gLL",
                    "linkDublagem": "https://exemplo.com/dublagem-gta-4",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/39.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core 2 Duo 1.8GHz, 1.5 GB RAM, GTX 7900+ | Recomendados: CPU Core 2 Quad 2.4GHz, 2.5 GB RAM, 8600+",
                        "amd": "Mínimos: CPU Athlon X2 64 2.4GHz, 1.5 GB RAM, ATI X1900+ | Recomendados: CPU Phenom X3 2.1GHz, 2.5 GB RAM, ATI 3870+"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/kOZ8bRAO7YQ"
                    ]
                },
                {
                    "nome": "Bully",
                    "linkJogo": "https://fir3.net/TbXwn",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/40.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Pentium 4, 1 GB RAM, NVIDIA 6800 or 7300 | Recomendados: Não especificados",
                        "amd": "Mínimos: CPU Athlon 3000+, 1 GB RAM, Radeon X1300 | Recomendados: Não especificados"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/88KNf0MtU14"
                    ]
                },
                {
                    "nome": "Battlefield V Deluxe Edition",
                    "linkJogo": "https://fir3.net/BMoZI2FOAC",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/41.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU i5 6600K, 8 GB RAM, GTX 1050 / GTX 660 | Recomendados: CPU i7 4790, 12 GB RAM, GTX 1060 6GB",
                        "amd": "Mínimos: CPU FX-8350, 8 GB RAM, RX 560 / HD 7850 | Recomendados: CPU Ryzen 3 1300X, 12 GB RAM, RX 580 8GB"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/DJ1LfQGl0IU"
                    ]
                },
                {
                    "nome": "Battlefield 3",
                    "linkJogo": "https://www.youtube.com/redirect?event=video_description&redir_token=QUFFLUhqazIxYWhKbUlqMTFOSXhFVFAwaEtJdU04ZWRWUXxBQ3Jtc0tuQUtfNzYySl9sVUs4NTdVNnRqUWg5SXlEU3Z1YzhaMVNsaWUxMmpORE50UElTN1F4TS0zcTlKY0wtMGZzWXZZTm1lYjNCa3V4WmhxalhNeGNhUlFUSHBhb1Z1NHRSODJ4blc3V2hGRHJ4WEFNYVc5Yw&q=https%3A%2F%2Fzloemu.net%2Ffiles%2FBattlefield3.torrent&v=bt2mNNayJ70",
                    "linkDublagem": "",
                    "linksExtras": [],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/42.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Core 2 Duo 2.4GHz, 2 GB RAM, GTX 8800 GT | Recomendados: CPU Quad-core, 4 GB RAM, GTX 560",
                        "amd": "Mínimos: CPU Athlon X2 64 2.4GHz, 2 GB RAM, HD 3870 | Recomendados: CPU Phenom II X4, 4 GB RAM, HD 6950"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/mwV5X82iHVM"
                    ]
                },
                {
                    "nome": "GOD OF WAR 3 + EMULADOR",
                    "linkJogo": "https://1fichier.com/?2uzuw6e34swjuzjuupgc",
                    "linkbios": "https://devuploads.com/4d2s2uis1ftw",
                    "linksExtras": [
                        { "nome": "EMULADOR PS3", "url": "https://rpcs3.net/" }
                    ],
                    "imagem": "Assets/icon/Categorias 2/Torrent/Jp/43.png",
                    "requisitos": {
                        "intel": "Mínimos: CPU Intel Core i5-2500K (4 núcleos), 8 GB RAM, GPU GTX 660 (2 GB VRAM) | Recomendados: CPU Intel Core i7-8700K ou superior, 16 GB RAM, GPU GTX 1060 (6 GB VRAM) ou superior, SSD recomendado",
                        "amd": "Mínimos: CPU AMD Ryzen 5 1600 ou FX-8350, 8 GB RAM, GPU Radeon R9 280X (3 GB VRAM) | Recomendados: CPU AMD Ryzen 7 3700X ou superior, 16 GB RAM, GPU RX 580 (8 GB VRAM) ou superior, SSD recomendado"
                    },
                    "videosDemo": [
                        "https://www.youtube.com/embed/qKogMfIAAkY"
                    ]
                }
            ]
        };

        const Sites = {
            IA: [
                {
                    nome: "Deepseek",
                    link: "https://chat.deepseek.com/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/deepseek.png"
                },
                {
                    nome: "PH IND AI",
                    link: "https://www.phind.com/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/Phind.png"
                },
                {
                    nome: "CURSOR",
                    link: "https://cursor.com/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/cursor.png"
                },
                {
                    nome: "V0 DEV",
                    link: "https://v0.app/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/v0.png"
                },
                {
                    nome: "Windsurf",
                    link: "https://windsurf.com/?ref=huntscreens.com",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/w.png"
                },
                {
                    nome: "Tabnine AI",
                    link: "https://www.tabnine.com/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/tabnine-logo.png"
                },
                {
                    nome: "Blackbox AI",
                    link: "https://www.blackbox.ai/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/BLACKBOX.png"
                },
                {
                    nome: "DeeVid AI",
                    link: "https://deevid.ai/pt",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/1.png"
                },
                {
                    nome: "higgsfield ai",
                    link: "https://higgsfield.ai/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/2.png"
                },
                {
                    nome: "Kling AI",
                    link: "https://app.klingai.com/global/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/3.png"
                },
                {
                    nome: "Wan Video AI",
                    link: "https://wan.video/",
                    imagem: "Assets/icon/Categorias 2/Sites/Ia/4.png"
                },
            ],

            Filmes_e_Series: [
                {
                    nome: "Superflix",
                    link: "https://superflix.network/",
                    imagem: "Assets/icon/Categorias 2/Sites/Filmes/Superflix.png"
                },
                {
                    nome: "Hiperflix",
                    link: "https://hypeflix.info/",
                    imagem: "Assets/icon/Categorias 2/Sites/Filmes/hiperflix.png"
                },
                {
                    nome: "Movie",
                    link: "https://moviestv.onl/home",
                    imagem: "Assets/icon/Categorias 2/Sites/Filmes/Movie.png"
                },
                {
                    nome: "Cinegratis",
                    link: "https://cinegratis.tv/",
                    imagem: "Assets/icon/Categorias 2/Sites/Filmes/CineGratis.png"
                }

            ],

            conversores: [
                {
                    nome: "Conversor de imagem",
                    link: "https://convertio.co/pt/",
                    imagem: "Assets/icon/Categorias 2/Sites/Conversor/1.png"
                },
                {
                    nome: "PNG Wing",
                    link: "https://www.pngwing.com/pt",
                    imagem: "Assets/icon/Categorias 2/Sites/Conversor/2.png"
                }
            ],

            Wallpapers: [
                {
                    nome: "Wallpapers Wide",
                    link: "https://wallpaperswide.com/",
                    imagem: "Assets/icon/Categorias 2/Sites/Wallpapers/1.png"
                },
                {
                    nome: "Wallpaper Cave",
                    link: "https://wallpapercave.com/",
                    imagem: "Assets/icon/Categorias 2/Sites/Wallpapers/2.png"
                },
                {
                    nome: "Alpha Coders",
                    link: "https://alphacoders.com/",
                    imagem: "Assets/icon/Categorias 2/Sites/Wallpapers/3.png"
                }
            ],
            Editores: [
                {
                    nome: "Text Behind Image",
                    link: "https://text-behind-image.com/",
                    imagem: "Assets/icon/categorias 2/Sites/Editores de Imagens/1.png"
                },

            ],
            Dark_Web: [
                {
                    nome: "Tourch",
                    link: "http://xmh57jrknzkhv6y3ls3ubitzfqnkrwxhopf5aygthi7d6rplyvk3noyd.onion/",
                    imagem: "Assets/icon/categorias 2/Sites/Dark/1.png"
                },

            ],

            Esporte_e_Tv_aberta: [
                {
                    nome: "Esporte (PLAY HD)",
                    link: "https://www.futplayhd.com.br/",
                    imagem: "Assets/icon/Categorias 2/Sites/tv aberta/PLAY HD).png"
                },
                {
                    nome: "tv aberta ",
                    link: "https://televisao.tv/sbt",
                    imagem: "Assets/icon/Categorias 2/Sites/tv aberta/tv aberta.png"
                },
            ],
            Fontes: [
                {
                    nome: "DaFont",
                    link: "https://www.dafont.com/pt/",
                    imagem: "https://tse3.mm.bing.net/th/id/OIP.QiKINvol8MdxG2-47e5n5AHaM9?rs=1&pid=ImgDetMain&o=7&rm=3"
                },

            ]

        };


        // ======================================================================
        // FUNÇÕES PRINCIPAIS DE NAVEGAÇÃO E RESET
        // ======================================================================

        function openModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.add('active');

                if (id === 'modalIsos') mostrarCategoriasIsos();
                if (id === 'modalLivros') voltarLivros();
                if (id === 'modalJogos') voltarJogos();
                if (id === 'modalSites') voltarSites();

                // garantir que cursos e android iniciem mostrando categorias
                if (id === 'modalNovidades') voltarCursos();
                if (id === 'modalJogosMobile') voltarAndroid();
                if (id === 'modalSalaDeMAquinas') voltarSalaDeMAquinas();
            } else {
                console.error('Modal não encontrado:', id);
            }
        }

        function closeModal(id) {
            const modal = document.getElementById(id);
            if (modal) {
                modal.classList.remove('active');
                console.log('Modal fechado:', id);
            }
        }

        // ======================================================================
        // FECHAR MODAL AO CLICAR FORA E COM ESC
        // ======================================================================

        const modals = ["modalIsos", "modalLivros", "modalJogos", "modalSites", "modalJogosMobile", "modalNovidades", "modalSalaDeMAquinas"];

        // Fechar ao clicar fora
        modals.forEach(id => {
            const modalElement = document.getElementById(id);
            if (modalElement) {
                modalElement.addEventListener('click', (event) => {
                    if (event.target === modalElement) {
                        closeModal(id);
                    }
                });
            }
        });

        // Fechar com ESC
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape') {
                modals.forEach(id => {
                    const modalElement = document.getElementById(id);
                    if (modalElement && modalElement.classList.contains('active')) {
                        closeModal(id);
                    }
                });
            }
        });

        // ======================================================================
        // MODAL DE ISOs
        // ======================================================================
        function mostrarCategoriasIsos() {
            document.getElementById("voltarIsos").style.display = "none";
            document.getElementById("search-container-isos").style.display = "none";
            document.getElementById("searchInputIsos").value = "";
            const lista = document.getElementById("listaIsos");
            lista.dataset.categoria = "";
            document.querySelector("#modalIsos .modal-card h2").textContent = "Escolha uma categoria de ISOs";
            lista.innerHTML = `
        <li onclick="abrirCategoria('linux')"><img src="Assets/icon/Categorias 2/Isos/perfil/Linux.png" alt="Linux" class="list-icon"> Linux</li>
        <li onclick="abrirCategoria('windows')"><img src="Assets/icon/Categorias 2/Isos/perfil/Windows.png" alt="Windows" class="list-icon"> Windows</li>
        <li onclick="abrirCategoria('jogos')"><img src="Assets/icon/Categorias 2/Isos/perfil/sony.png" alt="Jogos" class="list-icon"> Jogos</li>
    `;
        }

        function abrirCategoria(cat, termoPesquisa = '') {
            document.getElementById("voltarIsos").style.display = "inline-block";
            document.getElementById("search-container-isos").style.display = "flex";
            const lista = document.getElementById("listaIsos");
            lista.dataset.categoria = cat;
            const termo = (termoPesquisa || document.getElementById("searchInputIsos").value || '').toLowerCase();

            const isosFiltrados = categorias[cat] ? categorias[cat].filter(item =>
                item.nome.toLowerCase().includes(termo)
            ) : [];

            const tituloModal = document.querySelector("#modalIsos .modal-card h2");
            tituloModal.textContent = {
                linux: "ISOs de Linux",
                windows: "ISOs de Windows",
                jogos: "ISOs de Jogos"
            }[cat] || "ISOs";

            lista.innerHTML = "";

            if (isosFiltrados.length === 0) {
                lista.innerHTML = `<li style="justify-content:center;">Nenhuma ISO encontrada para "${termo}"</li>`;
                return;
            }

            isosFiltrados.forEach(item => {
                const imageHtml = item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" class="list-icon">` : '<i class="fas fa-download"></i>';
                lista.innerHTML += `
            <li>
                ${imageHtml}
                <a href="${item.link}" target="_blank" style="color: #00ff00; text-decoration: none;">${item.nome}</a>
            </li>`;
            });
        }

        // ======================================================================
        // MODAL DE LIVROS
        // ======================================================================
        function voltarLivros() {
            document.getElementById("livros-categorias").style.display = "block";
            document.getElementById("livros-arquivos").style.display = "none";
            document.getElementById("voltarLivros").style.display = "none";
            document.getElementById("search-container-livros").style.display = "none";
            document.getElementById("searchInputLivros").value = "";
            document.querySelector("#modalLivros .modal-card h2").textContent = "Escolha uma categoria de livros";
        }

        function showLivros(cat, termoPesquisa = '') {
            document.getElementById("livros-categorias").style.display = "none";
            document.getElementById("livros-arquivos").style.display = "block";
            document.getElementById("voltarLivros").style.display = "inline-block";
            document.getElementById("search-container-livros").style.display = "flex";

            const ul = document.getElementById("livros-arquivos");
            ul.dataset.categoria = cat;
            const termo = termoPesquisa.toLowerCase() || document.getElementById("searchInputLivros").value.toLowerCase();

            const livrosFiltrados = livros[cat].filter(item => item.nome.toLowerCase().includes(termo));

            const titulos = {
                programacao: "Livros de Programação",
                aventura: "Livros de Aventura",
                romance: "Livros de Romance",
                ciencia: "Livros de Ciência e Tecnologia",
                filosofia: "Livros de Filosofia"
            };
            document.querySelector("#modalLivros .modal-card h2").textContent = titulos[cat] || "Livros";

            ul.innerHTML = "";

            if (livrosFiltrados.length === 0) {
                ul.innerHTML = `<li style="justify-content:center;">Nenhum livro encontrado para "${termo}"</li>`;
                return;
            }

            livrosFiltrados.forEach(item => {
                const imageHtml = item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" class="list-icon">` : '<i class="fas fa-book"></i>';
                ul.innerHTML += `
            <li>
                ${imageHtml}
                <a href="${item.link}" target="_blank">${item.nome}</a>
            </li>
        `;
            });
        }

        // ======================================================================
        // MODAL DE JOGOS
        // ======================================================================
        function voltarJogos() {
            document.getElementById("jogos-categorias").style.display = "block";
            document.getElementById("jogos-arquivos").style.display = "none";
            document.getElementById("voltarJogos").style.display = "none";
            document.getElementById("search-container-jogos").style.display = "none";
            document.getElementById("searchInputJogos").value = "";
            document.querySelector("#modalJogos .modal-card h2").textContent = "Escolha uma categoria";
        }

        function showJogos(cat, termoPesquisa = '') {
            document.getElementById("jogos-categorias").style.display = "none";
            document.getElementById("jogos-arquivos").style.display = "block";
            document.getElementById("voltarJogos").style.display = "inline-block";
            document.getElementById("search-container-jogos").style.display = "flex";

            const lista = document.getElementById("jogos-arquivos");
            lista.dataset.categoria = cat;

            const termo = (termoPesquisa || document.getElementById("searchInputJogos").value || '').toLowerCase().trim();

            const todosJogos = (jogos[cat] || []);

            const tituloModal = document.querySelector("#modalJogos .modal-card h2");
            if (cat === 'acao') tituloModal.textContent = "Explore 41 Jogos Piratas e mergulhe na diversão!";

            // Renderiza todos os jogos, e depois destaca os que batem com o termo
            lista.innerHTML = "";
            todosJogos.forEach(item => {
                const imageHtml = item.imagem && item.imagem !== '' ? `<img src="${item.imagem}" alt="${item.nome}" class="list-icon">` : '<i class="fas fa-gamepad"></i>';
                lista.innerHTML += `
            <li class="jogo-item" data-nome="${item.nome.toLowerCase()}" onclick="abrirPaginaJogo('${cat}', '${item.nome.replace(/'/g, "\\'")}')">
                ${imageHtml}
                <span>${item.nome}</span>
            </li>
        `;
            });

            // Se houver termo, adiciona classes de destaque em vez de remover itens
            if (termo && termo.length > 0) {
                const lis = lista.querySelectorAll('.jogo-item');
                let matches = 0;
                lis.forEach(li => {
                    const nomeLi = li.dataset.nome || '';
                    if (nomeLi.includes(termo)) {
                        li.classList.add('search-match');
                        li.style.visibility = 'visible';
                        li.style.pointerEvents = '';
                        matches++;
                    } else {
                        li.classList.remove('search-match');
                        li.style.visibility = 'hidden';
                        li.style.pointerEvents = 'none';
                    }
                });

                // Exibe mensagem se não houver nenhuma correspondência
                if (matches === 0) {
                    // Não remover os itens; apenas exibe uma mensagem sem alterar a altura do container
                    let msg = lista.querySelector('.no-match-message');
                    if (!msg) {
                        msg = document.createElement('li');
                        msg.className = 'no-match-message';
                        msg.style.justifyContent = 'center';
                        msg.style.color = '#ff4444';
                        lista.appendChild(msg);
                    }
                    msg.textContent = `Nenhum jogo encontrado para "${termo}"`;
                    msg.style.display = 'flex';
                    return;
                } else {
                    // remove message if it exists
                    const msg = lista.querySelector('.no-match-message');
                    if (msg) msg.style.display = 'none';
                }
                // Se houver matches, foca no primeiro e rola para ele
                const firstMatch = lista.querySelector('.search-match');
                if (firstMatch) {
                    // Rolagem suave para o item
                    firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            } else {
                // Limpa as classes de pesquisa quando não há termo e mostra todos
                lista.querySelectorAll('.jogo-item').forEach(li => {
                    li.style.display = '';
                    li.classList.remove('search-match');
                });
            }
        }

        // ======================================================================
        // MODAL DE SITES
        // ======================================================================
        function voltarSites() {
            document.getElementById("Sites-categorias").style.display = "block";
            document.getElementById("Sites-arquivos").style.display = "none";
            document.getElementById("voltarSites").style.display = "none";
            document.getElementById("search-container-sites").style.display = "none";
            document.getElementById("searchInputSites").value = "";
            document.querySelector("#modalSites .modal-card h2").textContent = "Escolha uma categoria de Sites";
        }

        function showSites(cat, termoPesquisa = '') {
            document.getElementById("Sites-categorias").style.display = "none";
            document.getElementById("Sites-arquivos").style.display = "block";
            document.getElementById("voltarSites").style.display = "inline-block";
            document.getElementById("search-container-sites").style.display = "flex";
            //titulos para cada categoria dentro de seus cards
            const titulos = {
                IA: "Sites de Inteligência Artificial",
                Filmes_e_Series: "Sites de Filmes e Séries"
                , conversores: "Sites de Conversores",
                Wallpapers: "Sites de Wallpapers",
                Editores: "Sites de Editores de Imagens",
                Dark_Web: "Sites da Dark Web"
            };
            document.querySelector("#modalSites .modal-card h2").textContent = titulos[cat] || "Escolha uma categoria de Sites";


            const ul = document.getElementById("Sites-arquivos");
            ul.dataset.categoria = cat;
            const termo = (termoPesquisa || document.getElementById("searchInputSites").value || '').toLowerCase();

            const sitesFiltrados = (Sites[cat] || []).filter(item => item.nome.toLowerCase().includes(termo));

            ul.innerHTML = sitesFiltrados.length === 0
                ? `<li style="justify-content:center;">Nenhum site encontrado para "${termo}"</li>`
                : '';

            sitesFiltrados.forEach(item => {
                const imageHtml = item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" class="list-icon">` : '<i class="fas fa-globe"></i>';
                ul.innerHTML += `
            <li>
                ${imageHtml}
                <a href="${item.link}" target="_blank">${item.nome}</a>
            </li>
        `;
            });
        }

        // ======================================================================
        // EVENT LISTENERS PARA PESQUISA
        // ======================================================================
        document.addEventListener('DOMContentLoaded', function () {
            // Pesquisa de ISOs
            const searchInputIsos = document.getElementById("searchInputIsos");
            if (searchInputIsos) {
                searchInputIsos.addEventListener("keyup", function () {
                    const lista = document.getElementById("listaIsos");
                    const cat = lista.dataset.categoria;
                    if (cat) abrirCategoria(cat, this.value);
                });
            }

            // Pesquisa de Jogos (usa a categoria ativa do modal)
            const searchInputJogos = document.getElementById("searchInputJogos");
            if (searchInputJogos) {
                searchInputJogos.addEventListener("keyup", function () {
                    const lista = document.getElementById("jogos-arquivos");
                    const cat = lista && lista.dataset ? lista.dataset.categoria : null;
                    // Se não houver categoria selecionada, pesquisa em 'jogos' padrão
                    showJogos(cat || 'jogos', this.value);
                });
                // Abrir resultado quando o usuário pressiona Enter
                searchInputJogos.addEventListener('keydown', function (e) {
                    if (e.key === 'Enter') {
                        const termo = (this.value || '').toLowerCase().trim();
                        if (!termo) return;
                        const lista = document.getElementById("jogos-arquivos");
                        const cat = lista && lista.dataset ? lista.dataset.categoria : null;

                        let found = null;
                        // Primeiro tenta na categoria ativa
                        if (cat) {
                            found = (jogos[cat] || []).find(item => item.nome.toLowerCase().includes(termo));
                            if (found) {
                                abrirPaginaJogo(cat, found.nome);
                                return;
                            }
                        }

                        // Se não encontrou na categoria, procura em todas as categorias
                        for (const key in jogos) {
                            if (Object.prototype.hasOwnProperty.call(jogos, key)) {
                                const match = (jogos[key] || []).find(item => item.nome.toLowerCase().includes(termo));
                                if (match) {
                                    abrirPaginaJogo(key, match.nome);
                                    return;
                                }
                            }
                        }

                        // Se chegou até aqui, não encontrou nada
                        alert(`Nenhum jogo encontrado para "${termo}"`);
                    }
                });
            }

            // Pesquisa de Livros
            const searchInputLivros = document.getElementById("searchInputLivros");
            if (searchInputLivros) {
                searchInputLivros.addEventListener("keyup", function () {
                    const ul = document.getElementById("livros-arquivos");
                    const cat = ul.dataset.categoria;
                    if (cat) showLivros(cat, this.value);
                });
            }

            // Pesquisa de Sites
            const searchInputSites = document.getElementById("searchInputSites");
            if (searchInputSites) {
                searchInputSites.addEventListener("keyup", function () {
                    const ul = document.getElementById("Sites-arquivos");
                    const cat = ul.dataset.categoria;
                    if (cat) showSites(cat, this.value);
                });
            }

            // Pesquisa Jogos Mobile
            const searchInputMobile = document.getElementById("searchInputMobile");
            if (searchInputMobile) {
                searchInputMobile.addEventListener("keyup", function () {
                    const termo = this.value.toLowerCase();
                    const lista = document.getElementById("mobile-list");
                    Array.from(lista.children).forEach(li => {
                        const texto = li.textContent.toLowerCase();
                        li.style.display = texto.includes(termo) ? "" : "none";
                    });
                });
            }
        });


        // ======================================================================
        // FUNÇÃO PARA ABRIR PÁGINA DO JOGO
        // ======================================================================
        function abrirPaginaJogo(categoria, nomeJogo) {

            // Fechar modal
            closeModal('modalJogos');

            // Encontrar o jogo nos dados
            const jogo = jogos[categoria].find(j => j.nome === nomeJogo);

            if (!jogo) {
                alert('Jogo não encontrado!');
                return;
            }

            // Criar página do jogo dinamicamente
            criarPaginaJogo(jogo);
        }


        // ======================================================================
        // FUNÇÃO PARA CRIAR PÁGINA DO JOGO
        // ======================================================================
        function criarPaginaJogo(jogo) {
            const backgroundImage = ""; 
            const normalizarVideoDemo = (url) => {
                try {
                    const parsedUrl = new URL(String(url).trim().replace(/[.,]+$/, ''));
                    const host = parsedUrl.hostname.toLowerCase();
                    let videoId = '';

                    if (host === 'youtu.be') {
                        videoId = parsedUrl.pathname.slice(1).split('/')[0];
                    } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
                        if (parsedUrl.pathname === '/watch') {
                            videoId = parsedUrl.searchParams.get('v') || '';
                        } else {
                            videoId = parsedUrl.pathname.match(/^\/(?:embed|shorts|live)\/([^/]+)/)?.[1] || '';
                        }
                    }

                    return /^[\w-]{11}$/.test(videoId)
                        ? `https://www.youtube-nocookie.com/embed/${videoId}`
                        : null;
                } catch {
                    return null;
                }
            };
            const videosDemoValidos = Array.isArray(jogo.videosDemo)
                ? jogo.videosDemo.map(normalizarVideoDemo).filter(Boolean)
                : [];

            const gerarBotoesDownload = () => {
                let botoesDownloadJogo = '';
                const corPadraoBotao = '#e60023';
                const corHoverPadrao = '#ff1a3d';
                const dublagemCor = '#008000'; 
                const dublagemHoverCor = '#00aa00';
                const dublagemStyle = `background: ${dublagemCor}; box-shadow: 0 4px 15px rgba(0, 128, 0, 0.6);`;
                const dublagemHover = `onmouseover="this.style.transform='scale(1.05)'; this.style.
                background='${dublagemHoverCor}'; this.style.boxShadow='0 4px 25px rgba(0, 170, 0, 0.8)';" onmouseout="this.style.transform='scale(1)
                '; this.style.background='${dublagemCor}'; this.style.boxShadow='0 4px 15px rgba(0, 128, 0, 0.6)';"`;

            const baseStyle = `
                display: block; 
                width: 100%; 
                margin: 10px 0; 
                padding: 15px 30px;
                color: white;
                border-radius: 5px;
                font-size: 1.1em; 
                font-weight: bold;
                text-decoration: none;
                transition: all 0.3s ease;
                text-align: center; 
                white-space: nowrap; 
                background: ${corPadraoBotao}; 
                border: 1px solid rgba(255, 255, 255, 0.2); 
                box-shadow: 0 4px 15px rgba(230, 0, 35, 0.6); 
                `;

            const hoverEffects = `
                onmouseover="this.style.transform='scale(1.05)'; this.style.background='${corHoverPadrao}'; this.style.boxShadow='0 4px 25px rgba(255, 26, 61, 0.8)';" 
                onmouseout="this.style.transform='scale(1)'; this.style.background='${corPadraoBotao}'; this.style.boxShadow='0 4px 15px rgba(230, 0, 35, 0.6)';"
               `;

                if (jogo.linkJogo && jogo.linkJogo !== '') {
                    botoesDownloadJogo += `<a href="${jogo.linkJogo}" target="_blank" style="${baseStyle}" ${hoverEffects}>DOWNLOAD PRINCIPAL</a>`;
                }

                [jogo.linkJogo2, jogo.linkJogo3, jogo.linkJogo4, jogo.linkJogo5].forEach((link, index) => {
                    if (link && link !== '') {
                        botoesDownloadJogo += `<a href="${link}" target="_blank" style="${baseStyle}" ${hoverEffects}>DOWNLOAD OPÇÃO ${index + 2}</a>`;
                    }
                });

                // 🆕 NOVO: LÓGICA DO DOWNLOAD DUBLAGEM ADICIONADA AQUI
                if (jogo.linkDublagem && jogo.linkDublagem !== '') {
                    botoesDownloadJogo += `<a href="${jogo.linkDublagem}" target="_blank" style="${baseStyle} ${dublagemStyle}" ${dublagemHover}>DOWNLOAD DUBLAGEM 🗣️</a>`;
                }

                if (jogo.linkbios && jogo.linkbios !== '') {
                    botoesDownloadJogo += `<a href="${jogo.linkbios}" target="_blank" style="${baseStyle}" ${hoverEffects}>DOWNLOAD BIOS</a>`;
                }
                if (jogo.linkcrack && jogo.linkcrack !== '') {
                    botoesDownloadJogo += `<a href="${jogo.linkcrack}" target="_blank" style="${baseStyle}" ${hoverEffects}>DOWNLOAD CRACK</a>`;
                }

                if (jogo.linksExtras && jogo.linksExtras.length > 0) {
                    jogo.linksExtras.forEach((linkExtra) => {
                        botoesDownloadJogo += `<a href="${linkExtra.url}" target="_blank" style="${baseStyle}" ${hoverEffects}>${linkExtra.nome}</a>`;
                    });
                };

                const layoutCompleto = `
    <div class="game-download-layout">

        <!-- VÍDEO ESQUERDO -->
        <div class="game-download-card" style="
            background-color: #0a0a0a;
            border: 2px solid red;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 0 20px rgba(255,0,0,0.6);
        ">
            <h3 style="color: #ff4040; text-align: center; margin-bottom: 10px;">Como Passar pelo Encurtador</h3>
            <iframe class="game-download-video"
                src="https://drive.google.com/file/d/1e6tL4KRZmxT0cbFurja5imxEmNmCq-ar/preview" 
                title="Como passar pelo encurtador" 
                frameborder="0" allowfullscreen
                style="border-radius: 8px;"
            ></iframe>
        </div>

        <!-- DOWNLOADS CENTRALIZADOS -->
        <div class="game-download-links" style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            background: rgba(20, 20, 20, 0.8);
            padding: 25px;
            border-radius: 12px;
            box-shadow: 0 0 20px rgba(255, 26, 61, 0.4);
        ">
            <p style="
                color: #ffcc00;
                font-weight: bold;
                margin-bottom: 20px;
                font-size: 1.5em;
                text-shadow: 0 0 10px rgba(255, 204, 0, 0.5);
            ">🕹️ BOM JOGO! 🕹️</p>
            ${botoesDownloadJogo}
        </div>

        <!-- VÍDEO DIREITO -->
        <div class="game-download-card" style="
            background-color: #0a0a0a;
            border: 2px solid red;
            border-radius: 12px;
            padding: 15px;
            box-shadow: 0 0 20px rgba(255,0,0,0.6);
        ">
            <h3 style="color: #ff4040; text-align: center; margin-bottom: 10px;">Como Baixar Após Extrair</h3>
            <iframe class="game-download-video"
                src="https://drive.google.com/file/d/1t0rZBIcJxhuGqTt7OlXeet58PHc-Hsmd/preview" 
                title="Como baixar o jogo após extrair" 
                frameborder="0" allowfullscreen
                style="border-radius: 8px;"
            ></iframe>
        </div>

    </div>
`;
                return layoutCompleto;
            };

            const gamePageHTML = `
        <div class="game-page" style="
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.9)), url('${backgroundImage}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            background-attachment: fixed;
            z-index: 1000;
            overflow-y: auto;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            /* === CORREÇÃO: ADICIONANDO ROLAGEM SUAVE AQUI === */
            scroll-behavior: smooth; 
        ">
            <a href="javascript:void(0)" onclick="fecharPaginaJogo()" style="
                position: fixed;
                top: 20px;
                left: 20px;
                padding: 10px 20px;
                background: #e60023;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                z-index: 1001;
                backdrop-filter: blur(5px);
                border: 1px solid rgba(255, 255, 255, 0.1);
            ">← Voltar</a>
            
            <header class="hero-section" style="
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                padding: 80px 20px 60px;
                background: rgba(0, 0, 0, 0.4);
                position: relative;
                backdrop-filter: blur(3px);
            ">
                <div class="hero-content" style="max-width: 800px; margin-bottom: 30px;">
                    <h1 style="font-size: 3.5em; color: #e60023; margin-bottom: 10px; text-shadow: 2px 2px 8px rgba(0,0,0,0.8);">${jogo.nome}</h1>
                    <h2 style="font-size: 1.8em; color: #fff; margin-bottom: 20px; text-shadow: 2px 2px 6px rgba(0,0,0,0.8);">Seu próximo grande desafio está a um clique.</h2>
                </div>
                
                <div class="hero-image-container" style="
                    width: 100%;
                    max-width: 600px;
                    border-radius: 10px;
                    overflow: hidden;
                    box-shadow: 0 0 40px rgba(230, 0, 35, 0.4);
                    border: 2px solid rgba(230, 0, 35, 0.3);
                ">
                    <img src="${jogo.imagem}" alt="${jogo.nome}" style="width: 100%; height: auto; display: block;">
                </div>

                ${jogo.imagensDemo && jogo.imagensDemo.length > 0 ? `
                <div class="demo-images" style="
                    width: 100%;
                    max-width: 900px;
                    margin: 32px auto 0 auto;
                    display: flex;
                    gap: 24px;
                    justify-content: center;
                    flex-wrap: wrap;
                ">
                    ${jogo.imagensDemo.map(img => `
                        <img src="${img}" alt="Demo ${jogo.nome}" style="
                            width: 260px;
                            height: 160px;
                            object-fit: cover;
                            border-radius: 16px;
                            box-shadow: 0 0 18px #ff0000;
                            background: #111;
                            margin-bottom: 12px;
                        ">
                    `).join('')}
                </div>
                ` : ''}

                ${videosDemoValidos.length > 0 ? `
                <div class="demo-videos" style="
                    width: 100%;
                    max-width: 900px;
                    margin: 32px auto 0 auto;
                    display: flex;
                    gap: 24px;
                    justify-content: center;
                    flex-wrap: wrap;
                ">
                    ${videosDemoValidos.map(videoUrl => `
                        <div style="text-align: center;">
                            <iframe
                                src="${videoUrl}"
                                title="Vídeo Demo ${jogo.nome}"
                                frameborder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen
                                style="
                                    width: 100%;
                                    max-width: 500px;
                                    height: 260px;
                                    border-radius: 16px;
                                    box-shadow: 0 0 18px #ff0000;
                                    background: #111;
                                    margin-bottom: 5px;
                                "
                            ></iframe>
                            
                            <p style="
                                font-size: 1.1em; 
                                color: #ff1a3d; 
                                font-weight: bold;
                                letter-spacing: 2px;
                                text-shadow: 0 0 5px rgba(255, 26, 61, 0.5);
                                margin-top: 5px;
                                margin-bottom: 20px;
                            ">
                                TRAILER
                            </p>
                        </div>
                    `).join('')}
                </div>
                ` : ''}
            </header>
            
            <div class="divider" style="
                width: 80%; 
                max-width: 1000px; 
                height: 1px; 
                background: linear-gradient(to right, rgba(230, 0, 35, 0), rgba(230, 0, 35, 0.5), rgba(230, 0, 35, 0)); 
                margin: 0 auto; 
                box-shadow: 0 0 10px rgba(230, 0, 35, 0.5);
            "></div>

            <section class="requirements-section" style="
                padding: 60px 20px;
                text-align: center;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
            ">
                <h3 style="font-size: 2em; margin-bottom: 10px; color: white; text-shadow: 2px 2px 4px rgba(0,0,0,0.5);">Requisitos de Sistema (PC)</h3>
                <p style="color: #ccc; font-size: 1.1em;">Garanta a melhor experiência de jogo verificando se sua máquina atende aos requisitos.</p>
                
                <div class="requirements-grid" style="
                    display: flex;
                    justify-content: center;
                    gap: 40px;
                    flex-wrap: wrap;
                    margin: 40px auto 30px;
                    max-width: 900px;
                ">
                    <div class="req-box intel" style="
                        background: rgba(0, 0, 0, 0.8);
                        padding: 30px;
                        border-radius: 8px;
                        width: 100%;
                        max-width: 400px;
                        text-align: left;
                        box-shadow: 0 0 30px rgba(0, 100, 200, 0.3);
                        border: 1px solid rgba(0, 100, 200, 0.2);
                        backdrop-filter: blur(10px);
                    ">
                        <h4 style="text-align: center; font-size: 1.5em; margin-bottom: 20px; color: #0071c5;">
                            Configuração INTEL/NVIDIA
                        </h4>
                        ${processarRequisitosHTML(jogo.requisitos.intel)}
                    </div>

                    <div class="req-box amd" style="
                        background: rgba(0, 0, 0, 0.8);
                        padding: 30px;
                        border-radius: 8px;
                        width: 100%;
                        max-width: 400px;
                        text-align: left;
                        box-shadow: 0 0 30px rgba(237, 28, 36, 0.3);
                        border: 1px solid rgba(237, 28, 36, 0.2);
                        backdrop-filter: blur(10px);
                    ">
                        <h4 style="text-align: center; font-size: 1.5em; margin-bottom: 20px; color: #ed1c24;">
                            Configuração AMD/RADEON
                        </h4>
                        ${processarRequisitosHTML(jogo.requisitos.amd)}
                    </div>
                </div>
                
                <div class="requirements-cta-group" style="
                    margin-top: 30px;
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                ">
                    ${gerarBotoesDownload()}
                </div>
            </section>
            
            <div class="divider" style="
                width: 80%; 
                max-width: 1000px; 
                height: 1px; 
                background: linear-gradient(to right, rgba(230, 0, 35, 0), rgba(230, 0, 35, 0.5), rgba(230, 0, 35, 0)); 
                margin: 0 auto; 
                box-shadow: 0 0 10px rgba(230, 0, 35, 0.5);
            "></div>

            <section class="feedback-section" style="
                padding: 60px 20px;
                text-align: center;
                background: rgba(0, 0, 0, 0.9);
                color: white;
                backdrop-filter: blur(8px);
                border-top: 2px solid rgba(255,255,255,0.1);
                font-family: Arial, sans-serif;
            ">
                <img src="pages/web/Tecnologia/baner/p.png.png" alt="Logo" style="width:80px; margin-bottom:15px; opacity:0.9;">
                
                <div style="margin-bottom: 40px;">
                    <span id="estrelasMedia" style="font-size: 2.5em; color: #ffcc00; text-shadow: 0 0 10px #ffcc00;">★★★★★</span>
                    <p style="font-size: 1.2em; color: #fff; margin-top: 5px;">
                        <strong id="textoMedia" style="color: #ff1a3d;">4,5 DE 5 ESTRELAS</strong>
                        <span id="contagemAvaliacoes" style="color: #999;"> • 6,4 mil Avaliações</span>
                    </p>
                </div>
                
                <h2 style="font-size:2em; margin-bottom:8px;">Avalie Nosso Jogo</h2>
                <p style="color:#ccc; margin-bottom:35px;">Compartilhe sua experiência e nos ajude a melhorar continuamente</p>

                <div style="background:rgba(20,20,20,0.8); border:1px solid rgba(255,255,255,0.1); border-radius:10px; padding:25px; max-width:600px; margin:auto;">
                    <h3 style="text-align:left; color:#ff1a3d; margin-bottom:20px;">⭐ Deixe seu Feedback</h3>

                    <div style="display: flex; flex-direction: column; text-align: left; margin-bottom: 15px;">
                        <label for="nomeFeedback" style="margin-bottom:5px;">Nome:</label>
                        <input id="nomeFeedback" type="text" placeholder="Seu nome" style="
                            width:100%; padding:10px; border-radius:6px; border:none;
                            background:rgba(255,255,255,0.1); color:white; outline:none;
                        ">
                    </div>

                    <div style="display: flex; flex-direction: column; text-align: left; margin-bottom: 20px;">
                        <label for="comentarioFeedback" style="margin-bottom:5px;">Comentário:</label>
                        <textarea id="comentarioFeedback" placeholder="Escreva seu comentário..." style="
                            width:100%; height:100px; border-radius:6px; border:none;
                            padding:10px; resize:none; background:rgba(255,255,255,0.1); color:white; outline:none;
                        "></textarea>
                    </div>

                    <div id="estrelasFeedback" style="font-size:30px; margin:20px 0; cursor:pointer;">★★★★★</div>

                    <button id="enviarFeedback" style="
                        background:#e60023; color:white; border:none; padding:12px 25px;
                        border-radius:8px; cursor:pointer; font-weight:bold;
                        transition:0.3s; box-shadow:0 0 10px rgba(255,26,61,0.6);
                    " onmouseover="this.style.background='#ff1a3d'" onmouseout="this.style.background='#e60023'">
                        <i>✈</i> Enviar Feedback
                    </button>
                </div>

                <div style="margin-top:40px; text-align:left; max-width:600px; margin-left:auto; margin-right:auto;">
                    <h3 style="color:#fff; margin-bottom:15px;">💬 Comentários</h3>
                    <div id="listaFeedback" style="
                        background:rgba(20,20,20,0.8); 
                        border:1px solid rgba(255,255,255,0.1);
                        border-radius:10px; 
                        padding:20px; 
                        min-height:50px;
                        /* === CORREÇÃO: ADICIONANDO ROLAGEM AQUI === */
                        max-height: 400px; /* Altura máxima para o bloco de comentários */
                        overflow-y: auto; /* Adiciona barra de rolagem vertical quando o conteúdo excede a altura máxima */
                        /* ======================================= */
                    ">
                        <p style="color:#999; text-align:center;">Nenhum comentário ainda.</p>
                    </div>
                </div>
            </section>
            
            <footer style="text-align: center; padding: 20px; background: rgba(0, 0, 0, 0.8); color: #666; backdrop-filter: blur(5px);">
                <p>&copy; 2025 GuedesSEC. DEV. ARKANROOT</p>
            </footer>
        </div>
    `;


            // Adicionar a página ao body
            document.body.insertAdjacentHTML('beforeend', gamePageHTML);

            // ==========================================================
            // FEEDBACK DO JOGO - Salva comentários no localStorage 
            // ==========================================================
            function inicializarFeedback() {
                const estrelasInput = document.getElementById("estrelasFeedback");
                const nomeInput = document.getElementById("nomeFeedback");
                const comentarioInput = document.getElementById("comentarioFeedback");
                const listaComentarios = document.getElementById("listaFeedback");
                const botaoEnviar = document.getElementById("enviarFeedback");

                const estrelasMediaDisplay = document.getElementById("estrelasMedia");
                const textoMediaDisplay = document.getElementById("textoMedia");
                const contagemAvaliacoesDisplay = document.getElementById("contagemAvaliacoes");


                if (!estrelasInput || !botaoEnviar || !nomeInput || !comentarioInput || !listaComentarios || !estrelasMediaDisplay || !textoMediaDisplay || !contagemAvaliacoesDisplay) {
                    console.error("Elementos de Feedback não encontrados após a criação da página do jogo.");
                    return;
                }

                let avaliacaoSelecionada = 0;

                const jogoAtual = document.querySelector(".game-page .hero-section h1")?.textContent || "Jogo";
                const chaveStorage = `feedback_${jogoAtual}`;

                // ------------------------------------------------------------------------
                // NOVIDADE: Calcula e formata a média
                // ------------------------------------------------------------------------
                function calcularMediaAvaliacoes(comentarios) {
                    if (comentarios.length === 0) {
                        return { media: 0, count: 0, estrelasHTML: "☆☆☆☆☆" };
                    }

                    const totalEstrelas = comentarios.reduce((sum, c) => sum + c.estrelas, 0);
                    const media = (totalEstrelas / comentarios.length);
                    const mediaArredondada = Math.round(media * 2) / 2; // Arredonda para o meio (0.5 ou 1.0)

                    // Cria a representação visual das estrelas (cheia/meia/vazia)
                    let estrelasHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        if (media >= i) {
                            estrelasHTML += '★'; // Estrela cheia
                        } else if (media >= i - 0.5) {
                            estrelasHTML += '½'; // Meia estrela (ou use a lógica de cor/máscara se quiser algo mais sofisticado)
                        } else {
                            estrelasHTML += '☆'; // Estrela vazia
                        }
                    }

                    return {
                        media: mediaArredondada,
                        count: comentarios.length,
                        estrelasHTML: estrelasHTML.replace('½', '★') // MANTENDO ESTRELAS CHEIAS PARA SIMPLIFICAR A VISUALIZAÇÃO AQUI
                    };
                }

                // ------------------------------------------------------------------------
                // Atualiza a exibição da média no topo
                // ------------------------------------------------------------------------
                function atualizarDisplayMedia(comentarios) {
                    const { media, count, estrelasHTML } = calcularMediaAvaliacoes(comentarios);

                    if (count > 0) {
                        // Atualiza o texto da média
                        textoMediaDisplay.textContent = `${media.toFixed(1).replace('.', ',')} DE 5 ESTRELAS`;

                        // Atualiza a contagem
                        contagemAvaliacoesDisplay.textContent = ` • ${count} Avaliaç${count === 1 ? 'ão' : 'ões'}`;

                        // Atualiza o visual das estrelas (usando a estrela completa para simplificar)
                        const estrelasPreenchidas = '★'.repeat(Math.round(media));
                        const estrelasVazias = '☆'.repeat(5 - Math.round(media));
                        estrelasMediaDisplay.textContent = estrelasPreenchidas + estrelasVazias;

                    } else {
                        // Estado inicial
                        textoMediaDisplay.textContent = `Aguardando Avaliações`;
                        contagemAvaliacoesDisplay.textContent = ``;
                        estrelasMediaDisplay.textContent = '☆☆☆☆☆';
                    }
                }
                estrelasInput.innerHTML = "";
                for (let i = 1; i <= 5; i++) {
                    const star = document.createElement("span");
                    star.textContent = "★";
                    star.style.margin = "0 3px";
                    star.style.transition = "0.2s";
                    star.addEventListener("click", () => {
                        avaliacaoSelecionada = i;
                        atualizarEstrelasInput();
                    });
                    estrelasInput.appendChild(star);
                }

                function atualizarEstrelasInput() {
                    estrelasInput.querySelectorAll("span").forEach((s, idx) => {
                        s.style.color = (idx < avaliacaoSelecionada) ? "#ffcc00" : "#555";
                        s.style.transform = (idx < avaliacaoSelecionada) ? "scale(1.2)" : "scale(1)";
                    });
                }

                // Carregar comentários salvos
                const comentariosSalvos = JSON.parse(localStorage.getItem(chaveStorage)) || [];
                renderizarComentarios(comentariosSalvos);
                atualizarDisplayMedia(comentariosSalvos); // Chamar ao carregar

                // Envio do feedback
                botaoEnviar.addEventListener("click", () => {
                    if (nomeInput.value.trim() === "" || comentarioInput.value.trim() === "" || avaliacaoSelecionada === 0) {
                        alert("Preencha nome, comentário e selecione uma avaliação!");
                        return;
                    }

                    const novo = {
                        nome: nomeInput.value.trim(),
                        comentario: comentarioInput.value.trim(),
                        estrelas: avaliacaoSelecionada,
                        data: new Date().toLocaleString('pt-BR')
                    };

                    comentariosSalvos.push(novo);
                    localStorage.setItem(chaveStorage, JSON.stringify(comentariosSalvos));

                    renderizarComentarios(comentariosSalvos);
                    atualizarDisplayMedia(comentariosSalvos); // Chamar após novo comentário

                    // Limpar formulário
                    nomeInput.value = "";
                    comentarioInput.value = "";
                    avaliacaoSelecionada = 0;
                    atualizarEstrelasInput();
                });

                function renderizarComentarios(lista) {
                    listaComentarios.innerHTML = "";
                    if (lista.length === 0) {
                        listaComentarios.innerHTML = `<p style="color:#999; text-align:center;">Nenhum comentário ainda.</p>`;
                        return;
                    }

                    // Invertendo a ordem para mostrar os mais recentes primeiro
                    [...lista].reverse().forEach(c => {
                        const div = document.createElement("div");
                        div.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
                        div.style.padding = "10px 0";
                        div.innerHTML = `
                    <strong style="color:#ff1a3d;">${c.nome}</strong>
                    <span style="color:#ffcc00; margin-left: 8px;">${"★".repeat(c.estrelas)}</span><br>
                    <p style="margin:5px 0; color:#ddd;">${c.comentario}</p>
                    <small style="color:#777;">${c.data}</small>
                `;
                        listaComentarios.appendChild(div);
                    });
                }

                // Chamamos atualizarEstrelasInput inicialmente para limpar o "★★★★★"
                atualizarEstrelasInput();
            }

            // CHAMADA: Inicializa o feedback imediatamente após a inserção do HTML.
            inicializarFeedback();
        }

        // ======================================================================
        // FUNÇÃO PARA PROCESSAR REQUISITOS EM HTML (MANTIDA)
        // ======================================================================
        function processarRequisitosHTML(requisitos) {
            if (!requisitos) {
                return `
            <div style="margin-bottom: 20px; padding: 15px; border-radius: 5px; background: #121212; border-left: 3px solid #e60023;">
                <p style="font-weight: bold; color: #00e6e6; margin-bottom: 5px;">REQUISITOS:</p>
                <p>Requisitos não especificados</p>
            </div>
        `;
            }
            let html = '';

            if (requisitos.includes('|')) {
                const partes = requisitos.split('|').map(p => p.trim());

                partes.forEach((parte, index) => {
                    const tipo = index === 0 ? 'MÍNIMOS:' : 'RECOMENDADOS:';
                    html += `
                <div style="margin-bottom: 20px; padding: 15px; border-radius: 5px; background: #121212; border-left: 3px solid #e60023;">
                    <p style="font-weight: bold; color: #00e6e6; margin-bottom: 5px;">${tipo}</p>
                    <p>${parte}</p>
                </div>
            `;
                });
            } else {
                html = `
            <div style="margin-bottom: 20px; padding: 15px; border-radius: 5px; background: #121212; border-left: 3px solid #e60023;">
                <p style="font-weight: bold; color: #00e6e6; margin-bottom: 5px;">REQUISITOS:</p>
                <p>${requisitos}</p>
            </div>
        `;
            }

            return html;
        }

        // ======================================================================
        // FUNÇÃO PARA FECHAR PÁGINA DO JOGO (MANTIDA)
        // ======================================================================
        function fecharPaginaJogo() {
            const gamePage = document.querySelector('.game-page');
            if (gamePage) {
                gamePage.remove();
            }

            // Fecha quaisquer modais que possam estar abertos (se houver)
            document.querySelectorAll('.modal-overlay.active').forEach(m => m.classList.remove('active'));

            // Voltar para o topo da página principal (tela inicial)
            window.scrollTo({ top: 0, behavior: 'smooth' });

            // Opcional: desfocar qualquer elemento em foco
            if (document.activeElement) {
                try { document.activeElement.blur(); } catch (e) { /* ignore */ }
            }
        }

        // ======================================================================
        // MODAL DE CURSOS (NOVIDADES)
        // ======================================================================
        function voltarCursos() {
            document.getElementById("cursos-categorias").style.display = "block";
            document.getElementById("cursos-arquivos").style.display = "none";
            document.getElementById("voltarCursos").style.display = "none";
            document.getElementById("search-container-cursos").style.display = "none";
            document.getElementById("searchInputCursos").value = "";
            document.querySelector("#modalNovidades .modal-card h2").textContent = "Escolha uma categoria de Cursos";
        }

        function showCursos(cat, termoPesquisa = '') {
            document.getElementById("cursos-categorias").style.display = "none";
            document.getElementById("cursos-arquivos").style.display = "block";
            document.getElementById("voltarCursos").style.display = "inline-block";
            document.getElementById("search-container-cursos").style.display = "flex";

            const ul = document.getElementById("cursos-arquivos");
            ul.dataset.categoria = cat;
            const termo = (termoPesquisa || document.getElementById("searchInputCursos").value || '').toLowerCase();

            const cursosFiltrados = (dadosCursos[cat] || []).filter(item => item.nome.toLowerCase().includes(termo));

            const titulos = {
                programacao: "Cursos de Programação",
            };
            document.querySelector("#modalNovidades .modal-card h2").textContent = titulos[cat] || "Cursos";

            ul.innerHTML = cursosFiltrados.length === 0
                ? `<li style="justify-content:center;">Nenhum curso encontrado para "${termo}"</li>`
                : '';

            cursosFiltrados.forEach(item => {
                const imageHtml = item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" class="list-icon">` : '<i class="fas fa-graduation-cap"></i>';
                ul.innerHTML += `
            <li>
                ${imageHtml}
                <a href="${item.link}" target="_blank">${item.nome}</a>
            </li>
        `;
            });
        }

        // ======================================================================
        // MODAL DE SALA DE MÁQUINAS
        // ======================================================================

        function voltarSalaDeMAquinas() {
            document.getElementById("sala-categorias").style.display = "block";
            document.getElementById("sala-arquivos").style.display = "none";
            document.getElementById("voltarSalaDeMAquinas").style.display = "none";
            document.getElementById("search-container-salaMAquinas").style.display = "none";
            document.getElementById("searchInputSalaMAquinas").value = "";
            document.querySelector("#modalSalaDeMAquinas .modal-card h2").textContent = "Sala de Máquinas";
        }

        function showSalaDeMAquinas(cat, termoPesquisa = '') {
            document.getElementById("sala-categorias").style.display = "none";
            document.getElementById("sala-arquivos").style.display = "block";
            document.getElementById("voltarSalaDeMAquinas").style.display = "inline-block";
            document.getElementById("search-container-salaMAquinas").style.display = "flex";

            const ul = document.getElementById("sala-arquivos");
            ul.dataset.categoria = cat;
            const termo = (termoPesquisa || document.getElementById("searchInputSalaMAquinas").value || '').toLowerCase();

            const dadosSala = {
                Processador: [
                    { nome: "INTEL", link: "#", imagem: null },
                    { nome: "RYZEN", link: "#", imagem: null },
                    { nome: "XEON", link: "#", imagem: null },
                ],
                PlacaV: [
                    { nome: "AMD", link: "#", imagem: null },
                    { nome: "NIVIDIA", link: "#", imagem: null },
                ],
                PlacaM: [
                    { nome: "?", link: "#", imagem: null },
                ],
                MemoriaR: [
                    { nome: "?", link: "#", imagem: null },
                ],
                armazenamento: [
                   { nome: "?", link: "#", imagem: null },
                ],
                Fonte: [
                    { nome: "?", link: "#", imagem: null },
                ],
                Gabinete: [
                    { nome: "?", link: "#", imagem: null },
                ]
            };

            const itemsFiltrados = (dadosSala[cat] || []).filter(item => item.nome.toLowerCase().includes(termo));

            const titulos = {
                builds: "Builds de PC",
                componentes: "Componentes",
                compatibilidade: "Compatibilidade",
                overclock: "Overclock"
            };
            document.querySelector("#modalSalaDeMAquinas .modal-card h2").textContent = titulos[cat] || "Sala de Máquinas";

            ul.innerHTML = itemsFiltrados.length === 0
                ? `<li style="justify-content:center;">Nenhum item encontrado para "${termo}"</li>`
                : '';

            itemsFiltrados.forEach(item => {
                const imageHtml = item.imagem ? `<img src="${item.imagem}" alt="${item.nome}" class="list-icon">` : '<i class="fas fa-microchip"></i>';
                ul.innerHTML += `
            <li>
                ${imageHtml}
                <a href="${item.link}" target="_blank">${item.nome}</a>
            </li>
        `;
            });
        }

        // ===================== EVENTOS DE PESQUISA =====================
        document.addEventListener('DOMContentLoaded', function () {
            const searchInputAndroid = document.getElementById("searchInputAndroid");
            if (searchInputAndroid) {
                searchInputAndroid.addEventListener("keyup", function () {
                    const ul = document.getElementById("android-arquivos");
                    const cat = ul.dataset.categoria;
                    if (cat) showAndroid(cat, this.value);
                });
            }
            const searchInputCursos = document.getElementById("searchInputCursos");
            if (searchInputCursos) {
                searchInputCursos.addEventListener("keyup", function () {
                    const ul = document.getElementById("cursos-arquivos");
                    const cat = ul ? ul.dataset.categoria : null;
                    if (cat) showCursos(cat, this.value);
                });
            }

            // Evento de pesquisa para Sala de Máquinas
            const searchInputSalaMAquinas = document.getElementById("searchInputSalaMAquinas");
            if (searchInputSalaMAquinas) {
                searchInputSalaMAquinas.addEventListener("keyup", function () {
                    const ul = document.getElementById("sala-arquivos");
                    const cat = ul ? ul.dataset.categoria : null;
                    if (cat) showSalaDeMAquinas(cat, this.value);
                });
            }
        });
