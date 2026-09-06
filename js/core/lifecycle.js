/* Contrato comum de ciclo de vida para os jogos. */
(function(){
 window.ArcadiaLifecycle={create:function(){let state='idle';return{get state(){return state},start(){state='running'},pause(){if(state==='running')state='paused'},resume(){if(state==='paused')state='running'},restart(){state='running'},destroy(){state='destroyed'}}}};
})();
