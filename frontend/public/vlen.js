// 获取容器
    const container = document.getElementById('vlenContainer');

    // 生成核心函数
    function createVlen() {
      const vlen = document.createElement('div');
      vlen.className = 'vlen';

      // 随机参数（可根据需求调整范围）
      const size = Math.random() * 15 + 10; // 大小：10-25px（根据图片实际尺寸调整）
      const startX = Math.random() * window.innerWidth; // 初始水平位置（0-视口宽度）
      const fallDuration = Math.random() * 5 + 8; // 下落总时间：8-13秒
      const swingAmplitude = Math.random() * 60 + 40; // 左右摆动幅度：40-100px
      const rotation = Math.random() * 80; // 初始旋转角度（0-360度）

      // 设置樱花样式
      vlen.style.width = `${size}px`;
      vlen.style.height = `${size}px`;
      vlen.style.left = `${startX}px`;
      vlen.style.top = `-50px`; // 初始位置在视口顶部外（根据图片高度调整）

      vlen.style.animation = `fall ${fallDuration}s linear, swing ${fallDuration}s ease-in-out infinite`;
      vlen.style.transform = `rotate(${rotation}deg)`;
      vlen.style.animationDelay = `${Math.random() * 3}s`; // 随机延迟开始时间（0-5秒）

      // 添加CSS动画
      const style = document.createElement('style');
      style.textContent = `
        @keyframes fall {
          0% {
        top: -150px; /* 从视口上方外开始 */
        opacity: 0; /* 初始透明（淡入效果） */
    }
    10% {
        opacity: 0.5; /* 开始可见 */
    }
    90% {
        opacity: 0.5;
    }
    100% {
        top: 100vh; /* 下落到视口底部外 */
        opacity: 0; /* 结束透明（淡出效果） */
    }
        }
        @keyframes swing {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(${swingAmplitude}px); } /* 左右摆动 */
        }
      `;
      document.head.appendChild(style);


      // 加载樱花图片（确保 falling.png 与 HTML 文件在同一目录，或修改路径）
      vlen.innerHTML = `
        <img src="falling.png" alt="镜音连" loading="lazy"> <!-- lazy 加载优化 -->
      `;

      // 添加到容器
      container.appendChild(vlen);

      // 动画结束后移除（避免DOM元素堆积）
      setTimeout(() => {
        vlen.remove();
      }, fallDuration * 800);
    }

    // 初始化：生成初始（数量根据性能调整）
    for (let i = 0; i < 25; i++) {
      createVlen();
    }

    // 定期补充（模拟持续飘落）
    setInterval(createVlen,1000); // 每0.8秒生成
