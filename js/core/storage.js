/* ArcadiaStorage: storage seguro y preparado para migrações. */
(function(){
  const PREFIX='arcadia-';
  function get(key,fallback){try{const raw=localStorage.getItem(PREFIX+key);return raw===null?fallback:JSON.parse(raw)}catch(e){return fallback}}
  function set(key,value){try{localStorage.setItem(PREFIX+key,JSON.stringify(value));return true}catch(e){return false}}
  function remove(key){try{localStorage.removeItem(PREFIX+key)}catch(e){}}
  window.ArcadiaStorage={get,set,remove,safeParse:get,version:1,
    preferences(key,fallback){const p=get('preferences',{});return p&&typeof p==='object'&&!Array.isArray(p)&&key in p?p[key]:fallback},
    setPreference(key,value){const p=get('preferences',{});const next=p&&typeof p==='object'&&!Array.isArray(p)?p:{};next[key]=value;set('preferences',next)},
    favorites(){const v=get('favorites',[]);return Array.isArray(v)?v:[]},
    records(){const v=get('records',{});return v&&typeof v==='object'&&!Array.isArray(v)?v:{}},
    saveRecord(key,value){const r=this.records();if(Number(value)>Number(r[key]||0)){r[key]=Number(value);set('records',r)}return r}
  };
})();
