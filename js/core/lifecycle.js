/* Real lifecycle controller shared by the host and game modules. */
(function(){
  window.ArcadiaLifecycle={create:function(){
    let state='idle'; const cleanups=new Set(), listeners=new Set();
    const notify=()=>listeners.forEach(fn=>fn(state));
    return {get state(){return state}, start(){if(state!=='destroyed'){state='running';notify()}}, pause(){if(state==='running'){state='paused';notify()}}, resume(){if(state==='paused'){state='running';notify()}}, restart(){if(state!=='destroyed'){state='running';notify()}}, onChange(fn){listeners.add(fn);return()=>listeners.delete(fn)}, registerCleanup(fn){if(typeof fn==='function')cleanups.add(fn);return()=>cleanups.delete(fn)}, destroy(){if(state==='destroyed')return;state='destroyed';cleanups.forEach(fn=>{try{fn()}catch(e){}});cleanups.clear();listeners.clear()} };
  }};
})();
