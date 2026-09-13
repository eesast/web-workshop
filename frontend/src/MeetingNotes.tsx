import { gql, useMutation, useQuery } from "@apollo/client";
import { Button, Input, message, Spin } from "antd";
import { useEffect, useState } from "react";
import { user } from "./getUser";
import { Card, Container, Text } from "./Components";

const GET_MEETING_NOTE = gql`
  query getMeetingNote($user_uuid: uuid!, $room_uuid: uuid!) {
    note(where: { user_uuid: { _eq: $user_uuid }, room_uuid: { _eq: $room_uuid } }) {
      uuid
      content
      created_at
      updated_at
    }
  }
`;

const UPSERT_MEETING_NOTE = gql`
  mutation upsertMeetingNote($user_uuid: uuid!, $room_uuid: uuid!, $content: String!) {
    insert_note_one(
      object: { user_uuid: $user_uuid, room_uuid: $room_uuid, content: $content }
      on_conflict: { constraint: note_user_uuid_room_uuid_key, update_columns: [content, updated_at] }
    ) {
      uuid
      content
      updated_at
    }
  }
`;

interface MeetingNoteData {
  note: Array<{ uuid: string; content: string; created_at: string; updated_at: string }>;
}

interface MeetingNotesProps {
  user: user | null;
  room: { uuid: string; name: string } | undefined;
  handleClose: () => void;
}

const MeetingNotes: React.FC<MeetingNotesProps> = ({ user, room, handleClose }) => {
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const { data, loading, error } = useQuery<MeetingNoteData>(GET_MEETING_NOTE, {
    skip: !user || !room,
    variables: { user_uuid: user?.uuid, room_uuid: room?.uuid },
  });
  const [upsertNote] = useMutation(UPSERT_MEETING_NOTE);

  useEffect(() => {
    setContent(data?.note[0]?.content ?? "");
  }, [data]);

  if (!user || !room) return null;

  const save = async () => {
    setSaving(true);
    try {
      await upsertNote({
        variables: { user_uuid: user.uuid, room_uuid: room.uuid, content },
        refetchQueries: [{ query: GET_MEETING_NOTE, variables: { user_uuid: user.uuid, room_uuid: room.uuid } }],
      });
      message.success("便签已保存");
    } catch (saveError) {
      console.error(saveError);
      message.error("便签保存失败，请检查数据库连接");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card style={{ width: "320px", height: "360px" }}>
      <Button type="link" onClick={handleClose} style={{ position: "absolute", right: 0, top: 0 }}>
        ❌
      </Button>
      <Container style={{ margin: "6px" }}>
        <Text><strong>{room.name} · 我的便签</strong></Text>
        <Text size="small" style={{ display: "block", marginTop: "6px" }}>
          便签只属于当前用户，其他会议成员不可见。
        </Text>
      </Container>
      {loading ? <Spin /> : error ? <Text>读取便签失败，请检查数据库配置。</Text> : (
        <>
          <Input.TextArea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="记录本次会议的待办事项……"
            autoSize={{ minRows: 8, maxRows: 10 }}
            maxLength={2000}
            showCount
          />
          <Button type="primary" loading={saving} onClick={save} style={{ marginTop: "12px" }}>
            保存便签
          </Button>
        </>
      )}
    </Card>
  );
};

export default MeetingNotes;
