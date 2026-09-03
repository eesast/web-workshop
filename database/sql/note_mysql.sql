-- MySQL（9.7 实测可用）——第11讲作业（选项 C：会议便签纸）的 MySQL 版本
-- 官方讲解环境为 PostgreSQL + Hasura，请优先使用同目录 user.sql、room.sql、note.sql；
-- 本文件把同一套设计翻译为 MySQL 语法，可在本机 MySQL 直接跑通并验证（已实测）。
-- 注意：MySQL 9.x 已移除 md5()，故密码示例改用 sha2()，仅作占位演示。

SET NAMES utf8mb4;

CREATE DATABASE IF NOT EXISTS web_workshop DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE web_workshop;

-- 1. user（同 user.sql）
CREATE TABLE IF NOT EXISTS `user` (
  uuid       CHAR(36)    NOT NULL,
  username   VARCHAR(64) NOT NULL,
  password   VARCHAR(64) NOT NULL,
  PRIMARY KEY (uuid),
  UNIQUE KEY uk_user_username (username)
) ENGINE = InnoDB;

INSERT INTO `user` (uuid, username, password) VALUES
  ('00000000-0000-0000-0000-000000000000', 'admin', sha2('123456', 256)),
  ('00000000-0000-0000-0000-000000000001', '张三',  sha2('张三',   256)),
  ('00000000-0000-0000-0000-000000000002', '李四',  sha2('李四',   256)),
  ('00000000-0000-0000-0000-000000000003', '王五',  sha2('王五',   256)),
  ('00000000-0000-0000-0000-000000000004', '赵六',  sha2('赵六',   256));

-- 2. room（同 room.sql）
CREATE TABLE IF NOT EXISTS room (
  uuid        CHAR(36)     NOT NULL,
  name        VARCHAR(64)  NOT NULL,
  intro       VARCHAR(255) NOT NULL,
  invite_code CHAR(6)      NOT NULL,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (uuid),
  UNIQUE KEY uk_room_name (name),
  UNIQUE KEY uk_room_invite_code (invite_code)
) ENGINE = InnoDB;

INSERT INTO room (uuid, name, intro, invite_code) VALUES
  ('00000000-0000-0000-0000-100000000001', '公共聊天室', '欢迎加入公共聊天室', 'gD9jE4'),
  ('00000000-0000-0000-0000-100000000002', '聊天室1',    '这是一个聊天室',     'oC3kY5'),
  ('00000000-0000-0000-0000-100000000003', '聊天室2',    '这是一个聊天室',     'uE8aY9'),
  ('00000000-0000-0000-0000-100000000004', '聊天室3',    '这是一个聊天室',     'aF2jR6');

-- 3. note：会议便签纸（本讲新增表）
--    * UNIQUE(user_uuid, room_uuid)：每个用户在每个会议最多一张便签纸
--    * 外键级联：用户或会议被删除时其便签随之删除
--    * updated_at 在修改行时自动刷新（等价于 note.sql 中的触发器）
CREATE TABLE IF NOT EXISTS note (
  id         CHAR(36) NOT NULL DEFAULT (UUID()),
  user_uuid  CHAR(36) NOT NULL,
  room_uuid  CHAR(36) NOT NULL,
  content    TEXT     NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uk_note_user_room (user_uuid, room_uuid),
  KEY idx_note_room (room_uuid),
  CONSTRAINT fk_note_user FOREIGN KEY (user_uuid) REFERENCES `user` (uuid)
    ON UPDATE CASCADE ON DELETE CASCADE,
  CONSTRAINT fk_note_room FOREIGN KEY (room_uuid) REFERENCES room (uuid)
    ON UPDATE CASCADE ON DELETE CASCADE
) ENGINE = InnoDB;

INSERT INTO note (user_uuid, room_uuid, content) VALUES
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', '大家好，我是张三！这是咱们房间的便签纸。待办：今天 15:00 讨论暑培答辩分组。'),
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-100000000001', '收到！我来准备演示用的投影和电脑。'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-100000000001', '（王五）我负责记录会议纪要～'),
  ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000002', '（张三在聊天室1的私人便签）别忘了下周还书。'),
  ('00000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-100000000003', '（赵六）成语接龙战绩存档：心安理得→得过且过→过目不忘。');

-- ================= 常见验证查询 =================
-- 1) 某人某会议的便签（Hasura 中相当于 user_uuid 被 X-Hasura-User-Id 锁定）
-- SELECT r.name, u.username, n.content, n.updated_at
-- FROM note n JOIN room r ON n.room_uuid = r.uuid JOIN `user` u ON n.user_uuid = u.uuid
-- WHERE n.user_uuid = '00000000-0000-0000-0000-000000000001'
--   AND n.room_uuid = '00000000-0000-0000-0000-100000000001';
-- 2) 同一个人在另一房间再插一张应报 ERROR 1062（唯一约束生效）
-- INSERT INTO note (user_uuid, room_uuid, content) VALUES
--   ('00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-100000000001', '重复便签，应失败');
