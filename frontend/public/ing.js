// JavaScript Document
function notExisting(){
	window.alert("This link is not ready yet!");
}

function changeStyle() {
    let style = document.getElementById("style");
    if (style.href.includes("main.css")) {
        style.href = "light.css";
    } else {
        style.href = "main.css";
    }
}

//music
        const playlistEl = document.getElementById('playlist');
        const playerInfoEl = document.getElementById('player-info');
        const nowPlayingCoverEl = document.getElementById('now-playing-cover');
        const nowPlayingTitleEl = document.getElementById('now-playing-title');
        const nowPlayingArtistEl = document.getElementById('now-playing-artist');
        const nowPlayingAlbumEl = document.getElementById('now-playing-album');
        const playControlEl = document.getElementById('play-control');
        
        // 全局变量
        let songs = [];
        let currentSongIndex = -1;
        let isPlaying = false;
        let audio = new Audio();
        audio.volume = 0.8; // 默认音量
        
        // 1. 从API获取热榜歌曲数据
        async function fetchHotSongs() {
            try {
                const response = await fetch('https://api.vvhan.com/api/wyMusic/热歌榜?type=json');
                const data = await response.json();
                
                if (data.success && data.data) {
                    songs = data.data;
                    renderPlaylist();
                } else {
                    throw new Error('无法获取歌曲数据');
                }
            } catch (error) {
                console.error('获取歌曲失败:', error);
                playlistEl.innerHTML = '<div class="error">无法加载歌曲列表，请稍后重试</div>';
            }
        }

        // 2. 渲染歌曲列表
        function renderPlaylist() {
            playlistEl.innerHTML = '';
            
            songs.forEach((song, index) => {
                const songItem = document.createElement('div');
                songItem.className = 'song-item';
                songItem.dataset.index = index;
                
                // 格式化时长
                const minutes = Math.floor(song.duration / 60);
                const seconds = song.duration % 60;
                const formattedDuration = `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
                
                songItem.innerHTML = `
                    <div class="song-rank">${index + 1}</div>
                    <div class="song-info">
                        <div class="song-title">${song.title}</div>
                        <div class="song-artist">${song.artist} · ${formattedDuration}</div>
                    </div>
                    <div class="song-play-icon">
                        <i class="fas fa-play"></i>
                    </div>
                `;
                
                songItem.addEventListener('click', () => {
                    if (currentSongIndex === index && isPlaying) {
                        pauseSong();
                    } else {
                        if (currentSongIndex !== index) {
                            loadSong(index);
                        }
                        playSong();
                    }
                });
                
                playlistEl.appendChild(songItem);
            });
        }

        // 3. 加载歌曲
        function loadSong(index) {
            currentSongIndex = index;
            const song = songs[index];
            
            // 更新播放器信息
            nowPlayingTitleEl.textContent = song.title;
            nowPlayingArtistEl.textContent = song.artist;
            nowPlayingAlbumEl.textContent = song.album;
            nowPlayingCoverEl.src = song.cover;
            
            // 显示播放器
            playerInfoEl.classList.add('active');
            
            // 更新播放列表中的当前歌曲样式
            document.querySelectorAll('.song-item').forEach((item, i) => {
                if (i === index) {
                    item.classList.add('playing');
                    item.querySelector('.song-play-icon i').className = 'fas fa-pause';
                } else {
                    item.classList.remove('playing');
                    item.querySelector('.song-play-icon i').className = 'fas fa-play';
                }
            });
            
            // 设置音频源（模拟播放）
            // 实际项目中应使用合法的播放URL
            // audio.src = `https://music.163.com/song/media/outer/url?id=${song.id}.mp3`;
        }

        // 4. 播放歌曲
        function playSong() {
            isPlaying = true;
            playControlEl.innerHTML = '<i class="fas fa-pause"></i>';
            
            // 更新当前歌曲的播放图标
            const currentSongItem = playlistEl.querySelector(`.song-item[data-index="${currentSongIndex}"]`);
            if (currentSongItem) {
                currentSongItem.querySelector('.song-play-icon i').className = 'fas fa-pause';
            }
            
            // 实际播放逻辑
            // audio.play();
        }

        // 5. 暂停歌曲
        function pauseSong() {
            isPlaying = false;
            playControlEl.innerHTML = '<i class="fas fa-play"></i>';
            
            // 更新当前歌曲的播放图标
            const currentSongItem = playlistEl.querySelector(`.song-item[data-index="${currentSongIndex}"]`);
            if (currentSongItem) {
                currentSongItem.querySelector('.song-play-icon i').className = 'fas fa-play';
            }
            
            // 实际暂停逻辑
            // audio.pause();
        }

        // 6. 播放控制按钮事件
        playControlEl.addEventListener('click', () => {
            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        });

        // 7. 初始化
        fetchHotSongs();
