# Hasura(via Docker)设置步骤

> 如果你已经使用 hasura.io 官网创建 Hasura 服务和数据库、并且希望继续使用，则以下内容不是必需的，在前端和后端的`.env`文件中填写 hasura.io 提供的 endpoint 和 secret 即可

1. 确保服务器安装了 docker、docker compose

   ```bash
   # 确认是否已安装
   docker -v
   docker compose version
   # docker 安装方法：https://docs.docker.com/engine/install/
   # docker compose 安装方法： https://docs.docker.com/compose/install/
   ```

2. 创建`/data/postgresql`文件夹或其他用于存储数据库数据的文件夹（并相应修改`docker-compose.yml`中的挂载点）

   ```bash
   mkdir /data/postgresql
   ```

3. 在本地电脑的仓库中使用 scp 或其他工具将`docker-compose.yml`和`.local.env`复制到服务器任意文件夹

   ```bash
   cd ./server/database
   scp ./docker-compose.yml <username>@<ip-address>:<directory>/docker-compose.yml
   scp ./.local.env.template <username>@<ip-address>:<directory>/.local.env
   ```

4. 在服务器上修改`.local.env`，正确填写 JWT secret（详见`/tutorials/04-Backend.md`）

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

9. 浏览器访问`<address>:<port>/console`，给出的`docker-compose.yml`使用端口 20247

10. 如果无法访问，且服务器在国内地域（或在国外地域但其他网站访问正常），则很可能是服务器端口没放通，新增规则放通 TCP 协议的 20247 端口即可

11. 使用`docker-compose.yml`中定义的`HASURA_GRAPHQL_ADMIN_SECRET`登录 Hasura 后台

12. 在 Data 标签页连接数据库（Connect Database），选择 Postgres，点击 Connect Existing Database

13. 数据库名称随意自取，使用环境变量连接数据库（Connect Database via Environment variable），环境变量是之前`docker-compose.yml`中定义的`PG_DATABASE_URL`，其他设置无需调整，点击 Connect Database

14. 数据库连接完成，后续操作参照`/tutorials/03-Database.md`
