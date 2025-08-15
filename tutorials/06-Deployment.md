# Deployment (CI/CD & Server)

在前 5 节中，我们已经在本地完成了网站的全部开发工作，但如何让世界上所有人都能 24 小时访问你的网站呢？在本节，我们将运用 Github CI/CD 来构建前端和后端的 Docker 镜像，使用 Github Pages 来托管前端页面，并尝试自己购买一个云服务器来提供网站的后端和数据库服务。

### 已实现的功能

| 哈希值前 7 位 | 提交信息                                   | 对应知识点                                         | 实现效果                                                |
| ------------- | ------------------------------------------ | -------------------------------------------------- | ------------------------------------------------------- |
| cf00ffc       | feat(06): frontend on Github Pages         | Github Actions 基本语法、Github Pages 配置方法     | 通过 Github Pages 的公开网址访问前端网页                |
| e2bc962       | feat(06): build backend as docker          | Dockerfile 基本语法、Github Actions 与 Docker 配合 | 后端服务被构建为 Docker 镜像                            |
| b67e770       | feat(06): above the cloud                  | 网站服务架构、Docker Compose 使用                  | 可以通过 IP 访问服务器上的后端和数据库服务              |
| f97998b       | feat(06): upgrade to https                 | HTTPS、域名、反向代理                              | 可以通过域名访问服务器上的服务，不会警告`mixed content` |
| 1c9d3cd       | feat(06): desktop application via electron | Electron 基本概念                                  | 基于 Electron 的桌面应用                                |

### 操作方法

见各文件夹中的`README.md`

### 作业

自行购置云服务器和域名，根据各文件夹中的`README.md`，部署前端、后端、数据库服务，从而最终可以公网访问你的网站
