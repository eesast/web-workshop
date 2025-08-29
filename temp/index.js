const express = require('express');
const app = express();
const port = 3000;

// 处理根路径的GET请求
app.get('/', (req, res) => {
  // 从查询参数中获取name
  const name = req.query.name || 'World';

  // 返回个性化的问候消息
  res.send(`Hello World, ${name}!`);
});

// 启动服务器
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Test with: http://localhost:${port}?name=YourName`);
});
