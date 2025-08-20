#!/bin/bash

echo "🚀 启动本地开发环境..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js未安装，请先安装Node.js"
    exit 1
fi

# 检查PostgreSQL是否安装
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL未安装，请先安装PostgreSQL"
    exit 1
fi

echo "✅ 检查依赖完成"

# 设置数据库
echo "📊 设置数据库..."
cd database


# 启动后端
echo "🔧 启动后端服务..."
cd ../backend
if [ ! -f "node_modules" ]; then
    echo "📦 安装后端依赖..."
    npm install
fi

# 检查环境变量文件
if [ ! -f ".local.env" ]; then
    echo "📝 创建环境变量文件..."
    cp .local.env.template .local.env
    echo "⚠️  请编辑 .local.env 文件，设置正确的配置"
fi

echo "🚀 启动后端服务 (端口: 8888)..."
npm run dev &
BACKEND_PID=$!

# 启动前端
echo "🎨 启动前端服务..."
cd ../frontend
if [ ! -f "node_modules" ]; then
    echo "📦 安装前端依赖..."
    npm install
fi

echo "🚀 启动前端服务 (端口: 3000)..."
npm start &
FRONTEND_PID=$!

echo ""
echo "🎉 本地开发环境启动完成！"
echo ""
echo "📱 访问地址:"
echo "   - 前端应用: http://localhost:3000"
echo "   - 后端API: http://localhost:8888"
echo ""
echo "🔧 管理工具:"
echo "   - Hasura控制台: http://localhost:9695 (需要手动启动)"
echo ""
echo "💡 提示:"
echo "   - 按 Ctrl+C 停止所有服务"
echo "   - 查看 LOCAL_DEVELOPMENT.md 获取详细说明"
echo ""

# 等待用户中断
trap "echo '🛑 停止服务...'; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit" INT
wait
