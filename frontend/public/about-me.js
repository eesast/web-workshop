document.addEventListener('DOMContentLoaded', function() {
    // 1. 获取需要操作的 DOM 元素
    var toggleButton = document.getElementById('colormode');
    var quoteButton = document.getElementById('quote-button');
    var body = document.body;
    // 使用新的选择器来匹配所有圆角框
    var roundBoxes = document.querySelectorAll('.light-mode-round-box, .dark-mode-round-box');
    // 使用新的选择器来匹配所有标题
    var headings = document.querySelectorAll('.light-mode-head, .dark-mode-head, h1, h2, h3');
    // 使用新的选择器来匹配所有段落和列表项
    var texts = document.querySelectorAll('.light-mode-text, .dark-mode-text, p, li');

    // 2. 为颜色模式按钮添加点击事件监听器
    toggleButton.addEventListener('click', function() {
        // 3. 切换 body 的暗色模式类
        body.classList.toggle('dark-mode');

        // 检查当前是否为暗色模式
        var isDarkMode = body.classList.contains('dark-mode');
        
        // 4. 遍历所有圆角框，切换它们的类
        for (var i = 0; i < roundBoxes.length; i++) {
            roundBoxes[i].classList.toggle('dark-mode-round-box', isDarkMode);
            roundBoxes[i].classList.toggle('light-mode-round-box', !isDarkMode);
        }

        // 5. 遍历所有标题，切换它们的类
        for (var i = 0; i < headings.length; i++) {
            headings[i].classList.toggle('dark-mode-head', isDarkMode);
            headings[i].classList.toggle('light-mode-head', !isDarkMode);
        }

        // 6. 遍历所有段落和列表项，切换它们的类
        for (var i = 0; i < texts.length; i++) {
            texts[i].classList.toggle('dark-mode-text', isDarkMode);
            texts[i].classList.toggle('light-mode-text', !isDarkMode);
        }

        // 7. 切换按钮的亮色/暗色模式类，并更新文字
        toggleButton.classList.toggle('dark-mode-button', isDarkMode);
        toggleButton.classList.toggle('light-mode-button', !isDarkMode);
        
        // 8. 切换按钮的文字
        if (isDarkMode) {
            toggleButton.textContent = '亮色模式';
        } else {
            toggleButton.textContent = '暗色模式';
        }
        //9.切换名言按钮的类
        quoteButton.classList.toggle('dark-mode-button', isDarkMode);
        quoteButton.classList.toggle('light-mode-button', !isDarkMode);
    });

    // 封装一个获取名言的函数
    function fetchRandomQuote() {
        // 获取显示名言和作者的元素
        const quoteText = document.getElementById('quote-text');
        const quoteAuthor = document.getElementById('quote-author');
        
        // 清空现有内容，避免显示旧名言
        quoteText.textContent = '加载中...';
        quoteAuthor.textContent = '';
        
        // 使用 fetch API 向外部服务发起请求
        fetch('https://api.quotable.io/random')
            .then(response => {
                if (!response.ok) {
                    throw new Error('网络请求失败');
                }
                return response.json();
            })
            .then(data => {
                quoteText.textContent = `“${data.content}”`;
                quoteAuthor.textContent = `— ${data.author}`;
            })
            .catch(error => {
                console.error('获取名言时发生错误:', error);
                quoteText.textContent = '无法加载名言，请稍后重试。';
            });
    }

    // 页面加载完成后立即调用一次，以显示第一条名言
    fetchRandomQuote();

    // 为随机切换按钮添加点击事件监听器
    quoteButton.addEventListener('click', fetchRandomQuote);
});