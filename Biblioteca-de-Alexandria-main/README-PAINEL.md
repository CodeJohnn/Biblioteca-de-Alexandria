# Painel de administração

## Abrir e entrar

O painel não tem link público na página inicial. Acesse diretamente
`admin-painel.html` no mesmo navegador usado para visitar `index.html`.
O acesso inicial de demonstração é `admin` / `admin`; altere as constantes
`USERNAME` e `PASSWORD` em `admin-painel.js` antes de compartilhar o projeto.
Os quatro cards principais continuam fixos. No painel, escolha um card (por
exemplo, Isos) e uma categoria interna (por exemplo, Linux) para adicionar,
editar ou excluir itens que aparecem dentro do modal daquele card. Os itens
originais continuam disponíveis; o painel gerencia os itens adicionais.

Os itens adicionados são guardados na chave
`bibliotecaAlexandria.itensInternos.v1` do `localStorage` e renderizados pelos
modais existentes de `index.html`.

## Limite importante do armazenamento local

Essa versão não precisa de backend e mantém os dados após fechar o navegador,
mas o `localStorage` pertence a um navegador e a uma origem. Portanto, as
alterações aparecem somente para quem as cadastrou naquele navegador; não são
publicadas para os demais visitantes, dispositivos ou navegadores. Para editar
conteúdo público compartilhado, use uma API com autenticação real (por exemplo,
Node.js com banco de dados, ou Supabase) e substitua a leitura/gravação local
por chamadas autenticadas a essa API.

O login desta versão é apenas uma barreira visual. Como HTML e JavaScript são
entregues ao navegador, as credenciais podem ser inspecionadas e não protegem
conteúdo publicado. Não reutilize senha real; para produção, a autenticação deve
ser validada no servidor.

## Integração e execução

`index.html` carrega `site-content.js` antes de `main.js`. O script fornece os
itens adicionais para os modais de Isos, Livros, Torrent e Sites. O painel usa
o mesmo script para gravar e listar esses itens.

Para evitar restrições de segurança do navegador com arquivos locais, sirva a
pasta do site por um servidor estático local e abra a página inicial e o painel
na mesma origem. Em um terminal na pasta do site, por exemplo:

```sh
python -m http.server 8000
```

Depois acesse `http://localhost:8000/` e
`http://localhost:8000/admin-painel.html`.
