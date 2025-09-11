# 后端(via Docker)设置步骤

1. 确保服务器安装了 docker、docker compose

   ```bash
   # 确认是否已安装
   docker -v
   docker compose version
   # docker 安装方法：https://docs.docker.com/engine/install/
   # docker compose 安装方法： https://docs.docker.com/compose/install/
   ```

2. 在本地电脑的仓库中使用 scp 或其他工具将`docker-compose.yml`和`.local.env`复制到服务器任意文件夹

   ```bash
   cd ./server/backend
   scp ./docker-compose.yml.template <username>@<ip-address>:<directory>/docker-compose.yml
   scp ./.local.env.template <username>@<ip-address>:<directory>/.local.env
   ```

3. 在服务器上修改`docker-compose.yml`，正确填写 Docker Hub 或 Github Container Registry 的 Docker Tag，形如`<username>/<repo-name>:latest`或`ghcr.io/<username>/<repo-name>:latest`

   ```bash
   vim ./docker-compose.yml
   ```

4. 在服务器上修改`.local.env`，与本地`/backend/.local.env`内容相同，新增了一个`FILE_DIR`，一般不需要修改

   ```bash
   vim ./.local.env
   ```

5. 在该文件夹中执行 docker compose

   ```bash
   docker compose up -d
   ```

6. 如果后续拉取镜像时遇到网络问题，可以配置 docker hub 的国内镜像源（[Docker Hub 国内镜像源配置 - 飞仔 FeiZai - 博客园 (cnblogs.com)](https://www.cnblogs.com/yuzhihui/p/17461781.html)）

7. 如果提示 Permission denied，可以 sudo 运行，也可以将本用户添加到 docker 用户组

   ```bash
   sudo gpasswd -a <username> docker
   newgrp docker
   ```

8. 确认 docker 容器已启动

   ```bash
   docker ps
   ```

9. 查找对应的 Docker ID，查看其日志。若出现`Server running at http://localhost:8888/`，则说明成功启动

   ```bash
   docker logs <docker-id>
   ```

10. 使用 Postman 执行任意请求（需要换成`<address>:<port>`，给出的`docker-compose.yml`使用端口 20248），若行为表现与本地后端相同，则说明部署成功

11. 如果无法访问，且服务器在国内地域（或在国外地域但其他网站访问正常），则很可能是服务器端口没放通，新增规则放通 TCP 协议的 20248 端口即可
