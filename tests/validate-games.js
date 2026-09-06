/* Validador oficial do Arcadia Livre: páginas, módulos canônicos, lifecycle e storage. */
const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const expected={click:'click-rush.html',memory:'virada-rapida.html',snake:'pixel-snake.html',math:'conta-relampago.html',stack:'stack-neon.html',dodge:'astro-dodge.html',breaker:'neon-breaker.html',pop:'bubble-pop.html',mole:'pixel-mole.html',runner:'sky-runner.html',color:'color-circuit.html'};
const modules={click:'js/games-click.js',memory:'js/games-memory.js',snake:'games-snake.js',math:'games-math.js',stack:'games-stack.js',dodge:'games-dodge.js',breaker:'games-breaker.js',pop:'js/games-pop.js',mole:'js/games-mole.js',runner:'js/games-runner.js',color:'js/games-color.js'};
const core=['js/core/storage.js','js/core/registry.js','js/core/lifecycle.js','game.js'];
const read=f=>fs.readFileSync(path.join(root,f),'utf8');
const fail=msg=>{throw new Error(msg)};
const registry=read('js/core/registry.js');
const host=read('game.js');
if(fs.existsSync(path.join(root,'validate-games.js'))) fail('Validador duplicado na raiz; use somente tests/validate-games.js');
if(fs.existsSync(path.join(root,'jogos'))) fail('Diretório legado jogos/ ainda existe');
const names=Object.values(modules).map(f=>path.basename(f));
if(new Set(names).size!==names.length) fail('Há módulos com nomes duplicados no conjunto canônico');
for(const [key,page] of Object.entries(expected)){
  const htmlPath=path.join(root,page);
  if(!fs.existsSync(htmlPath)) fail(`Página ausente: ${page}`);
  const html=read(page);
  for(const src of core) if(!html.includes(src)) fail(`${page}: módulo ausente ${src}`);
  if(!html.includes(modules[key])) fail(`${page}: módulo oficial ausente ${modules[key]}`);
  if(html.includes('jogos/')||html.includes('js/games-snake.js')) fail(`${page}: referência a caminho legado/duplicado`);
  if(!registry.includes(`'${key}'`)) fail(`Registro ausente: ${key}`);
}
for(const f of [...Object.values(modules),...core]) if(!fs.existsSync(path.join(root,f))) fail(`Arquivo canônico ausente: ${f}`);
if(!host.includes('lifecycle?.destroy()')||!host.includes('lifecycle?.start()')||!host.includes('lifecycle?.pause()')||!host.includes('lifecycle?.resume()')) fail('Host sem lifecycle completo');
for(const f of Object.values(modules)){
  const src=read(f);
  if(!src.includes('lifecycle')) fail(`${f}: sem lifecycle`);
  if(!src.includes('registerCleanup(')) fail(`${f}: sem registerCleanup`);
  if(src.includes('setCleanup')||src.includes('holdButton')||src.includes('enableSwipe')) fail(`${f}: código legado detectado`);
  if(/\blocalStorage\s*\./.test(src)) fail(`${f}: acesso direto ao localStorage`);
  for(const m of src.matchAll(/(?:window\.)?ArcadiaStorage\??\.([A-Za-z_$][\w$]*)\s*\(/g)) if(!['get','set','remove','preferences','setPreference','favorites','records','saveRecord'].includes(m[1])) fail(`${f}: método ArcadiaStorage.${m[1]} inválido`);
}
const storage=read('js/core/storage.js');
for(const method of ['get','set','remove','preferences','setPreference','favorites','records','saveRecord']) if(!storage.includes(method)) fail(`ArcadiaStorage sem ${method}`);
if(!storage.includes('localStorage')) fail('ArcadiaStorage não acessa localStorage');
if(!read('games-dodge.js').includes('dt/16.67')||!read('games-breaker.js').includes('dt/16.67')||!read('games-stack.js').includes('dt/16.67')||!read('js/games-runner.js').includes('dt/16.67')) fail('Módulo temporal sem atualização baseada em delta');
console.log(`OK: ${Object.keys(expected).length} jogos, somente módulos canônicos, lifecycle, storage e referências verificadas.`);
