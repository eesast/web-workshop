// 控制亮/暗模式并保存偏好
(function(){
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  const storageKey = 'aboutme:theme';

  function applyTheme(theme){
    if(theme === 'dark') body.classList.add('dark');
    else body.classList.remove('dark');
  }

  // 读取并应用
  const saved = localStorage.getItem(storageKey) || 'light';
  applyTheme(saved);

  themeToggle.addEventListener('click', ()=>{
    const cur = body.classList.contains('dark') ? 'dark' : 'light';
    const next = cur === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem(storageKey, next);
  });

  // 实时拉取网易云热歌榜（使用 vvhan 接口）
  const musicContainer = document.getElementById('music-list');
  const API = 'https://api.vvhan.com/api/wyMusic/热歌榜?type=json';

  async function renderList(items){
    if(!items || items.length === 0){
      musicContainer.textContent = '未获取到歌曲列表';
      return;
    }
    const ol = document.createElement('ol');
    ol.style.paddingLeft = '1.2em';
    ol.style.margin = '0';
    items.forEach((it, idx)=>{
      const li = document.createElement('li');
      li.style.margin = '6px 0';
      // 尝试从常见字段获取歌曲名与歌手
      const title = it.name || it.title || it.song || it.songname || it[0] || (it.titleName || '未知曲目');
      let artist = '';
      if(it.artist) artist = it.artist;
      else if(it.artists) artist = Array.isArray(it.artists) ? it.artists.join(', ') : it.artists;
      else if(it.singer) artist = it.singer;
      else if(it.ar) artist = (it.ar && Array.isArray(it.ar)) ? it.ar.map(a=>a.name).join(', ') : '';
      li.textContent = `${title}${artist ? ' — ' + artist : ''}`;
      ol.appendChild(li);
    });
    musicContainer.innerHTML = '';
    musicContainer.appendChild(ol);
  }

  async function fetchMusic(){
    musicContainer.textContent = '加载中...';
    try{
      const res = await fetch(API);
      if(!res.ok) throw new Error('网络错误 ' + res.status);
      const data = await res.json();
      // 尝试推断歌曲数组的位置
      let list = null;
      if(Array.isArray(data)) list = data;
      else if(Array.isArray(data.data)) list = data.data;
      else if(Array.isArray(data.list)) list = data.list;
      else if(Array.isArray(data.songs)) list = data.songs;
      else if(data.data && Array.isArray(data.data.list)) list = data.data.list;
      else if(data.result && Array.isArray(data.result)) list = data.result;
      // 某些接口返回对象数组在 data.data.song or data.data.songList
      else if(data.data && (data.data.song || data.data.songList)){
        list = data.data.song || data.data.songList;
      }

      // 最后，若还是 null but data contains key 'hot' etc
      if(!list){
        // collect arrays from object
        for(const k in data){ if(Array.isArray(data[k])){ list = data[k]; break; }}
      }

      // 如果还是没有，展示原始 JSON 的关键信息
      if(!list){
        musicContainer.textContent = '';
        const pre = document.createElement('pre');
        pre.style.maxHeight = '260px'; pre.style.overflow = 'auto';
        pre.textContent = JSON.stringify(data, null, 2);
        musicContainer.appendChild(pre);
        return;
      }

      renderList(list);
    }catch(err){
      musicContainer.textContent = '拉取失败：' + err.message;
    }
  }

  // 自动刷新
  fetchMusic();
  setInterval(fetchMusic, 60 * 1000);

})();
