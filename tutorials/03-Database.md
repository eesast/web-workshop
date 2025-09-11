# Database (SQL & GraphQL)

当数据的关系复杂度、规模、并发需求提高到用简单文件保存已不能满足，数据库便应运而生，并成为互联网中最重要的基础设施。在本节中，我们将对用户、会议二个对象和它们之间的关系进行数据库设计和创建（使用 SQL），并使用 Hasura 和 GraphQL 进行数据访存，从而为用户创建和登录、会议创建和加入功能作铺垫。

### 已实现的功能

| 哈希值前 7 位 | 提交信息                               | 对应知识点                                                 | 实现效果                                      |
| ------------- | -------------------------------------- | ---------------------------------------------------------- | --------------------------------------------- |
| 49ee9ea       | feat(03): the blueprint                | 数据库设计方法和原则、数据库基本概念（字段、主键、外键等） | 纸面的数据库设计                              |
| 56bf166       | feat(03): SQL to create tables & items | SQL 基本语法                                               | 数据库表创建完成                              |
| f927b82       | feat(03): Hasura as middleware         | Hasura 使用方法                                            | GraphQL 接口权限和关系调整完成                |
| e52de68       | feat(03): GraphQL queries & mutations  | GraphQL 基本语法                                           | 用户系统、会议系统和聊天室的数据操作编写完成  |
| 6dbc49d       | feat(03): graphql-codegen              | 无                                                         | 生成适合前后端的 TS 代码用于访问 GraphQL 接口 |

### 操作方法

##### 1. 创建 Hasura 和 Postgresql 实例，并相互连接

说明：Postgresql 是数据库，是负责数据储存管理的软件；Hasura 是中间件，是将不同数据库的增删改查操作整合为一个统一的 GraphQL API 对外服务的软件，可以理解为翻译器。Hasura 可以连接很多数据库，不只 Postgresql 一种；Postgresql 也可以通过其他 API 直接连接操作（如 JDBC），Hasura 只是管理更方便。因此，这两者的部署是完全可以分开进行的（后续再连接），只不过一起创建比较方便。

以下是两种部署方式，二选一即可。

##### 1.1 使用 Hasura.io 官方提供的免费版 Hasura 服务

1.1.1 访问[Hasura.io](https://cloud.hasura.io/)，创建一个账户并登录（建议使用与 Github 账号相同的邮箱）

1.1.2 进入控制中心，在 Projects 标签页创建一个新项目（New Project）（建议选择 AWS 和新加坡地域，网络更稳定）

1.1.3 创建好后，可在设置中自行修改实例名称，点击打开控制台（Launch Console）进入 Hasura 服务主页面

1.1.4 在 Data 标签页连接数据库（Connect Database），选择 Postgres，下方有 Neon 提供的免费数据库的卡片，点击 Connect Neon Database

1.1.5 按照提示完成 Neon 账号注册和授权，等待页面刷新后可以看到 Hasura 已经完成了数据库的创建和连接

##### 1.2 使用 Docker 自建 Hasura Community 服务

1.2.1 使用本机安装 Docker 和 Docker compose 并进行后续操作（不推荐，除非你的电脑 24 小时开机且储存空间充足）

1.2.2 购买云服务器安装 Docker 和 Docker compose 并进行后续操作（在第 6 节详细介绍，若你熟悉云服务器的使用可选此方法）

1.2.3 后续操作参见`/server/database/README.md`

##### 2. 创建数据库表并插入记录

这部分主要是对数据库本身的操作，而 SQL 语法基本是各类数据库通用的，因此我们推荐大家用 SQL 指令操作（在`/database/sql`文件夹中）。当然，Hasura 也提供了图形化操作的方式，这里不详解。

##### 2.1. 使用预备的 SQL 语句

2.1.1 在 Hasura 控制台的 Data 标签页，选择左边栏的 SQL，进入 SQL 语句执行窗口

2.1.2 复制`/database/sql/*.sql`中的全部内容，黏贴到执行窗口并点击执行（Run）

2.1.3 注意执行的顺序，由于`user_room`表和`message`表对`user`、`room`表有外键依赖，所以应当先执行`user.sql`和`room.sql`中的内容

2.1.4 执行完提示绿色的 SQL executed!即为执行成功，否则执行失败，可自行根据报错信息 Debug

2.1.5 全部执行成功后应能在数据库的 public 文件夹中看到所设计的四张表，点击每张表，在 Modify 标签页中可以确认各字段的属性与设计相同，此外在 Browse Rows 标签页也可以看到测试数据已导入

##### 2.2 使用 Hasura 图形化界面操作

读者可以根据 Hasura 界面的文字提示自行操作。

唯一需要提示的是 Postgresql 的数据库层次为`Database -> Schema -> Table = Columns * Rows`，在创建表之前可能需要先创建 schema，默认名为 public

##### 3. 调整访问权限和外键查询关系

这部分主要是对暴露的 GraphQL 接口的修改，是对 Hasura 服务的修改，实际与数据库没有关系。

##### 3.1 使用 Hasura 图形化界面操作

3.1.1 进入每张表的 Permissions 标签页，新增一个`user`角色，并给予其合适的权限（注意：一般不允许普通用户直接查询密码，其余权限可视情况而定，例如不允许用户删除其他用户或消息）

3.1.2 点击 public 文件夹（Schema），在 Untracked foreign-key relationships 一栏，选择 track all，即根据外键依赖关系生成对应的 graphql 查询方法。如果要修改关系的名称，也可以在每张表的 Relationships 标签页逐一操作

##### 3.2 使用 Json 文件导入备份

3.2.1 点击 Hasura 控制台顶栏右侧的 Settings，在 Metadata Actions 菜单（默认）下，点击 Import metadata，选择`/database/hasura/hasura_metadata.json`文件即可

3.2.2 该 json 文件是编者根据第一种方法设置后手动导出的配置备份文件，目的主要是为了免去读者不必要的重复操作。使用它的前提是你的表结构与本教程的相同，且无特殊配置。使用后你的数据库将会被重命名为 workshop，这是正常的。如果你想要自定义配置，或想进一步了解，在导入后仍可以按照第一种方法继续调整设置

##### 3.3 使用 Yaml 文件应用修改

3.3.1 安装 Hasura CLI 并配置环境变量，请参考[Install / Uninstall the Hasura CLI | Hasura GraphQL Docs](https://hasura.io/docs/latest/hasura-cli/install-hasura-cli/)

3.3.2 在`/database/hasura`路径下，执行

```bash
hasura version # 确认安装成功
hasura metadata apply --admin-secret <your-secret> --endpoint <your-endpoint>
```

注意：secret 和 endpoint 的寻找位置见第 4 部分，这里的`<your-endpoint>`不包含`/v1/graphql`

3.3.3 仓库中的 yaml 文件也是编者根据第一种方法设置后导出的配置文件，目的主要是为了免去读者不必要的重复操作。使用它的前提是你的表结构与本教程的相同，且无特殊配置。使用后你的数据库将会被重命名为 workshop，这是正常的。如果你想要自定义配置，或想进一步了解，在导入后仍可以按照第一种方法继续调整设置

3.3.4 除此之外，这种 yaml 文件的存储形式格式可以和 Hasura CLI 配合实现 Hasura 配置的 Git 仓库同步和自动应用。在实际生产中我们也是使用这种格式，有兴趣的同学可以阅读[Cloud: GitHub Deployment | Hasura GraphQL Docs](https://hasura.io/docs/latest/cloud-ci-cd/github-integration/)

##### 4. 使用 Hasura 提供的 GraphQL 接口

无论是通过控制台在线试用，还是后续通过 http 请求访问，都需要记住两个变量`HASURA_GRAPHQL_ENDPOINT (endpoint)`和`HASURA_GRAPHQL_ADMIN_SECRET (secret)`，它们相当于你访问 Hasura 服务的账号和密码。如果你是在 hasura.io 上创建的 Hasura 实例，那么你可以在 project 的设置页[Projects - Hasura Cloud](https://cloud.hasura.io/projects)中的 General 栏找到，分别对应 GraphQL API 和 Admin Secret 两项。如果你使用 docker 创建的话，那么 endpoint 就是你的主机/服务器 IP 地址加端口号再加`/v1/graphql`，secret 则定义在你的`docker-compose.yml`或相应环境变量文件中。

##### 4.1 使用控制台在线试用 GraphQL 接口

4.1.1 我们可以使用在线的 Hasura 控制台编写和运行 graphql 语句，点击顶栏的 API 即可进入，左下方可以图形化地选择查询对象和条件从而编写语句，中下方可复制黏贴相应的 graphql 代码，点击运行按钮即可在右下方看到相应代码在这个数据库运行的结果

4.1.2 在实际生产中，我们可能需要实时保存对数据库的修改，这时会用到 3.3 中的 Hasura CLI 在 yaml 配置仓库中启动一个本地控制台。这个控制台与在线控制台没有差异，只是会将你对数据库的修改实时保存到 yaml 配置文件中，方便 Git 同步管理

```bash
hasura console --admin-secret <your-secret> --endpoint <your-endpoint>
```

##### 4.2 通过 http 请求直接访问

在运行时，无论前端还是后端应用，都是通过发送一个 http 请求到 endpoint 来执行一个 graphql 操作的。我们依赖于不同的 npm 包来实现这一点，前端使用 Apollo GraphQL，后端使用 graphql-request。同时，我们使用 graphql-codegen 来根据 graphql 代码自动生成可直接调用的 Typescript 代码，相关配置代码已在`/database/codegen.ts`中给出，大家可以参考`/tutorial/04-Backend.md`中的方法运行。由于该工具与本节知识点无关，且单纯是代码生成的工具，因此不多作讲解，感兴趣的请参见[Introduction (GraphQL-Codegen) (the-guild.dev)](https://the-guild.dev/graphql/codegen/docs/getting-started)

### 作业

选择以下需求其一，根据需求设计或改变原有表结构，使用 Hasura 控制台实现这些修改（别忘了添加相应权限和外键关系），并编写相应 graphql 代码完成数据操作：

- 聊天室的消息可以选择回复之前的某条消息，但没有多层回复或多重回复
- 会议进行时可以添加（多个）实时会议记录，记录没有创建者、但要有创建时间和修改时间
- 便签纸功能，用户可以为每个会议创建一个便签纸，便签纸仅自己可见
