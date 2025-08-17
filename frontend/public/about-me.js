const themeToggleButton = document.getElementById('themeToggleButton');
    const body = document.body;
    body.classList.add('light-mode');
    themeToggleButton.addEventListener('click', function () {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
        }
    });

    const githubApiUrl = `https://api.github.com/users/EngH126/repos`;

    fetch(githubApiUrl)
      .then(response => response.json())
      .then(data => {
            let repoInfo = '';
            data.forEach(repo => {
                repoInfo += `<p>仓库名称: ${repo.name}</p>`;
                repoInfo += `<p>仓库描述: ${repo.description || '暂无描述'}</p>`;
                repoInfo += '<hr>';
            });
            document.getElementById('githubRepoInfo').innerHTML = repoInfo;
        })
      .catch(error => {
            console.error('获取Github仓库信息失败:', error);
            document.getElementById('githubRepoInfo').innerHTML = '<p>获取仓库信息失败，请检查网络或稍后重试。</p>';
        });
