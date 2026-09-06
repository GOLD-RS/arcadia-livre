/* Structural smoke test for the static portal. Full interaction is exercised in the browser QA pass. */
const fs=require('fs');
const root=__dirname;
const expected=[['click','click-rush.html'],['memory','virada-rapida.html'],['snake','pixel-snake.html'],['math','conta-relampago.html'],['stack','stack-neon.html'],['dodge','astro-dodge.html'],['breaker','neon-breaker.html'],['pop','bubble-pop.html'],['mole','pixel-mole.html'],['runner','sky-runner.html'],['color','color-circuit.html']];
const registry=fs.readFileSync(root+'/js/core/registry.js','utf8');
const game=fs.readFileSync(root+'/game.js','utf8');
for(const [key,page] of expected){
 if(!fs.existsSync(root+'/'+page)) throw new Error(`Página ausente: ${page}`);
 const html=fs.readFileSync(root+'/'+page,'utf8');
 for(const src of ['js/core/storage.js','js/core/registry.js','js/core/lifecycle.js','game.js']) if(!html.includes(src)) throw new Error(`${page}: módulo ausente ${src}`);
 if(!registry.includes(`['${key}'`)) throw new Error(`Registro ausente: ${key}`);
 if(!game.includes(`function ${key==='click'?'clickRush':key==='memory'?'memory':key==='snake'?'snake':key==='math'?'math':key==='stack'?'stack':key==='dodge'?'dodge':key==='breaker'?'breaker':key==='pop'?'pop':key==='mole'?'mole':key==='runner'?'runner':'color'}(`)) throw new Error(`Factory ausente: ${key}`);
}
for(const helper of ['ArcadiaStorage','ArcadiaGames','ArcadiaLifecycle']) if(!fs.existsSync(root+'/js/core/'+({ArcadiaStorage:'storage',ArcadiaGames:'registry',ArcadiaLifecycle:'lifecycle'}[helper])+'.js')) throw new Error(`Core ausente: ${helper}`);
if(!game.includes('lifecycle?.destroy()')||!game.includes('lifecycle?.start()')) throw new Error('Host sem integração de lifecycle');
console.log(`OK: ${expected.length} jogos, páginas, módulos core e host verificados.`);
