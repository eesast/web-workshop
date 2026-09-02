# 第11讲作业提交 - 便签纸（选项三）

## 1. 表结构 (Schema)
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    title TEXT,
    content TEXT,
    created_at TIMESTAMP DEFAULT now()
);

## 2.GraphQL 查询 (Query) - 获取所有便签
请求语句：
query MyQuery {
  notes {
    id
    title
    content
    created_at
  }
}
返回结果：
{
  "data": {
    "notes": [
      {
        "id": 1,
        "title": "测试1",
        "content": "通过SQL创建",
        "created_at": "2026-09-02T12:33:41.375639"
      },
      {
        "id": 2,
        "title": "测试1",
        "content": "通过SQL创建",
        "created_at": "2026-09-02T12:33:45.121445"
      },
      {
        "id": 3,
        "title": "第二张便签",
        "content": "GraphQL 好方便",
        "created_at": "2026-09-02T12:38:30.827602"
      }
    ]
  }
}
## 3. GraphQL 变更 (Mutation) - 插入新便签
请求语句：
mutation MyMutation {
  insert_notes_one(object: {title: "第二张便签", content: "GraphQL 好方便"}) {
    id
    title
  }
}
返回结果：
{
  "data": {
    "insert_notes_one": {
      "id": 4,
      "title": "第二张便签"
    }
  }
}
## 4. 操作说明
数据库：Neon (PostgreSQL)

API 引擎：Hasura Cloud

表名：notes

主键：id (自增)

默认时间：created_at (自动填充当前时间)
