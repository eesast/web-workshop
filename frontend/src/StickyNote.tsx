import { useState, useEffect } from "react";
import { Button, List, message, Input, Modal, Empty, Spin } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import * as graphql from "./graphql";
import { Card, Container, Scroll, Text } from "./Components";

const { TextArea } = Input;

interface StickyNoteProps {
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  userUUID: string | undefined;
  handleClose: () => void;
}

const StickyNote: React.FC<StickyNoteProps> = ({ room, userUUID, handleClose }) => {
   console.log("StickyNote room:", room);  // 添加调试
  console.log("StickyNote userUUID:", userUUID);
  // 状态管理
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 1. 查询便签列表（使用 room_uid 匹配数据库列名）
  const { data, loading, refetch, error } = graphql.useNotesQuery({
  variables: { room_uid: room?.uuid || "" },
  skip: !room,
});

console.log("查询返回 - data:", data);
console.log("查询返回 - loading:", loading);
console.log("查询返回 - error:", error);
 

  // 2. 创建、更新、删除 mutations
  const [createNote] = graphql.useInsertNotesOneMutation();
  const [updateNote] = graphql.useUpdateNotesByPkMutation();
  const [deleteNote] = graphql.useDeleteNotesByPkMutation();

  // 处理新建/编辑提交
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      message.warning("标题和内容不能为空");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId !== null) {
        // 更新
        await updateNote({
          variables: {
            pk_columns: { id: editingId },
            _set: { title: title.trim(), content: content.trim() },
          },
        });
        message.success("便签更新成功");
      } else {
        // 新建（使用 room_uid 和 user_uid 匹配数据库列名）
        await createNote({
          variables: {
            object: {
              title: title.trim(),
              content: content.trim(),
              room_uid: room?.uuid,
              user_uid: userUUID,
            },
          },
        });
        message.success("便签创建成功");
      }
      // 刷新列表
      refetch();
      // 重置表单并关闭弹窗
      setTitle("");
      setContent("");
      setEditingId(null);
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      message.error(editingId !== null ? "更新便签失败" : "创建便签失败");
    } finally {
      setSubmitting(false);
    }
  };

  // 打开编辑弹窗
  const handleEdit = (note: any) => {
    setEditingId(note.id);
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
  };

  // 删除便签
  const handleDelete = async (id: number) => {
    if (!window.confirm("确定要删除这条便签吗？")) return;
    try {
      await deleteNote({ variables: { id } });
      message.success("便签删除成功");
      refetch();
    } catch (error) {
      console.error(error);
      message.error("删除便签失败");
    }
  };

  // 关闭弹窗时重置状态
  const closeModal = () => {
    setModalVisible(false);
    setTitle("");
    setContent("");
    setEditingId(null);
  };

  if (!room || !userUUID) {
    return null;
  }

  const notes = data?.notes || [];

  return (
    <Card style={{ width: "300px", height: "500px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
        <Text style={{ fontWeight: 'bold' }}>{room.name}</Text>
        <Button type="link" style={{ fontSize: "12px" }} onClick={handleClose}>
          ❌
        </Button>
      </div>
      <Text size="small" style={{ marginBottom: "12px", display: "block" }}>
        便签纸（仅自己可见）
      </Text>

      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={() => {
          setEditingId(null);
          setTitle("");
          setContent("");
          setModalVisible(true);
        }}
        style={{ marginBottom: "12px", width: "100%" }}
      >
        新增便签
      </Button>

      <Scroll>
        {loading ? (
          <Spin tip="加载中..." />
        ) : notes.length === 0 ? (
          <Empty description="暂无便签，点击新增" image={Empty.PRESENTED_IMAGE_SIMPLE} />
        ) : (
          <List
            size="small"
            dataSource={notes}
            renderItem={(note: any) => (
              <List.Item
                actions={[
                  <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(note)} />,
                  <Button type="link" danger icon={<DeleteOutlined />} onClick={() => handleDelete(note.id)} />,
                ]}
              >
                <div>
                  <Text style={{ fontWeight: 'bold' }}>{note.title}</Text>
                  <br />
                  <Text style={{ fontSize: "12px", color: "#999" }}>
                      {new Date(note.created_at).toLocaleString("zh-CN")}
                  </Text>
                  <br />
                  <Text style={{ fontSize: "13px" }}>{note.content}</Text>
                </div>
              </List.Item>
            )}
          />
        )}
      </Scroll>

      <Modal
        title={editingId !== null ? "编辑便签" : "新建便签"}
        open={modalVisible}
        onCancel={closeModal}
        onOk={handleSubmit}
        confirmLoading={submitting}
        okText={editingId !== null ? "更新" : "创建"}
      >
        <Input
          placeholder="标题"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ marginBottom: "12px" }}
        />
        <TextArea
          placeholder="内容"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />
      </Modal>
    </Card>
  );
};

export default StickyNote;