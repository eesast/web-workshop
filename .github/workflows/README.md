# Github 和 Docker Hub 相关网页设置

### 前端(Github Pages)

在你复刻的仓库中，进入设置标签页（https://github.com/[username]/web-workshop/settings），点击左边栏的 Pages，在 Build and deployment 下方的 Source，选择 Github Actions。意思是通过自定义的 action 来部署静态 Github Pages（与之相对的是根据仓库中的 markdown 文件自动部署）

### 后端(Docker)

1. 注册 Dockers Hub 账号（[Signup | Docker](https://app.docker.com/signup)），建议使用 Github 注册。如果使用其他方式注册，请将用户名与 Github 保持一致（大小写不敏感）
2. 在 Docker Hub 设置界面的 Personal access tokens（个人访问 Token）（[Personal access tokens | Docker](https://app.docker.com/settings/personal-access-tokens)），新增一个 token（至少要有写权限）并复制下来
3. 在 Github 上复刻仓库的设置页，点击左边栏的 Secrets and variables -> Actions，添加一个 Secret（即密钥，加密防护）和两个 Variables（即变量，明文显示）如下：
   - [Secret] `DOCKERHUB_TOKEN`，值为之前复制的个人访问 Token
   - [Variable] `DOCKERHUB_USERNAME`，值为你的 Docker Hub 账号名
   - [Variable] `DOCKER_TAG`，值为你的 Docker 容器标识名，形如`<repo-name>:latest`，其中`repo-name`任意，不需要与仓库同名
