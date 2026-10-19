# Painel administrativo — Biblioteca de Alexandria

## 1. Configure o Supabase
1. Crie/abra seu projeto em https://supabase.com.
2. No SQL Editor, execute o arquivo `supabase-setup.sql`.
3. Em Authentication → Users, crie seu usuário administrativo.
4. Copie o UUID do usuário e execute:
   ```sql
   insert into public.alexandria_admins (user_id)
   values ('UUID-REAL-DO-USUARIO');
   ```
5. Em Project Settings → API, copie a Project URL e a publishable key (ou anon public key).
6. Cole os dois valores em `admin/supabase-config.js`.
   **Nunca use uma `service_role` ou secret key no navegador.**

## 2. Publique e entre
- Envie os arquivos para o mesmo repositório do GitHub Pages.
- Acesse `/admin/` para entrar.
- Use o e-mail e a senha da conta que criou no Supabase.
- O endereço do painel não é a proteção: as políticas RLS e a lista `alexandria_admins` controlam o acesso.

## 3. Como o código funciona
- `admin/index.html`: tela de login.
- `admin/dashboard.html`: formulários e lista de conteúdos.
- `admin/admin.css`: aparência Matrix responsiva.
- `admin/login.js`: autenticação por e-mail e senha.
- `admin/admin.js`: operações CRUD, categorias e upload de imagens.
- `admin/supabase-config.js`: configura a conexão do navegador.
- `supabase-setup.sql`: tabelas e políticas de acesso.

## 4. Atenção: conectar o site público
Este painel grava os links em `alexandria_links` e categorias em `alexandria_categories`.
O site público atual ainda precisa ser adaptado em `main.js` para consultar essas tabelas e renderizar os cards. Isso deve ser feito preservando a estrutura e os estilos atuais da Biblioteca de Alexandria.
