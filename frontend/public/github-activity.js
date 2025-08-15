// 使用匿名函数包裹，避免污染全局作用域
(function() {

    // --- GitHub Activity Fetcher ---

    async function fetchGitHubActivity() {
        //  GitHub 用户名
        const username = 'flyingPointer2';

        const feedContainer = document.getElementById('github-activity-feed');

        // 如果页面上没有这个容器，就直接退出，避免报错
        if (!feedContainer) {
            return;
        }

        try {
            // 使用 GitHub Events API 获取公开活动
            const response = await fetch(`https://api.github.com/users/${username}/events/public`);

            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }

            const events = await response.json();

            // 清空 "Loading..." 提示
            feedContainer.innerHTML = '';

            // 只显示最近的 5 条活动
            const recentEvents = events.slice(0, 5);

            if (recentEvents.length === 0) {
                feedContainer.innerHTML = '<p>No recent public activity found.</p>';
                return;
            }

            recentEvents.forEach(event => {
                let activityHTML = '';
                const repoName = event.repo.name;
                const repoURL = `https://github.com/${repoName}`;
                const eventTime = new Date(event.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

                // 根据不同的事件类型生成不同的描述文本
                switch (event.type) {
                    case 'PushEvent':
                        activityHTML = `Pushed commits to <a href="${repoURL}" target="_blank" class="repo-link">${repoName}</a>`;
                        break;
                    case 'CreateEvent':
                        if (event.payload.ref_type === 'repository') {
                            activityHTML = `Created a new repository <a href="${repoURL}" target="_blank" class="repo-link">${repoName}</a>`;
                        } else if (event.payload.ref_type === 'branch') {
                            activityHTML = `Created a new branch in <a href="${repoURL}" target="_blank" class="repo-link">${repoName}</a>`;
                        }
                        break;
                    case 'WatchEvent':
                        activityHTML = `Starred a repository <a href="${repoURL}" target="_blank" class="repo-link">${repoName}</a>`;
                        break;
                    case 'PullRequestEvent':
                        if (event.payload.action === 'opened') {
                            const prURL = event.payload.pull_request.html_url;
                            activityHTML = `Opened a pull request in <a href="${prURL}" target="_blank" class="repo-link">${repoName}</a>`;
                        }
                        break;
                    case 'ForkEvent':
                        const forkeeURL = event.payload.forkee.html_url;
                        const forkeeName = event.payload.forkee.full_name;
                        const originRepoName = event.repo.name;
                        const originRepoURL = "https://github.com/" + originRepoName;
                        activityHTML = `Forked a repository from <a href="${originRepoURL}" target="_blank" class="repo-link">${originRepoName}</a> to <a href="${forkeeURL}" target="_blank" class="repo-link">${forkeeName}</a>`;
                        break;
                }

                // 如果生成了有效的活动描述，就将其添加到容器中
                if (activityHTML) {
                    const activityElement = document.createElement('div');
                    activityElement.className = 'activity-item';
                    activityElement.innerHTML = `
                        ${activityHTML}
                        <span class="activity-time">${eventTime}</span>
                    `;
                    feedContainer.appendChild(activityElement);
                }
            });

        } catch (error) {
            console.error('Failed to fetch GitHub activity:', error);
            feedContainer.innerHTML = '<p>Could not load GitHub activity. Please try again later.</p>';
        }
    }

    // 页面加载时自动执行获取函数
    fetchGitHubActivity();

})();
