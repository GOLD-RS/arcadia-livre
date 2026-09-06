/* Structural validation for the modular game architecture. */
const fs=require('fs');
const root=__dirname;
const expected={click:'click-rush.html',memory:'virada-rapida.html',snake:'pixel-snake.html',math:'conta-relampago.html',stack:'stack-neon.html',dodge:'astro-dodge.html',breaker:'neon-breaker.html',pop:'bubble-pop.html',mole:'pixel-mole.html',runner:'sky-runner.html',color:'color-circuit.html'};
const classic={click:'games-click.js',memory:'games-memory.js',snake:'games-snake.js',math:'games-math.js',pop:'games-pop.js',mole:'games-mole.js',color:'games-color.js',runner:'games-runner.js'};
const registry=fs.readFileSync(root+'/js/core/registry.js','utf8');
const game=fs.readFileSync(root+'/game.js','utf8');
for(const [key,page] of Object.entries(expected)){
 if(!fs.existsSync(root+'/'+page)) throw new Error(`Página ausente: ${page}`);
 const html=fs.readFileSync(root+'/'+page,'utf8');
 for(const src of ['js/core/storage.js','js/core/registry.js','js/core/lifecycle.js','game.js']) if(!html.includes(src)) throw new Error(`${page}: módulo ausente ${src}`);
 if(!registry.includes(`['${key}'`)) throw new Error(`Registro ausente: ${key}`);
 if(classic[key]){
  if(!html.includes(classic[key])) throw new Error(`${page}: módulo específico ausente ${classic[key]}`);
  if(['games-pop.js','games-mole.js','games-color.js','games-runner.js'].some(x=>x!==classic[key]&&html.includes(x))) throw new Error(`${page}: módulo clássico indevido`);
  const legacyTitle={click:"title.textContent='Click Rush'",memory:"title.textContent='Virada Rápida'",snake:"title.textContent='Pixel Snake'",math:"title.textContent='Conta Relâmpago'",pop:"title.textContent='Bubble Pop'",mole:"title.textContent='Pixel Mole'",color:"title.textContent='Color Circuit'",runner:"title.textContent='Sky Runner'"}[key];
  if(legacyTitle && game.includes(legacyTitle)) throw new Error(`${page}: implementação clássica voltou ao game.js`);
 }
}
for(const f of Object.values(classic)) if(!fs.existsSync(root+'/'+f)) throw new Error(`Módulo ausente: ${f}`);
for(const helper of ['storage','registry','lifecycle']) if(!fs.existsSync(root+'/js/core/'+helper+'.js')) throw new Error(`Core ausente: ${helper}`);
if(!game.includes('lifecycle?.destroy()')||!game.includes('lifecycle?.start()')||!game.includes('lifecycle?.pause()')) throw new Error('Host sem lifecycle real');
for(const f of Object.values(classic)){const src=fs.readFileSync(root+'/'+f,'utf8');if(src.includes('pagePaused=false')) throw new Error(`${f}: pagePaused fixo`);if(!src.includes('lifecycle')) throw new Error(`${f}: sem lifecycle`);if(!src.includes('registerCleanup(')) throw new Error(`${f}: sem registerCleanup`);if(src.includes('setCleanup')) throw new Error(`${f}: usa setCleanup legado`)}
const clickModule=fs.readFileSync(root+'/games-click.js','utf8');if(!clickModule.includes('registerCleanup(')) throw new Error('games-click.js: sem limpeza registrada no lifecycle');const snakeModule=fs.readFileSync(root+'/games-snake.js','utf8');const mathModule=fs.readFileSync(root+'/games-math.js','utf8');if(!mathModule.includes('registerCleanup(')||!mathModule.includes('clearInterval')||!mathModule.includes('clearTimeout')||!mathModule.includes('removeEventListener')) throw new Error('games-math.js: lifecycle cleanup incompleto');for(const resource of ['cancelAnimationFrame','removeEventListener','touchstart','touchend','requestAnimationFrame']) if(!snakeModule.includes(resource)) throw new Error(`games-snake.js: recurso sem limpeza/controle ${resource}`);for(const resource of ['cancelAnimationFrame','clearTimeout','removeEventListener']) if(!clickModule.includes(resource)) throw new Error(`games-click.js: limpeza ausente para ${resource}`);
if(!fs.readFileSync(root+'/games-runner.js','utf8').includes('elapsed')) throw new Error('Sky Runner sem pontuação temporal');
console.log(`OK: ${Object.keys(expected).length} jogos, módulos específicos, lifecycle e arquitetura modular verificados.`);
