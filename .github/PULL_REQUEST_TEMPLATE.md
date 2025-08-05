## 📚 基本信息

- **课程章节（Lesson）**: Lesson {{lesson_number}}
- **学生姓名**: {{student_name}}
- **学号/学籍号**: {{student_id}}
- **GitHub 用户名**: {{github_username}}

---

## 🌳 分支信息

- **源分支（Head）**: `{{github_username}}/lesson{{lesson_number}}-hw`
- **目标分支（Base）**: `lesson{{lesson_number}}`

> 请确认你在自己的 Fork 中创建了 `lesson{{lesson_number}}-hw` 分支，并且它已基于最新的 `lesson{{lesson_number}}` 分支。

---

## 🔍 提交内容

- **修改/新增文件**  
  - 列出本次提交中修改或新增的主要文件路径，如：  
    - `exercises/hw1/problem1.py`  
    - `exercises/hw1/README.md`

- **功能简介**  
  简要描述你在本次作业中完成了哪些功能或练习点。

---

## ✅ 自测与检查项

- [ ] 已阅读并理解本次作业要求  
- [ ] 本地通过如下命令测试：  
  ```bash
  git clone https://github.com/{{org}}/{{repo}}.git
  git checkout lesson{{lesson_number}}-hw
  # 运行自动化测试（如有）
  pytest tests/lesson{{lesson_number}}/
