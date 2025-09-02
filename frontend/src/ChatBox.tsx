import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { useMutation } from "@apollo/client";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { AddReplyMessageDocument } from "./graphql";
import { Bubble, Card, Container, Scroll, Text } from "./Components";

interface ChatBoxProps {
  user: user | null;
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({ user, room, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [replyingTo, setReplyingTo] = useState<any>(null);

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
  const [addReplyMessageMutation] = useMutation(AddReplyMessageDocument);

  const handleSend = async () => {
    setLoading(true);
    if (!text) {
      message.error("消息不能为空！");
      return setLoading(false);
    }

    try {
      let result;
      if (replyingTo) {
        // 发送回复消息
        result = await addReplyMessageMutation({
          variables: {
            user_uuid: user?.uuid!,
            room_uuid: room?.uuid!,
            content: text,
            reply_to_uuid: replyingTo.uuid,
          },
        });
      } else {
        // 发送普通消息
        result = await addMessageMutation({
          variables: {
            user_uuid: user?.uuid,
            room_uuid: room?.uuid,
            content: text,
          },
        });
      }

      if (result.errors) {
        console.error(result.errors);
        message.error("发送消息失败！");
      } else {
        // 发送成功后重置回复状态
        setReplyingTo(null);
      }
      setText("");
    } catch (error) {
      console.error(error);
      message.error("发送消息失败！");
    }
    setLoading(false);
  };

  const handleReply = (message: any) => {
    setReplyingTo(message);
    // 自动聚焦到输入框
    setTimeout(() => {
      const input = document.querySelector('input[placeholder="输入消息"]') as HTMLInputElement;
      if (input) {
        input.focus();
        setText(`回复 ${message.user.username}: `);
      }
    }, 0);
  };

  const cancelReply = () => {
    setReplyingTo(null);
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

        {/* 显示当前回复状态 */}
        {replyingTo && (
          <div style={{
            padding: "4px 8px",
            backgroundColor: "rgba(0,0,0,0.05)",
            borderRadius: "4px",
            marginBottom: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
            <Text size="small">
              回复: {replyingTo.user.username}: {replyingTo.content}
            </Text>
            <Button
              type="link"
              size="small"
              onClick={cancelReply}
              style={{ padding: 0, height: "auto" }}
            >
              取消
            </Button>
          </div>
        )}
      </Container>

      <MessageFeed
        user={user}
        messages={data?.message}
        onReply={handleReply}
      />

      <div
        className="need-interaction"
        style={{
          marginTop: "12px",
          display: "flex",
          width: "100%",
        }}
      >
        <Input
          placeholder={replyingTo ? `回复 ${replyingTo.user.username}...` : "输入消息"}
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{ fontSize: "18px", height: "40px" }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleSend();
            }
          }}
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
  onReply: (message: any) => void;
}

const MessageFeed: React.FC<MessageFeedProps> = ({ user, messages, onReply }) => {
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
            <MessageBubble
              user={user}
              message={message}
              onReply={onReply}
            />
          </div>
        ))
      ) : (
        <Container style={{ height: "100%" }}>
          <Spin size="large" />
        </Container>
      )
      }
    </Scroll>
  );
};

interface MessageBubbleProps {
  user: user;
  message: graphql.GetMessagesByRoomSubscription["message"][0];
  onReply: (message: any) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ user, message, onReply }) => {
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
        position: "relative",
      }}
    >
      {/* 显示被回复的消息（如果有） */}
      {message.reply_to && (
        <div style={{
          fontSize: "12px",
          color: "#666",
          marginBottom: "4px",
          padding: "4px 8px",
          backgroundColor: "rgba(0,0,0,0.05)",
          borderRadius: "4px",
          maxWidth: "80%",
        }}>
          回复: {message.reply_to.user.username}: {message.reply_to.content}
        </div>
      )}

      <div style={{ marginLeft: "12px", marginRight: "12px", display: "flex", alignItems: "center" }}>
        <Text size="small">{message.user.username}</Text>
        <Text size="small" style={{ marginLeft: "6px" }}>
          {date.toLocaleString("zh-CN")}
        </Text>
        {/* 回复按钮 - 现在所有消息都显示回复按钮 */}
        <Button
          type="link"
          size="small"
          onClick={() => onReply(message)}
          style={{
            marginLeft: "8px",
            padding: "0 4px",
            fontSize: "12px",
            height: "auto"
          }}
        >
          回复
        </Button>
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
