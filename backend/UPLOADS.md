# Uploads da Biblioteca de Alexandria

O formulário público envia arquivos para o backend Node.js. Os metadados ficam em `data/uploads.json` e os arquivos fora da pasta pública, em `data/uploads/`. A pasta `data/` não deve ser publicada nem apagada durante atualizações.

## Executar localmente

1. Instale Node.js 20 ou superior.
2. Na raiz do projeto, execute `npm install`.
3. Inicie o site e a API com `npm start`.
4. Abra `http://localhost:3000` e use o link **Enviar um arquivo** ou acesse o painel em `http://localhost:3000/admin/painel.html`. O painel agora também contém o formulário de upload.

Não abra `index.html` diretamente pelo sistema de arquivos: o navegador precisa carregar o site e a API pela mesma origem HTTP.

## Publicar em um VPS

1. Copie o projeto para o VPS e instale Node.js 20 ou superior.
2. Execute `npm ci` na raiz do projeto.
3. Configure um serviço de processo para executar `npm start` e reiniciá-lo após falhas ou reinicializações do VPS.
4. Configure um proxy reverso HTTPS para encaminhar o domínio ao Node na porta configurada. Sirva o site e a API pelo mesmo domínio.
5. Se houver exatamente um proxy reverso confiável, configure `TRUST_PROXY_HOPS=1`; sem proxy, mantenha `0`.
6. Persista e faça backup da pasta `data/`. Não a inclua no controle de versão.

## Limites e proteção

- Máximo de 25 MiB por arquivo e cinco tentativas de envio por endereço IP a cada hora.
- Armazenamento total padrão de 1 GiB. Pode ser alterado com `MAX_TOTAL_STORAGE_BYTES`, em bytes.
- Formatos aceitos: PDF, TXT, MD, PNG, JPG, WEBP e GIF. O servidor confere extensão e assinatura/conteúdo; outros formatos são recusados.
- Arquivos não são publicados como conteúdo executável: downloads são servidos como anexos com `nosniff`.
- O envio é público e o download também; não há contas, aprovação de moderador nem antivírus. A verificação de formato não substitui um scanner antimalware. Para uma biblioteca pública, monitore o armazenamento e considere aprovação manual ou antivírus antes de liberar os downloads.

## DevTools público

- A seção **DevTools** mostra os trechos publicados e permite copiá-los. A busca global também indexa títulos, descrições, linguagens e código.
- O formulário fica no painel de usuário. Como a publicação foi configurada para qualquer visitante, qualquer pessoa que acessar o painel pode publicar trechos; não há autenticação, moderação, edição ou remoção pelo painel.
- Os registros ficam em `data/devtools.json`, são persistidos no servidor e sobrevivem a reinicializações. Mantenha `data/` em armazenamento persistente e faça backup.
- O servidor aceita até 5 publicações por IP por hora, 500 registros no total, títulos de até 100 caracteres, descrições até 300 caracteres e códigos de até 20.000 caracteres / 64 KiB em UTF-8. O código é mostrado como texto, nunca executado no site.
