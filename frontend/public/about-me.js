const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    body.setAttribute('data-theme', savedTheme);
    updateThemeButtonText();
}

themeToggle.addEventListener('click', () => {
    if (body.getAttribute('data-theme') === 'dark') {
        body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
    updateThemeButtonText();
});

function updateThemeButtonText() {
    const isDark = body.getAttribute('data-theme') === 'dark';
    themeToggle.textContent = isDark ? '☀️ 亮色模式' : '🌙 暗色模式';
}

async function fetchGitHubInfo() {
    const githubStats = document.getElementById('github-stats');
    
    try {
        const response = await fetch('https://api.github.com/users/Giustizia6174');
        if (!response.ok) {
            throw new Error('GitHub API请求失败');
        }
        
        const data = await response.json();
        
        githubStats.innerHTML = `
            <p>公开仓库数: ${data.public_repos}</p>
            <p>注册于: ${new Date(data.created_at).toLocaleDateString()}</p>
            <p>最近更新于: ${new Date(data.updated_at).toLocaleDateString()}</p>
        `;
    } catch (error) {
        githubStats.innerHTML = `<p>无法加载GitHub信息: ${error.message}</p>`;
        console.error('获取GitHub信息失败:', error);
    }
}

const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
    const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
    const message = formData.get('message') || contactForm.querySelector('textarea').value;
    
    if (!name || !email || !message) {
        showFormMessage('请填写所有必填字段', 'error');
        return;
    }
    
    showFormMessage('消息发送成功！', 'success');
    contactForm.reset();
    
    console.log('表单数据:', { name, email, message });
});

function showFormMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = `form-message ${type}`;
    
    setTimeout(() => {
        formMessage.style.opacity = '0';
        setTimeout(() => {
            formMessage.className = 'form-message';
            formMessage.style.opacity = '1';
        }, 500);
    }, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchGitHubInfo();
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});