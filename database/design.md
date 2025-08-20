# 数据库设计文档

## 概述

本数据库设计用于支持趣味会议软件的功能，包括用户管理、会议管理、聊天功能和文件共享。

## 表结构设计

### 1. 用户表 (user)

存储用户基本信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| uuid | UUID | PRIMARY KEY | 用户唯一标识 |
| username | TEXT | UNIQUE, NOT NULL | 用户名 |
| password | TEXT | NOT NULL | 密码（加密存储） |

### 2. 房间表 (room)

存储会议房间信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| uuid | UUID | PRIMARY KEY | 房间唯一标识 |
| name | TEXT | NOT NULL | 房间名称 |
| description | TEXT | NULL | 房间描述 |
| creator | UUID | FOREIGN KEY | 创建者ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 创建时间 |

### 3. 用户房间关系表 (user_room)

存储用户与房间的关联关系。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| uuid | UUID | PRIMARY KEY | 关系唯一标识 |
| user | UUID | FOREIGN KEY | 用户ID |
| room | UUID | FOREIGN KEY | 房间ID |
| joined_at | TIMESTAMP | DEFAULT NOW() | 加入时间 |

### 4. 消息表 (message)

存储聊天消息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| uuid | UUID | PRIMARY KEY | 消息唯一标识 |
| content | TEXT | NOT NULL | 消息内容 |
| sender | UUID | FOREIGN KEY | 发送者ID |
| room | UUID | FOREIGN KEY | 房间ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 发送时间 |

### 5. 文件表 (file)

存储文件信息。

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| uuid | UUID | PRIMARY KEY | 文件唯一标识 |
| filename | TEXT | NOT NULL | 文件名 |
| filepath | TEXT | NOT NULL | 文件路径 |
| filesize | INTEGER | NOT NULL | 文件大小（字节） |
| filetype | TEXT | NOT NULL | 文件类型 |
| uploader | UUID | FOREIGN KEY | 上传者ID |
| room | UUID | FOREIGN KEY | 房间ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 上传时间 |

## 关系设计

### 外键关系

1. **room.creator** → **user.uuid**
   - 房间创建者必须是已存在的用户

2. **user_room.user** → **user.uuid**
   - 用户房间关系中的用户必须是已存在的用户

3. **user_room.room** → **room.uuid**
   - 用户房间关系中的房间必须是已存在的房间

4. **message.sender** → **user.uuid**
   - 消息发送者必须是已存在的用户

5. **message.room** → **room.uuid**
   - 消息所属房间必须是已存在的房间

6. **file.uploader** → **user.uuid**
   - 文件上传者必须是已存在的用户

7. **file.room** → **room.uuid**
   - 文件所属房间必须是已存在的房间

### 级联删除规则

- 删除用户时，级联删除该用户创建的房间、发送的消息、上传的文件
- 删除房间时，级联删除该房间的所有消息、文件和用户关系
- 删除消息时，不级联删除其他数据
- 删除文件时，不级联删除其他数据

## 索引设计

### 主键索引
- 所有表的主键字段自动创建索引

### 唯一索引
- `user.username` - 确保用户名唯一性

### 普通索引
- `room.creator` - 加速按创建者查询房间
- `message.room` - 加速按房间查询消息
- `message.sender` - 加速按发送者查询消息
- `file.room` - 加速按房间查询文件
- `file.uploader` - 加速按上传者查询文件
- `user_room.user` - 加速按用户查询房间关系
- `user_room.room` - 加速按房间查询用户关系

## 权限设计

### 用户角色
- **user**: 普通用户，可以创建房间、发送消息、上传文件
- **admin**: 管理员，拥有所有权限

### 权限矩阵

| 操作 | user | admin |
|------|------|-------|
| 查看自己的用户信息 | ✓ | ✓ |
| 修改自己的密码 | ✓ | ✓ |
| 创建房间 | ✓ | ✓ |
| 加入房间 | ✓ | ✓ |
| 发送消息 | ✓ | ✓ |
| 上传文件 | ✓ | ✓ |
| 删除自己的消息 | ✓ | ✓ |
| 删除自己上传的文件 | ✓ | ✓ |
| 查看所有用户 | ✗ | ✓ |
| 删除任何用户 | ✗ | ✓ |
| 删除任何房间 | ✗ | ✓ |
| 删除任何消息 | ✗ | ✓ |
| 删除任何文件 | ✗ | ✓ |

## 数据完整性约束

### 检查约束
- `filesize > 0` - 文件大小必须大于0
- `username` 长度限制 - 用户名长度在3-50个字符之间
- `password` 长度限制 - 密码长度至少6个字符

### 非空约束
- 所有主键字段
- 用户名、密码
- 房间名称
- 消息内容
- 文件名、文件路径、文件大小、文件类型

## 扩展性考虑

### 未来可能的扩展
1. **会议记录表** - 存储会议记录
2. **会议记录表** - 存储会议笔记
3. **便签表** - 存储用户便签
4. **消息回复表** - 支持消息回复功能
5. **用户设置表** - 存储用户个性化设置

### 性能优化
1. 消息表按时间分区
2. 文件表按房间分区
3. 定期清理过期数据
4. 使用缓存减少数据库查询
