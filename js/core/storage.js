/* ArcadiaStorage: storage seguro e versionado. */
(function(){
  const prefix='arcadia-';
  function get(key,fallback){try{const raw=localStorage.getItem(prefix+key);return raw===null?fallback:JSON.parse(raw)}catch(e){return fallback}}
  function set(key,value){try{localStorage.setItem(prefix+key,JSON.stringify(value));return true}catch(e){return false}}
  function remove(key){try{localStorage.removeItem(prefix+key)}catch(e){}}
  window.ArcadiaStorage={get,set,remove,version:1,
    favorites(){const v=get('favorites',[]);return Array.isArray(v)?v:[]},
    records(){const v=get('records',{});return v&&typeof v==='object'&&!Array.isArray(v)?v:{}},
    saveRecord(key,value){const r=this.records();if(Number(value)>Number(r[key]||0)){r[key]=Number(value);set('records',r)}return r}
  };
})();
