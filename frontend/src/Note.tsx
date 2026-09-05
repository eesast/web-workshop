import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Scroll, Text } from "./Components";

type NoteData = graphql.GetNotesByRoomQuery["note"][0];

interface NoteProps {
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

const Note: React.FC<NoteProps> = ({ room, handleClose }) => {
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [initialized, setInitialized] = useState(false);
  const [savingUuids, setSavingUuids] = useState<string[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const { data, loading, error } = graphql.useGetNotesByRoomQuery({
    skip: !room,
    variables: { room_uuid: room?.uuid },
  });

  const [addNoteMutation] = graphql.useAddNoteMutation();
  const [updateNoteMutation] = graphql.useUpdateNoteMutation();
  const [deleteNoteMutation] = graphql.useDeleteNoteMutation();

  useEffect(() => {
    if (data?.note && !initialized) {
      setNotes(data.note);
      setInitialized(true);
    }
  }, [data, initialized]);

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach(clearTimeout);
    };
  }, []);

  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取会议记录失败！");
    }
  }, [error]);

  const handleAdd = async () => {
    const result = await addNoteMutation({
      variables: { room_uuid: room?.uuid, content: "" },
    });
    const newNote = result.data?.insert_note_one;
    if (newNote) {
      setNotes((prev) => [...prev, newNote]);
    } else if (result.errors) {
      console.error(result.errors);
      message.error("添加会议记录失败！");
    }
  };

  const handleChange = (uuid: string, content: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.uuid === uuid ? { ...n, content } : n))
    );
    if (timers.current[uuid]) {
      clearTimeout(timers.current[uuid]);
    }
    setSavingUuids((prev) => (prev.includes(uuid) ? prev : [...prev, uuid]));
    timers.current[uuid] = setTimeout(async () => {
      const result = await updateNoteMutation({ variables: { uuid, content } });
      const updated = result.data?.update_note_by_pk;
      if (updated) {
        setNotes((prev) =>
          prev.map((n) =>
            n.uuid === uuid ? { ...n, updated_at: updated.updated_at } : n
          )
        );
      }
      setSavingUuids((prev) => prev.filter((id) => id !== uuid));
    }, 800);
  };

  const handleDelete = async (uuid: string) => {
    if (timers.current[uuid]) {
      clearTimeout(timers.current[uuid]);
    }
    setNotes((prev) => prev.filter((n) => n.uuid !== uuid));
    const result = await deleteNoteMutation({ variables: { uuid } });
    if (result.errors) {
      console.error(result.errors);
      message.error("删除会议记录失败！");
    }
  };

  const Close = () => (
    <Button
      type="link"
      style={{
        width: "40px",
        height: "40px",
        fontSize: "12px",
        position: "absolute",
        right: 0,
        top: 0,
      }}
      className="need-interaction"
      onClick={handleClose}
    >
      ❌
    </Button>
  );

  if (!room) {
    return null;
  }
  return (
    <Card style={{ width: "320px", height: "500px" }}>
      <Close />
      <Container style={{ margin: "6px" }}>
        <Text>
          <strong>{room.name}</strong>
        </Text>
        <Text size="small" style={{ marginTop: "6px", marginBottom: "6px" }}>
          会议记录
        </Text>
      </Container>
      <Scroll>
        {loading ? (
          <Container style={{ height: "100%" }}>
            <Spin size="large" />
          </Container>
        ) : (
          notes.map((note) => (
            <NoteCard
              key={note.uuid}
              note={note}
              saving={savingUuids.includes(note.uuid)}
              onChange={handleChange}
              onDelete={handleDelete}
            />
          ))
        )}
      </Scroll>
      <div
        className="need-interaction"
        style={{ marginTop: "12px", width: "100%" }}
      >
        <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAdd}>
          添加记录
        </Button>
      </div>
    </Card>
  );
};

interface NoteCardProps {
  note: NoteData;
  saving: boolean;
  onChange: (uuid: string, content: string) => void;
  onDelete: (uuid: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({
  note,
  saving,
  onChange,
  onDelete,
}) => {
  const formatDate = (value: any) => {
    const dateUTC = new Date(value);
    const date = new Date(
      dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
    );
    return date.toLocaleString("zh-CN", {
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <Bubble style={{ backgroundColor: "rgba(255, 255, 255, 0.25)" }}>
      <Input.TextArea
        value={note.content}
        onChange={(e) => onChange(note.uuid, e.target.value)}
        autoSize={{ minRows: 2, maxRows: 10 }}
        placeholder="输入会议记录..."
        style={{ fontSize: "16px" }}
      />
      <div
        style={{
          marginTop: "6px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text size="small" style={{ flex: 1 }}>
          创建于 {formatDate(note.created_at)} · 修改于 {formatDate(note.updated_at)}
        </Text>
        <div style={{ display: "flex", alignItems: "center" }}>
          <Text
            size="small"
            style={{ color: "rgba(0, 0, 0, 0.45)", marginRight: "4px" }}
          >
            {saving ? "保存中…" : "已保存"}
          </Text>
          <Button
            type="link"
            danger
            size="small"
            style={{ width: "24px", height: "24px", padding: 0 }}
            onClick={() => onDelete(note.uuid)}
          >
            <DeleteOutlined />
          </Button>
        </div>
      </div>
    </Bubble>
  );
};

export default Note;
