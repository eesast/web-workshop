import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Scroll, Text } from "./Components";

interface ChatBoxProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, room, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data, error } = graphql.useGetMessagesByRoomSubscription({
    skip: !room,
    variables: {
      room_uuid: room?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取消息失败！");
    }
  }, [error]);

  const [addMessageMutation] = graphql.useAddMessageMutation();

  const handleSend = async () => {
    setLoading(true);
    if (!text) {
      message.error("消息不能为空！");
      return setLoading(false);
    }
    const result = await addMessageMutation({
      variables: {
        user_uuid: user?.uuid,
        room_uuid: room?.uuid,
        content: text,
      },
    });
    if (result.errors) {
      console.error(result.errors);
      message.error("发送消息失败！");
    }
    setText("");
    setLoading(false);
  };

  const Close = () => (
    <Button
      type="link"
      style={{
        width: "36px",
        height: "36px",
        fontSize: "12px",
        position: "absolute",
        right: 0,
        top: 0,
      }}
      onClick={handleClose}
    >
      ❌
    </Button>
  );

  if (!user || !room) {
    return null;
  }
  return (
    <Card style={{ width: "300px", height: "500px" }}>
      <Close />
      <Container style={{ margin: "6px" }}>
        <Text>
          <strong>{room.name}</strong>
        </Text>
        <Text size="small" style={{ marginTop: "6px", marginBottom: "6px" }}>
          {room.intro}
        </Text>
      </Container>
      <MessageFeed user={user} messages={data?.message} />
      <div
        style={{
          margin: "12px",
          marginBottom: 0,
          display: "flex",
          width: "100%",
        }}
      >
        <Input
          placeholder="输入消息"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: "18px", height: "40px" }}
        />
        <Button
          style={{ height: "40px", fontSize: "18px", marginLeft: "12px" }}
          onClick={handleSend}
          type="primary"
          loading={loading}
        >
          <strong>发送</strong>
        </Button>
      </div>
    </Card>
  );
};

interface MessageFeedProps {
  user: user;
  messages: graphql.GetMessagesByRoomSubscription["message"] | undefined;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ user, messages }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Scroll>
      {messages ? (
        messages.map((message, index) => (
          <div
            ref={index === messages.length - 1 ? bottomRef : null}
            key={index}
          >
            <MessageBubble user={user} message={message} />
          </div>
        ))
      ) : (
        <Container style={{ height: "100%" }}>
          <Spin size="large" />
        </Container>
      )}
    </Scroll>
  );
};

interface MessageBubbleProps {
  user: user;
  message: graphql.GetMessagesByRoomSubscription["message"][0];
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ user, message }) => {
  const isSelf = user.uuid === message.user.uuid;
  const dateUTC = new Date(message.created_at);
  const date = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
  );
  return (
    <div
      style={{
        margin: "6px 0",
        display: "flex",
        flexDirection: "column",
        flexWrap: "nowrap",
        alignItems: isSelf ? "flex-end" : "flex-start",
      }}
    >
      <div style={{ marginLeft: "12px", marginRight: "12px" }}>
        <Text size="small">{message.user.username}</Text>
        <Text size="small" style={{ marginLeft: "6px" }}>
          {date.toLocaleString("zh-CN")}
        </Text>
      </div>
      <Bubble
        style={{
          minHeight: "24px",
          width: "fit-content",
          maxWidth: "80%",
          backgroundColor: isSelf
            ? "rgba(4, 190, 2, 0.25)"
            : "rgba(255, 255, 255, 0.25)",
        }}
      >
        <Text style={{ wordBreak: "break-all" }}>{message.content}</Text>
      </Bubble>
    </div>
  );
};

export default ChatBox;
