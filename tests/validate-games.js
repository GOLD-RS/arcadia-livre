/* Structural smoke test for the static portal. Full interaction is exercised in the browser QA pass. */
const fs=require('fs');
const root=__dirname+'/..';
const expected=[['click','click-rush.html'],['memory','virada-rapida.html'],['snake','pixel-snake.html'],['math','conta-relampago.html'],['stack','stack-neon.html'],['dodge','astro-dodge.html'],['breaker','neon-breaker.html'],['pop','bubble-pop.html'],['mole','pixel-mole.html'],['runner','sky-runner.html'],['color','color-circuit.html']];
const registry=fs.readFileSync(root+'/js/core/registry.js','utf8');
const game=fs.readFileSync(root+'/game.js','utf8');
const migrated={pop:'js/games-pop.js',mole:'js/games-mole.js',runner:'js/games-runner.js',color:'js/games-color.js'};
const classic={click:'js/games-click.js',memory:'js/games-memory.js',snake:'games-snake.js',math:'games-math.js',stack:'games-stack.js',dodge:'games-dodge.js',breaker:'games-breaker.js',pop:'js/games-pop.js',mole:'js/games-mole.js',color:'js/games-color.js',runner:'js/games-runner.js'};

for(const [key,page] of expected){
 if(!fs.existsSync(root+'/'+page)) throw new Error(`Página ausente: ${page}`);
 const html=fs.readFileSync(root+'/'+page,'utf8');
 for(const src of ['js/core/storage.js','js/core/registry.js','js/core/lifecycle.js',...(migrated[key]?[migrated[key]]:[]),'game.js']) if(!html.includes(src)) throw new Error(`${page}: módulo ausente ${src}`);
 if(!registry.includes(`['${key}'`)) throw new Error(`Registro ausente: ${key}`);
 const factory=key==='click'?'clickRush':key==='memory'?'memory':key==='snake'?'snake':key==='math'?'math':key==='stack'?'stack':key==='dodge'?'dodge':key==='breaker'?'breaker':key;
 if(migrated[key]) { if(!fs.existsSync(root+'/'+migrated[key])) throw new Error(`Módulo ausente: ${key}`); const mod=fs.readFileSync(root+'/'+migrated[key],'utf8'); if(!mod.includes(`ArcadiaGameModules.${key}`)) throw new Error(`Registro de módulo ausente: ${key}`); if(game.includes(`function ${key}(`)) throw new Error(`Factory ainda embutida no host: ${key}`); } else if(!game.includes(`function ${factory}(`)) throw new Error(`Factory ausente: ${key}`);
}
for(const helper of ['ArcadiaStorage','ArcadiaGames','ArcadiaLifecycle']) if(!fs.existsSync(root+'/js/core/'+({ArcadiaStorage:'storage',ArcadiaGames:'registry',ArcadiaLifecycle:'lifecycle'}[helper])+'.js')) throw new Error(`Core ausente: ${helper}`);
if(!game.includes('lifecycle?.destroy()')||!game.includes('lifecycle?.start()')) throw new Error('Host sem integração de lifecycle');
const storageSource=fs.readFileSync(root+'/js/core/storage.js','utf8');
const storageMethods=new Set([...storageSource.matchAll(/(?:function\s+|[,{]\s*)([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]));
for(const f of [...new Set(Object.values(classic))]){
 const src=fs.readFileSync(root+'/'+f,'utf8');
 if(/\blocalStorage\s*\./.test(src)) throw new Error(`${f}: acesso direto ao localStorage; use ArcadiaStorage`);
 for(const m of src.matchAll(/(?:window\.)?ArcadiaStorage\??\.([A-Za-z_$][\w$]*)\s*\(/g)){
  if(!storageMethods.has(m[1])) throw new Error(`${f}: ArcadiaStorage.${m[1]} não existe em js/core/storage.js`);
 }
 if(/cellHandlers\.push/.test(src) && !/cellHandlers\s*=/.test(src)) throw new Error(`${f}: cellHandlers usado sem declaração`);
}
console.log(`OK: ${expected.length} jogos, páginas, módulos core e host verificados.`);
