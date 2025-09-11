# 域名、HTTPS 和反向代理设置方法

1. 向域名提供商（如腾讯云）购买域名（注：由于这是学习型工程，大家可以挑最便宜的域名，一般 10 元左右可以包年，次年续费可能要贵一些；所有的域名在技术上都是一样的，只有好听与否的差异）

2. 配置 DNS 解析记录。一般域名提供商会连带提供简单的 DNS 解析服务，设置一条解析到你部署后端用到的服务器的 IPv4 地址（A 记录）即可，其他设置可按需选择

3. 等待十几分钟 DNS 传播，此时你应当已经可以通过如下 URL 访问后端服务（仅将 IP 地址改为域名）

   ```http
   POST http://<your-domain>:20248/user/login
   ```

4. 接下来，我们希望使用 HTTPS 通信（TLS/SSL 加密）来使访问更安全，需要生成 SSL 证书（即带有授权的一对密钥）。我们使用 Let's Encrypt 提供的免费证书及其自助签发软件 certbot

   ```bash
   sudo apt-get install certbot
   ```

5. 安装完成后，运行以下命令即可生成 SSL 证书（如果生成失败，可能是未放通 80 端口，请根据报错信息调整）

   ```bash
   sudo certbot certonly --standalone -d <your-domain>
   ```

   证书生成在`/etc/letsencrypt/live/<your-domain>/`文件夹下，其中`privkey.pem`为私钥、`fullchain.pem`包含公钥。这些文件实际上是指向`/etc/letsencrypt/archive`目录下存储的真实证书的链接，由 certbot 定期更新从而指向最新的证书，在 docker 中使用证书必须将这两个目录都映射到容器内。

6. 接下来，我们使用 Nginx(via Docker)来提供 HTTPS 和反向代理服务，请确保服务器安装了 docker、docker compose

   ```bash
   # 确认是否已安装
   docker -v
   docker compose version
   # docker 安装方法：https://docs.docker.com/engine/install/
   # docker compose 安装方法： https://docs.docker.com/compose/install/
   ```

7. 在本地电脑的仓库中使用 scp 或其他工具将`docker-compose.yml`和`nginx.conf`复制到服务器任意文件夹

   ```bash
   cd ./server/nginx
   scp ./docker-compose.yml <username>@<ip-address>:<directory>/docker-compose.yml
   scp ./nginx.conf.template <username>@<ip-address>:<directory>/nginx.conf
   ```

8. 在服务器上修改`nginx.conf`，正确填写域名和服务器 IP 地址

   ```bash
   vim ./nginx.conf
   ```

9. 在该文件夹中执行 docker compose

   ```bash
   docker compose up -d
   ```

10. 如果后续拉取镜像时遇到网络问题，可以配置 docker hub 的国内镜像源（[Docker Hub 国内镜像源配置 - 飞仔 FeiZai - 博客园 (cnblogs.com)](https://www.cnblogs.com/yuzhihui/p/17461781.html)）

11. 如果提示 Permission denied，可以 sudo 运行，也可以将本用户添加到 docker 用户组

    ```bash
    sudo gpasswd -a <username> docker
    newgrp docker
    ```

12. 确认 docker 容器已启动

    ```bash
    docker ps
    ```

13. 查找对应的 Docker ID，查看其日志。若没有报错，则说明成功启动

    ```bash
    docker logs <docker-id>
    ```

14. 此时，你应当可以通过如下 URL 访问后端服务（将 http 改为 https，且不需要端口号）

    ```http
    POST https://<your-domain>/user/login
    ```
