
document.addEventListener('DOMContentLoaded', () => {
  // 1. 暗色/亮色模式切换
  const themeBtn = document.getElementById('theme-toggle-btn');

  if (themeBtn) {
    // 初始化：检查本地存储
    if (localStorage.getItem('theme') === 'dark') {
      document.body.classList.add('dark-mode');
      themeBtn.textContent = '☀️ 切换亮色模式';
    }

    themeBtn.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
      const isDark = document.body.classList.contains('dark-mode');

      themeBtn.textContent = isDark ? '☀️ 切换亮色模式' : '🌙 切换暗色模式';
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  } else {
    console.warn("未找到 id='theme-toggle-btn' 的元素，请检查 HTML");
  }

  // 2. 获取 GitHub 个人信息
  fetchGitHubProfile('Yuhan-Yao768');
});

async function fetchGitHubProfile(username) {
  const container = document.getElementById('github-card');
  if (!container) {
    console.warn("未找到 id='github-card' 的元素，请检查 HTML");
    return;
  }

  try {
    const response = await fetch(`https://api.github.com/users/${username}`);

    if (!response.ok) {
      throw new Error(`请求失败，状态码: ${response.status}`);
    }

    const data = await response.json();

    container.innerHTML = `
      <div style="display: flex; align-items: center; gap: 15px; padding: 10px; border: 1px solid #ccc; border-radius: 8px;">
        <img src="${data.avatar_url}" alt="Avatar" width="60" style="border-radius: 50%;">
        <div>
          <h3 style="margin: 0;">${data.name || data.login}</h3>
          <p style="margin: 5px 0;">${data.bio || '暂无个人简介'}</p>
          <small>📦 公开仓库数: ${data.public_repos} | 👥 粉丝数: ${data.followers}</small>
        </div>
      </div>
    `;
  } catch (error) {
    container.innerHTML = `<p style="color: red;">获取数据失败: ${error.message}</p>`;
  }
}