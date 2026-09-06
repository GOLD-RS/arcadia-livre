/* Structural validation for the modular game architecture. */
const fs=require('fs');
const root=__dirname+'/..';
const expected={click:'click-rush.html',memory:'virada-rapida.html',snake:'pixel-snake.html',math:'conta-relampago.html',stack:'stack-neon.html',dodge:'astro-dodge.html',breaker:'neon-breaker.html',pop:'bubble-pop.html',mole:'pixel-mole.html',runner:'sky-runner.html',color:'color-circuit.html'};
const classic={click:'js/games-click.js',memory:'js/games-memory.js',snake:'games-snake.js',math:'games-math.js',stack:'games-stack.js',dodge:'games-dodge.js',breaker:'games-breaker.js',pop:'js/games-pop.js',mole:'js/games-mole.js',color:'js/games-color.js',runner:'js/games-runner.js'};
const registry=fs.readFileSync(root+'/js/core/registry.js','utf8');
const game=fs.readFileSync(root+'/game.js','utf8');
for(const [key,page] of Object.entries(expected)){
 if(!fs.existsSync(root+'/'+page)) throw new Error(`Página ausente: ${page}`);
 const html=fs.readFileSync(root+'/'+page,'utf8');
 for(const src of ['js/core/storage.js','js/core/registry.js','js/core/lifecycle.js','game.js']) if(!html.includes(src)) throw new Error(`${page}: módulo ausente ${src}`);
 if(!registry.includes(`['${key}'`)) throw new Error(`Registro ausente: ${key}`);
 if(classic[key]){
  if(!html.includes(classic[key])) throw new Error(`${page}: módulo específico ausente ${classic[key]}`);
  if(['js/games-pop.js','js/games-mole.js','js/games-color.js','js/games-runner.js'].some(x=>x!==classic[key]&&html.includes(x))) throw new Error(`${page}: módulo clássico indevido`);
  const legacyTitle={click:"title.textContent='Click Rush'",memory:"title.textContent='Virada Rápida'",snake:"title.textContent='Pixel Snake'",math:"title.textContent='Conta Relâmpago'",stack:"title.textContent='Stack Neon'",dodge:"title.textContent='Astro Dodge'",breaker:"title.textContent='Neon Breaker'",pop:"title.textContent='Bubble Pop'",mole:"title.textContent='Pixel Mole'",color:"title.textContent='Color Circuit'",runner:"title.textContent='Sky Runner'"}[key];
  if(legacyTitle && game.includes(legacyTitle)) throw new Error(`${page}: implementação clássica voltou ao game.js`);
 }
}
for(const f of Object.values(classic)) if(!fs.existsSync(root+'/'+f)) throw new Error(`Módulo ausente: ${f}`);
for(const helper of ['storage','registry','lifecycle']) if(!fs.existsSync(root+'/js/core/'+helper+'.js')) throw new Error(`Core ausente: ${helper}`);
if(!game.includes('lifecycle?.destroy()')||!game.includes('lifecycle?.start()')||!game.includes('lifecycle?.pause()')) throw new Error('Host sem lifecycle real');
for(const f of Object.values(classic)){const src=fs.readFileSync(root+'/'+f,'utf8');if(src.includes('pagePaused=false')) throw new Error(`${f}: pagePaused fixo`);if(!src.includes('lifecycle')) throw new Error(`${f}: sem lifecycle`);if(!src.includes('registerCleanup(')) throw new Error(`${f}: sem registerCleanup`);if(src.includes('setCleanup')) throw new Error(`${f}: usa setCleanup legado`)}
const clickModule=fs.readFileSync(root+'/js/games-click.js','utf8');if(!clickModule.includes('registerCleanup(')) throw new Error('games-click.js: sem limpeza registrada no lifecycle');const snakeModule=fs.readFileSync(root+'/games-snake.js','utf8');const mathModule=fs.readFileSync(root+'/games-math.js','utf8');const stackModule=fs.readFileSync(root+'/games-stack.js','utf8');const dodgeModule=fs.readFileSync(root+'/games-dodge.js','utf8');const breakerModule=fs.readFileSync(root+'/games-breaker.js','utf8');if(!breakerModule.includes('registerCleanup(')||!breakerModule.includes('cancelAnimationFrame')||!breakerModule.includes('removeEventListener')) throw new Error('games-breaker.js: lifecycle cleanup incompleto');if(!dodgeModule.includes('registerCleanup(')||!dodgeModule.includes('cancelAnimationFrame')||!dodgeModule.includes('removeEventListener')) throw new Error('games-dodge.js: lifecycle cleanup incompleto');if(!stackModule.includes('registerCleanup(')||!stackModule.includes('cancelAnimationFrame')||!stackModule.includes('removeEventListener')) throw new Error('games-stack.js: lifecycle cleanup incompleto');if(!mathModule.includes('registerCleanup(')||!mathModule.includes('clearInterval')||!mathModule.includes('clearTimeout')||!mathModule.includes('removeEventListener')) throw new Error('games-math.js: lifecycle cleanup incompleto');for(const resource of ['cancelAnimationFrame','removeEventListener','touchstart','touchend','requestAnimationFrame']) if(!snakeModule.includes(resource)) throw new Error(`games-snake.js: recurso sem limpeza/controle ${resource}`);for(const resource of ['cancelAnimationFrame','clearTimeout','removeEventListener']) if(!clickModule.includes(resource)) throw new Error(`games-click.js: limpeza ausente para ${resource}`);
if(!fs.readFileSync(root+'/games-runner.js','utf8').includes('elapsed')) throw new Error('Sky Runner sem pontuação temporal');
const storageSource=fs.readFileSync(root+'/js/core/storage.js','utf8');
const storageMethods=new Set([...storageSource.matchAll(/(?:function\s+|[,{]\s*)([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]));
for(const f of [...new Set(Object.values(classic))]){
 const src=fs.readFileSync(root+'/'+f,'utf8');
 if(/\blocalStorage\s*\./.test(src)) throw new Error(`${f}: acesso direto ao localStorage; use ArcadiaStorage`);
 for(const m of src.matchAll(/(?:window\.)?ArcadiaStorage\??\.([A-Za-z_$][\w$]*)\s*\(/g){
  if(!storageMethods.has(m[1])) throw new Error(`${f}: ArcadiaStorage.${m[1]} não existe em js/core/storage.js`);
 }
 if(/cellHandlers\.push/.test(src) && !/cellHandlers\s*=/.test(src)) throw new Error(`${f}: cellHandlers usado sem declaração`);
}
console.log(`OK: ${Object.keys(expected).length} jogos, módulos específicos, lifecycle e arquitetura modular verificados.`);
