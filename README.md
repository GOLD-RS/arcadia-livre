# Arcadia Livre

Portal independente de jogos HTML5 leves, próprios e gratuitos para celular e PC.

## Estrutura publicada

A raiz deste diretório é a fonte canônica do site publicado no GitHub Pages:

- `index.html` — catálogo e navegação
- `game.js` — lógica do catálogo e dos jogos
- `styles.css` — visual compartilhado
- `click-rush.html`, `virada-rapida.html`, `pixel-snake.html`, `conta-relampago.html`, `stack-neon.html`, `astro-dodge.html` — jogos principais
- `neon-breaker.html`, `bubble-pop.html`, `pixel-mole.html`, `sky-runner.html`, `color-circuit.html` — clássicos próprios inspirados na era Flash

Não há uma segunda árvore de páginas ou módulos: a raiz e `js/` contêm somente os arquivos canônicos referenciados pelo catálogo. O validador oficial fica em `tests/validate-games.js`.

## Direitos e conteúdo

Os onze jogos e a interface foram desenvolvidos para este projeto. Não há arquivos SWF ou jogos de terceiros incluídos neste repositório. A sala de clássicos usa HTML5 próprio, com estética inspirada nos jogos de navegador da era Flash.

Ruffle só poderá ser adicionado junto com conteúdo próprio ou com licença de redistribuição comprovável, incluindo autoria, fonte, licença, atribuição e autorização de distribuição. A licença do Ruffle também deverá ser respeitada.

## Experiência e QA

- Onze páginas individuais, com controles de toque, mouse e/ou teclado.
- Recordes e favoritos ficam somente no navegador, via `localStorage`.
- Partidas pausam quando a aba fica em segundo plano.
- HUD responsivo, foco visível e suporte a `prefers-reduced-motion`.
- Fluxo manual de início nos jogos que usam temporizadores ou movimento.
- Testes manuais publicados: carregamento das onze rotas, início, interação, fim, reinício e persistência local.

## Licença

O código próprio deste projeto está sob a licença MIT, no arquivo `LICENSE`.
A licença do código não concede direitos sobre eventuais conteúdos externos. No estado atual, não há SWF nem jogos de terceiros incluídos.

## Publicação

A publicação usa a branch `main` e a raiz do repositório no GitHub Pages. Antes de adicionar conteúdo externo, verificar a licença e registrar a procedência no projeto.
