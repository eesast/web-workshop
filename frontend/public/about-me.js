// 移动端菜单切换
const menuBtn = document.getElementById('menuBtn');
const mobileMenu = document.getElementById('mobileMenu');

menuBtn.addEventListener('click', () => {
  mobileMenu.classList.toggle('hidden');
  // 切换图标
  const icon = menuBtn.querySelector('i');
  if (icon.classList.contains('fa-bars')) {
    icon.classList.remove('fa-bars');
    icon.classList.add('fa-times');
  } else {
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  }
});

// 滚动动画
const fadeElements = document.querySelectorAll('.fade-in');

const fadeInObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // 只触发一次
      fadeInObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.1
});

fadeElements.forEach(element => {
  fadeInObserver.observe(element);
});

// 导航栏滚动效果
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  if (window.scrollY > 50) {
    nav.classList.add('py-2', 'shadow');
    nav.classList.remove('py-3');
  } else {
    nav.classList.add('py-3');
    nav.classList.remove('py-2', 'shadow');
  }
});

// 点击移动端菜单链接后关闭菜单
const mobileLinks = mobileMenu.querySelectorAll('a');
mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.add('hidden');
    const icon = menuBtn.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-bars');
  });
});

// 表单提交处理
const contactForm = document.querySelector('form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // 在实际应用中，这里会有表单验证和数据提交逻辑
    alert('感谢您的留言！我会尽快回复您。');
    contactForm.reset();
  });
}

const displayMessage = (message) => {
  const messageDOM = document.createElement("div");
  messageDOM.style = `
    position: fixed;
    top: 46px;
    left: 0px;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    z-index: 9999;
  `;
   messageDOM.innerHTML = `
    <div style="
      background-color: #f0f9ff;
      color: #1890ff;
      padding: 11px 24px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      border-left: 3px solid #1890ff;
      max-width: 80%;
    ">
      ${message}
    </div>
  `;
  const bodyDOM = document.getElementsByTagName("body")[0];
  bodyDOM.appendChild(messageDOM);
  setTimeout(() => {
    bodyDOM.removeChild(messageDOM);
  }, 1500);
};

displayMessage("欢迎来到我的网站~");

// 音乐播放器切换功能
const musicToggleBtn = document.getElementById('musicToggleBtn');
const musicPlayerContainer = document.getElementById('musicPlayerContainer');

// 检查元素是否存在
if (musicToggleBtn && musicPlayerContainer) {
  let isPlaying = false;

  // 绑定点击事件
  musicToggleBtn.addEventListener('click', function() {
    // 切换状态
    isPlaying = !isPlaying;

    // 显示/隐藏播放器
    if (isPlaying) {
      musicPlayerContainer.classList.add('show');
      musicToggleBtn.innerHTML = '<i class="fa fa-pause"></i> 隐藏音乐';
    } else {
      musicPlayerContainer.classList.remove('show');
      musicToggleBtn.innerHTML = '<i class="fa fa-music"></i> 听点音乐';
    }
  });
}
