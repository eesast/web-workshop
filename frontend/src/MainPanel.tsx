import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Form, Input, List, message, Modal } from "antd";
import {
  UserOutlined,
  LoginOutlined,
  LogoutOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import * as graphql from "./graphql";
import { Bubble, Card, Link, Scroll, Text } from "./Components";
import { user } from "./getUser";

interface MainPanelProps {
  user: user | null;
  rooms: graphql.GetJoinedRoomsQuery["user_room"] | undefined;
  refetchRooms: () => void;
  addChatBox: (id: number) => void;
  addFileShare: (id: number) => void;
}

const MainPanel: React.FC<MainPanelProps> = (props) => {
  return (
    <Card style={{ width: "300px", height: "fit-content" }}>
      <User {...props} />
      {props.rooms && <JoinRoom {...props} />}
      {props.rooms && <RoomList {...props} />}
    </Card>
  );
};

const User: React.FC<MainPanelProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (user) {
      localStorage.removeItem("token");
      navigate(0);
    } else {
      navigate("/login");
    }
  };

  return (
    <Bubble
      style={{
        width: "276px",
        height: "48px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Text size="title">
        <UserOutlined />
      </Text>
      <Text
        size="title"
        style={{
          height: "42px",
          lineHeight: 1,
          marginLeft: "12px",
          overflow: "hidden",
        }}
      >
        {user ? user.username : "未登录"}
      </Text>
      <Button
        style={{
          width: "36px",
          height: "36px",
          fontSize: "36px",
          marginLeft: "12px",
        }}
        onClick={handleClick}
        type="link"
        danger={user ? true : false}
      >
        {user ? <LogoutOutlined /> : <LoginOutlined />}
      </Button>
    </Bubble>
  );
};

const JoinRoom: React.FC<MainPanelProps> = ({ user, rooms, refetchRooms }) => {
  const [inviteCode, setInviteCode] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const { refetch } = graphql.useGetRoomByInviteCodeQuery({
    skip: inviteCode.length !== 6,
  });
  const [joinRoomMutation] = graphql.useJoinRoomMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Remove all non-digit and non-letter characters
    setInviteCode(value.replace(/[^a-zA-Z0-9]/g, ""));
  };

  const handleJoin = async () => {
    setLoading(true);
    if (inviteCode.length !== 6) {
      message.error("邀请码长度错误！");
      return setLoading(false);
    }
    if (rooms?.find((r) => r.room.invite_code === inviteCode)) {
      message.error("已加入该房间！");
      return setLoading(false);
    }
    const queryResult = await refetch({
      invite_code: inviteCode,
    });
    if (queryResult.errors) {
      console.error(queryResult.errors);
      message.error("获取房间失败！");
      return setLoading(false);
    }
    if (queryResult.data?.room.length === 0) {
      message.error("房间不存在！");
      return setLoading(false);
    }
    const room = queryResult.data?.room[0];
    const result = await joinRoomMutation({
      variables: {
        room_uuid: room?.uuid,
        user_uuid: user!.uuid,
      },
    });
    if (result.errors) {
      console.error(result.errors);
      message.error("加入房间失败！");
    } else {
      message.success("加入房间成功！");
      refetchRooms();
    }
    setInviteCode("");
    setLoading(false);
  };

  return (
    <Bubble
      style={{
        width: "276px",
        height: "48px",
        display: "flex",
        alignItems: "center",
      }}
    >
      <Input
        variant="filled"
        style={{
          width: "150px",
          height: "40px",
          fontSize: "24px",
          fontFamily: "monospace",
          marginLeft: "6px",
        }}
        placeholder="输入邀请码"
        maxLength={6}
        value={inviteCode}
        onChange={handleChange}
      />
      <Button
        type="primary"
        style={{
          height: "40px",
          fontSize: "18px",
          marginLeft: "12px",
          marginRight: "4px",
        }}
        onClick={handleJoin}
        loading={loading}
      >
        <strong>加入会议</strong>
      </Button>
    </Bubble>
  );
};

const RoomList: React.FC<MainPanelProps> = ({
  user,
  rooms,
  refetchRooms,
  addChatBox,
  addFileShare,
}) => {
  const [open, setOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const [addRoomMutation] = graphql.useAddRoomMutation();
  const [joinRoomMutation] = graphql.useJoinRoomMutation();

  const handleCreateRoom = async (values: any) => {
    setLoading(true);
    const result1 = await addRoomMutation({
      variables: {
        name: values.name,
        intro: values.intro,
        invite_code: Math.random().toString(36).slice(2, 8).toUpperCase(),
      },
    });
    if (result1.errors) {
      console.error(result1.errors);
      message.error("创建房间失败！");
    } else {
      const result2 = await joinRoomMutation({
        variables: {
          room_uuid: result1.data?.insert_room_one?.uuid,
          user_uuid: user!.uuid,
        },
      });
      if (result2.errors) {
        console.error(result2.errors);
        message.error("加入房间失败！");
      } else {
        message.success("创建并加入房间成功！");
      }
    }
    setLoading(false);
    setOpen(false);
    refetchRooms();
  };

  return (
    <Bubble
      style={{
        width: "276px",
        height: "300px",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Button
        type="primary"
        style={{ height: "40px", fontSize: "18px", margin: "4px 4px 12px 6px" }}
        icon={<PlusOutlined />}
        onClick={() => setOpen(true)}
      >
        <strong>创建新的会议</strong>
      </Button>
      <Scroll>
        <List
          size="small"
          itemLayout="vertical"
          dataSource={rooms}
          renderItem={(item, index) => (
            <RoomListItem
              room={item.room}
              handleOpenChat={() => addChatBox(index)}
              handleOpenFileShare={() => addFileShare(index)}
            />
          )}
        />
      </Scroll>
      <Modal
        title="创建新的会议"
        open={open}
        okText="创建"
        okButtonProps={{ autoFocus: true, htmlType: "submit" }}
        confirmLoading={loading}
        onCancel={() => setOpen(false)}
        cancelText="取消"
        destroyOnClose
        modalRender={(children) => (
          <Form onFinish={handleCreateRoom} clearOnDestroy>
            {children}
          </Form>
        )}
      >
        <Form.Item
          style={{ marginTop: "24px" }}
          label="会议名称"
          name="name"
          rules={[{ required: true, message: "请输入会议名称！" }]}
        >
          <Input placeholder="输入会议名称" />
        </Form.Item>
        <Form.Item label="会议简介" name="intro">
          <Input placeholder="输入会议简介" />
        </Form.Item>
      </Modal>
    </Bubble>
  );
};

interface RoomListItemProps {
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"];
  handleOpenChat: () => void;
  handleOpenFileShare: () => void;
}

const RoomListItem: React.FC<RoomListItemProps> = ({
  room,
  handleOpenChat,
  handleOpenFileShare,
}) => {
  const dateUTC = new Date(room.created_at);
  const date = new Date(
    dateUTC.getTime() - dateUTC.getTimezoneOffset() * 60000
  );

  const handleQuit = () => {
    message.info("暂未实现");
  };

  return (
    <List.Item style={{ padding: "8px" }}>
      <div>
        <Text>
          <strong>{room.name}</strong>
        </Text>
        <br />
        <Text size="small" editable>
          {room.intro}
        </Text>
        <br />
        <Text size="small">
          创建于{" "}
          {date.toLocaleString("zh-CN", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </Text>
        <Text
          size="small"
          style={{ marginLeft: "12px" }}
          copyable={{ text: room.invite_code }}
        >
          邀请码 {room.invite_code}
        </Text>
        <br />
        <Link style={{ marginTop: "6px" }} onClick={handleOpenChat}>
          打开聊天室
        </Link>
        <Link style={{ marginLeft: "12px" }} onClick={handleOpenFileShare}>
          打开文件共享空间
        </Link>
        <Link danger style={{ marginLeft: "12px" }} onClick={handleQuit}>
          退出会议
        </Link>
      </div>
    </List.Item>
  );
};

export default MainPanel;
