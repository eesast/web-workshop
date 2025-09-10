import { useEffect, useRef, useState } from "react";
import { Button, Input, message, Spin } from "antd";
import { user } from "./getUser";
import * as graphql from "./graphql";
import { Bubble, Card, Container, Scroll, Text } from "./Components";

interface ReplyBoxProps {
  user: user | null;
  msg: graphql.GetMessageByUuidSubscription["message_by_pk"] | undefined;
  handleClose: () => void;
}

const ReplyBox: React.FC<ReplyBoxProps> = ({ user, msg, handleClose }) => {
  const [text, setText] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { data, error } = graphql.useGetReplyByMessageSubscription({
    skip: !msg,
    variables: {
      msg_uuid: msg?.uuid,
    },
  });
  useEffect(() => {
    if (error) {
      console.error(error);
      message.error("获取消息失败！");
    }
  }, [error]);

  const [addReplyMutation] = graphql.useAddReplyMutation();

  const handleSend = async () => {
    setLoading(true);
    if (!text) {
      message.error("回复不能为空！");
      return setLoading(false);
    }
    const result = await addReplyMutation({
      variables: {
        user_uuid: user?.uuid,
        msg_uuid: msg?.uuid,
        content: text,
      },
    });
    if (result.errors) {
      console.error(result.errors);
      message.error("回复发送失败！");
    }
    setText("");
    setLoading(false);
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

  if (!user || !msg) {
    return null;
  }
  return (
    <Card style={{ width: "300px", height: "500px" }}>
      <Close />
      <Container style={{ margin: "6px" }}>
        <Text>
          <strong>回复</strong>
        </Text>
        <Text size="small" style={{ marginTop: "6px", marginBottom: "6px" }}>
            {msg.content}
        </Text>
      </Container>
      <ReplyFeed user={user} replies={data?.reply} />
      <div
        className="need-interaction"
        style={{
          marginTop: "12px",
          display: "flex",
          width: "100%",
        }}
      >
        <Input
          placeholder="输入回复"
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

interface ReplyFeedProps {
  user: user;
  replies: graphql.GetReplyByMessageSubscription["reply"] | undefined;
}

const ReplyFeed: React.FC<ReplyFeedProps> = ({ user, replies }) => {
  const bottomRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [replies]);

  return (
    <Scroll>
      {replies ? (
        replies.map((reply, index) => (
          <div
            ref={index === replies.length - 1 ? bottomRef : null}
            key={index}
          >
            <ReplyBubble user={user} reply={reply} />
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

interface ReplyBubbleProps {
  user: user;
  reply: graphql.GetReplyByMessageSubscription["reply"][0];
}

const ReplyBubble: React.FC<ReplyBubbleProps> = ({ user, reply }) => {
  const isSelf = user.uuid === reply.user?.uuid;
  const dateUTC = new Date(reply.created_at);
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
        <Text size="small">{reply.user?.username}</Text>
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
        <Text style={{ wordBreak: "break-all" }}>{reply.content}</Text>
      </Bubble>
    </div>
  );
};

export default ReplyBox;
