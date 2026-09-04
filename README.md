# RRL Impressões 3D

Site institucional responsivo criado para apresentar os serviços da RRL, mostrar projetos reais e direcionar novos clientes para orçamento pelo WhatsApp.

## Executar localmente

```powershell
npm install
npm run dev
```

Abra o endereço exibido no terminal.

## Publicar

```powershell
npm run build
```

Os arquivos otimizados serão gerados em `dist/` e podem ser publicados em serviços como Vercel, Netlify ou Cloudflare Pages.

## Atualizar o GitHub no Windows

Dê dois cliques em `atualizar-github.bat`, informe uma descrição curta da alteração e aguarde a confirmação. O arquivo sincroniza o projeto, valida o build, cria o commit e envia para a branch `main`.

## Conteúdo

- `src/App.tsx`: textos, links, serviços, projetos e perguntas frequentes.
- `src/Catalogo.tsx`: produtos, categorias, valores, descrições e disponibilidade do catálogo.
- `catalogo.html`: página independente do catálogo.
- `src/Admin.tsx` e `admin.html`: painel protegido para gestão do catálogo.
- `supabase/schema.sql`: banco, armazenamento e políticas de segurança.
- `SUPABASE_SETUP.md`: instruções para conectar e publicar o painel.
- `src/index.css`: identidade visual e responsividade.
- `public/hero-rrl.png`: imagem de destaque criada para o site.
- `public/logo-oficial.png`: logotipo transparente fornecido pela marca.
- `public/conceito-articulado.png`, `conceito-cinetico.png` e `conceito-personalizados.png`: imagens publicitárias ilustrativas criadas para apresentar possibilidades de produtos.
- `public/conceito-processo.png` e `conceito-decoracao.png`: imagens editoriais ilustrativas usadas para apresentar o processo e aplicações decorativas.
- `public/projeto-instagram-01.jpg` a `projeto-instagram-04.jpg`: capas das publicações reais enviadas como referência.
- `public/logo-instagram.jpg`: imagem de perfil pública da marca.

Os botões de orçamento abrem uma conversa no WhatsApp comercial `(12) 98114-7499`; os links de portfólio continuam direcionando para `@rrlimpressoes3d`.
