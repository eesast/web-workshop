// 展示 GitHub 仓库
async function showRepos() {
	const repoList = document.getElementById('github-repo-list');
	if (!repoList) return;
	try {
		const res = await fetch('https://api.github.com/users/suifengwudong/repos');
		const repos = await res.json();
		let html = '<ul style="padding-left:0;">';
		const filtered = repos.filter(repo => !repo.name.startsWith('HW'));
		filtered.slice(0, 5).forEach(repo => {
			html += `<li style="list-style:none;margin-bottom:8px;"><a href="${repo.html_url}" target="_blank">${repo.name}</a> <span style="color:#888;font-size:0.95em;">⭐${repo.stargazers_count}</span></li>`;
		});
		html += '</ul>';
		repoList.insertAdjacentHTML('beforeend', html);
	} catch (e) {
		repoList.insertAdjacentHTML('beforeend', '<p style="color:red;">仓库获取失败</p>');
	}
}

async function fetchGitHubCommits() {
  const res = await fetch('https://api.github.com/users/suifengwudong/events');
  const events = await res.json();
  let html = '<ul style="padding-left:0;">';
  let count = 0;
  for (const event of events) {
    if (event.type === 'PushEvent' && event.payload.commits) {
      for (const commit of event.payload.commits) {
        html += `<li style="list-style:none;margin-bottom:8px;">
          <a href="https://github.com/${event.repo.name}/commit/${commit.sha}" target="_blank">${commit.message.slice(0, 60)}</a>
          <span style="color:#888;font-size:0.95em;"> (${event.repo.name})</span>
        </li>`;
        count++;
        if (count >= 5) break;
      }
    }
    if (count >= 5) break;
  }
  if (count === 0) html += '<li>暂无最近提交</li>';
  html += '</ul>';
  return html;
}

// 提交事件
async function showCommits(commitList) {
	if (!commitList) return;
	try {
		const html = await fetchGitHubCommits();
		commitList.insertAdjacentHTML('beforeend', html);
	} catch (e) {
		commitList.insertAdjacentHTML('beforeend', '<p style="color:red;">提交获取失败</p>');
	}
}
async function deleteCommits(commitList) {
	if (!commitList) return;
	// 只删除ul和p类型的提交内容，保留h3和按钮
	Array.from(commitList.children).forEach(child => {
		if (child.tagName === 'UL') {
			commitList.removeChild(child);
		}
	});
}

let commitsShown = false;
async function showCommitsByClick(btn) {
	if (!btn) return;
	const commitList = document.getElementById('github-commits');
	if (!commitsShown) {
		btn.textContent = '正在加载...';
		await showCommits(commitList);
		btn.textContent = '收起';
		commitsShown = true;
	} else {
		btn.textContent = '展开';
		await deleteCommits(commitList);
		commitsShown = false;
	}
}

function toggleDarkMode() {
	const body = document.body;
	const btn = document.getElementById('dark-mode-toggle');
	body.classList.toggle('dark-mode');
	if (body.classList.contains('dark-mode')) {
		btn.textContent = '切换白天模式';
	} else {
		btn.textContent = '切换黑暗模式';
	}
}

window.addEventListener('DOMContentLoaded', () => {
	showRepos();      // 页面加载时展示仓库
});
