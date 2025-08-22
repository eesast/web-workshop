// 歌曲播放器（可选，需处理版权问题）
        const audio = new Audio();
        audio.controls = false; // 隐藏默认控件

        // 获取热榜数据并渲染
        async function fetchAndRenderSongs() {
            try {
                const response = await fetch('https://music.163.com/playlist?id=10165288712');
                const data = await response.json();
                const songs = data.data; // 热榜数据在 data.data 中（需验证 API 返回结构）

                // 渲染歌曲列表（生成两倍数据实现无缝滚动）
                const songList = document.getElementById('songList');
                const doubleSongs = [...songs, ...songs]; // 克隆数据实现循环

                doubleSongs.forEach((song, index) => {
                    const songItem = document.createElement('div');
                    songItem.className = 'song-item';
                    songItem.innerHTML = `
                        <img src="${song.cover}" alt="${song.name}" class="cover-img">
                        <div class="song-info">
                            <h3 class="song-name">${song.name}</h3>
                            <p class="song-artist">${song.artist}</p>
                        </div>
                    `;
                    // 点击歌曲播放（需处理音乐链接）
                    songItem.addEventListener('click', () => {
                        audio.src = song.url; // 假设 API 返回播放链接（需验证）
                        audio.play().catch(err => console.log('播放失败:', err));
                    });
                    songList.appendChild(songItem);
                });

                // 启动滚动动画（延迟启动避免初始卡顿）
                setTimeout(() => {
                    songList.classList.add('scrolling');
                }, 500);

                // 鼠标悬停暂停滚动
                songList.addEventListener('mouseenter', () => {
                    songList.style.animationPlayState = 'paused';
                });
                songList.addEventListener('mouseleave', () => {
                    songList.style.animationPlayState = 'running';
                });

            } catch (error) {
                console.error('获取热榜数据失败:', error);
            }
        }

        // 页面加载后执行
        window.addEventListener('load', fetchAndRenderSongs);
