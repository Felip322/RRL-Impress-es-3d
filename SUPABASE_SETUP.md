# Configuração do catálogo administrável

## 1. Criar o projeto

Crie um projeto gratuito em [supabase.com](https://supabase.com) usando uma conta pertencente ao dono da RRL.

## 2. Criar banco e armazenamento

No painel do Supabase, abra **SQL Editor**, cole todo o conteúdo de `supabase/schema.sql` e execute uma vez. Isso cria:

- tabela de produtos;
- códigos automáticos no padrão `RRL-001`;
- lista de administradores;
- armazenamento público das fotos;
- regras que permitem leitura pública e escrita somente por administradores.

## 3. Criar o usuário do proprietário

1. Abra **Authentication > Users**.
2. Crie o usuário com o e-mail do proprietário e uma senha forte.
3. Copie o UUID desse usuário.
4. Volte ao **SQL Editor** e execute, substituindo o valor:

```sql
insert into public.admin_users (user_id)
values ('UUID-DO-USUARIO');
```

Não há cadastro público no painel. Um usuário autenticado somente consegue alterar produtos se o UUID estiver em `admin_users`.

## 4. Conectar o projeto local

Copie `.env.example` para `.env.local` e preencha com os valores exibidos em **Project Settings > API**:

```env
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=SUA_CHAVE_PUBLICA
```

Nunca coloque a `service_role` ou uma chave secreta no site. O arquivo `.env.local` já está ignorado pelo Git.

Execute:

```powershell
npm run dev
```

Acesse:

- Site: `http://localhost:5173/`
- Catálogo: `http://localhost:5173/catalogo.html`
- Painel: `http://localhost:5173/admin.html`

## 5. Publicar no Cloudflare Pages

Use `npm run build` como comando e `dist` como diretório de saída. Cadastre `VITE_SUPABASE_URL` e `VITE_SUPABASE_PUBLISHABLE_KEY` também nas variáveis de ambiente do Cloudflare Pages.

Depois da publicação, o proprietário poderá administrar o catálogo em `https://SEU-DOMINIO/admin.html`.
