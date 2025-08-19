// self-executing anonymous function to encapsulate our code
(function() {
    // 1. Get references to the DOM elements we need
    const toggleButton = document.getElementById('theme-toggle-button');
    const body = document.body;
    const lightThemeHighlight = document.getElementById('light-theme-highlight');
    const darkThemeHighlight = document.getElementById('dark-theme-highlight');

    // 2. Function to apply the chosen theme
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');  // 使 body 标签拥有 .dark-mode 类
            toggleButton.textContent = '☀️'; // Sun icon for switching to light mode

            // 将暗色模式的代码样式激活、亮色模式的代码样式关闭
            lightThemeHighlight.disabled = true;
            darkThemeHighlight.disabled = false;
        } else {
            body.classList.remove('dark-mode');
            toggleButton.textContent = '🌙'; // Moon icon for switching to dark mode
            lightThemeHighlight.disabled = false;
            darkThemeHighlight.disabled = true;
        }
        // Re-run highlight.js to apply the new theme to code blocks
        hljs.highlightAll();
    }

    // 3. Function to toggle the theme and save the preference
    function toggleTheme() {
        // Check if the body currently has the dark-mode class
        const isDarkMode = body.classList.contains('dark-mode');
        const newTheme = isDarkMode ? 'light' : 'dark';

        // Apply the new theme
        applyTheme(newTheme);

        // Save the user's preference to localStorage
        localStorage.setItem('theme', newTheme);
    }

    // 4. Event listener for the button click
    toggleButton.addEventListener('click', toggleTheme);

    // 5. Initial theme determination on page load
    function initializeTheme() {
        // Priority: 1. localStorage, 2. System Preference, 3. Default (light)
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        if (savedTheme) {
            // If the user has a saved preference, use it
            applyTheme(savedTheme);
        } else if (systemPrefersDark) {
            // Otherwise, if their OS is in dark mode, use dark mode
            applyTheme('dark');
        } else {
            // Otherwise, default to light mode
            applyTheme('light');
        }
    }

    // Run the initialization function when the script loads
    initializeTheme();

})();
