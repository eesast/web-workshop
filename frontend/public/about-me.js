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
