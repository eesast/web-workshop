# Backend (NodeJS & Express)

在浏览器的操作是受限的、在客户端的身份是可伪造的，因此我们需要在服务器端完成诸如复杂计算、身份验证等功能——即后端。NodeJS 和 Express 是后端的一种实现方式，其中 NodeJS 使 JS 脱离浏览器环境独立运行成为可能。我们在本节中将配合数据库构建完整的用户系统，并探索邮件验证功能。

### 环境配置

##### 1. 请确保已安装

- NodeJS 20（或更新），附带 npm 包管理器
- yarn 包管理器

```bash
node -v
npm -v
yarn -v
```

以上三条命令均返回版本号即说明安装成功

##### 2.（可选，建议）npm 和 yarn 换源

这里使用淘宝源和 yarn 官方源，网络情况基本稳定

```bash
npm config set registry https://registry.npmmirror.com
yarn config set registry https://registry.yarnpkg.com
```

##### 3. 依赖安装

注意：由于后端和数据库都在子文件夹内，一定要先切换对应文件夹再执行 npm/yarn 指令

```bash
cd backend # 或 cd database，对于 graphql-codegen
yarn # 是 yarn install 的简写
```

安装过程输出日志较长，请检查其中没有 error（warning 是正常的）

##### 4. 更改环境变量

后端和数据库对应文件夹中均有`.local.env.template`文件夹，这个文件会告诉你项目中用到了哪些环境变量（及其格式），但由于环境变量每个人不同、且含有密钥等敏感信息、所以不会上传到 Github 仓库中。

大家需要根据自己情况填写变量值，删去多余注释，并将`.local.env.template`更名为`.local.env`（或新建文件复制过去），即可被项目正确识别。

此外，有关`JWT_SECRET`的说明详见下方的“注意事项”。

### 运行方式

对于 graphql-codegen，运行

```bash
yarn generate
```

即可在`/backend/src/graphql.ts`和`/frontend/src/graphql.tsx`处看到生成的代码文件

如果生成过程中报错，请根据报错信息自行检查，一般是环境变量未配置正确，或 graphql 代码与数据库实际接口不符

对于后端应用，运行

```bash
yarn start
```

即可在`http://localhost:8888`访问后端服务

### 已实现的功能

| 哈希值前 7 位 | 提交信息                           | 对应知识点                                                                         | 实现效果                                   |
| ------------- | ---------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------ |
| 8fbc957       | feat(04): Hello World from Express | NodeJS 应用基本结构、Express 基本用法                                              | 后端服务器第一次启动                       |
| a7572f9       | feat(04): request & response       | Express 路由、get、post 请求方法和对应参数解析方式、状态码                         | 访问不同路由和解析参数成功                 |
| 064d803       | feat(04): user system              | 环境变量的引入、GraphQL 查询方法、JWT                                              | 用户登录、注册功能                         |
| f6e5b0d       | feat(04): handle files             | text/json/form-data 内容类型、中间件、fs 文件处理                                  | 用户上传、查看和下载文件（云盘）           |
| 291ba95       | feat(04): email service            | 前后端实际交互过程、请求头、CORS 跨域问题、Express 请求解析执行顺序、SMTP 邮件服务 | “联系我们”表格提交后自动发送邮件到指定邮箱 |

### 注意事项

##### 关于 JWT secret

后端和数据库都是依靠后端所签发的 JWT（JSON Web Token）来进行身份校验的（技术细节：[JSON Web Token 入门教程 - 阮一峰的网络日志 (ruanyifeng.com)](https://ruanyifeng.com/blog/2018/07/json_web_token-tutorial.html)），而其中核心就是共同的 JWT secret 密钥。因此，我们需要在后端和数据库定义相同的环境变量，来确保校验成功。

首先，你需要生成一个 JWT secret，任意长度的字符串均可。方便起见，你可以用这个网站[JwtSecret.com - Generate JWT Secrets Online](https://jwtsecret.com/generate)

其次，对于后端只需要在`/backend/.local.env`中修改`JWT_SECRET`环境变量为这个字符串即可（切记不要上传到 Github，部署时也是在云服务器本地修改它的`.local.env`）

然后，如果你选择使用 Hasura.io 官方提供的免费版 Hasura 服务，那么需要在你的项目控制中心（注意不是 Hasura 控制台，是一开始创建项目的地方）进入项目的设置页，在左侧 Env vars 菜单，添加一个新的环境变量（New Env Var），名称为`HASURA_GRAPHQL_JWT_SECRET`（Hasura 内置环境变量，不可改名），值为`{"type":"HS256", "key": "<your-secret>"}`

如果你选择的是 Docker 自建的 Hasura Community 服务，那么需要添加相同的环境变量，`/server/database/.local.env.template`已经给出相关提示（注意：是在云服务器本地修改环境变量，不要上传到 Github）

最后，尝试请求`http://localhost:8888`登陆成功后，将返回的 token 复制下来。打开 Hasura 控制台，在 API 标签页中上方 Request Headers 中取消勾选`x-hasura-admin-secret`（管理员密钥），并新增`{"Authorization": "Bearer <your-token>"}`作为请求头，如果你的 graphql 语句能在下方窗口中正常运行返回结果，即配置正确。

当然，也可以直接使用 Postman 模拟远程的 graphql 请求，同样加上这个请求头，或在 Authorization 栏选择 Bearer Token 并填写 token 即可（两者等效）

##### 关于 Postman

Postman 是后端调试必不可少的工具，可以图形化地创建、发送很多类型的请求，并观察其相应结果。

你可以使用桌面端、网页端或 VScode 插件版（推荐），在此下载[Download Postman | Get Started for Free](https://www.postman.com/downloads/)

相关的文档[Send API requests and get response data in Postman | Postman Learning Center](https://learning.postman.com/docs/sending-requests/requests/)

### 作业

我们目前实现的路由还很不完善，请选择以下需求之一实现并测试功能

提示：

1. 请仔细设计输入检查，例如参数是否正确传入、用户是否在数据库中存在等，并相应设计状态码和提示信息
2. 你有可能需要修改 graphql 文件并重新生成 graphql.ts 来完成一些数据库操作

- ”忘记密码？”：对于用户名为邮箱的用户，允许其通过密码重置邮件来修改密码，共需要实现两个路由

  - `/user/change-password/request`：发送一封含有重置密码链接的邮件到用户名所在的邮箱地址，链接中需要包括一个使用 JWT 将用户信息签名的 token（来识别和验证身份）
    - 请求方法：`POST`
    - 参数：`{username: string}`
    - 返回：无要求
  - `/user/change-password/action`：验证 token 的真伪，并根据 token 中的用户信息在数据库中修改密码
    - 请求方法：`POST`
    - 参数：`{token: string, newPassword: string}`
    - 返回：无要求

- “痕迹抹除”：我们虽然可以新建用户和上传文件，但却不可以删除用户或删除文件，这有时会很尴尬。实现这个功能需要两个路由

  - `/user/delete`：删除用户及其所有记录（注：由于外键级联删除，我们只需要在数据库中删除用户记录即可）
    - 请求方法：`GET`
    - 参数：无（但有 Authorization 请求头）
    - 返回：无要求
  - `/file/delete`：删除某个文件
    - 请求方法：`POST`
    - 参数：`{room: uuid, filename: string}`
    - 返回：无要求
