import { useNavigate } from "react-router-dom";
import { Button } from "antd";
import { UserOutlined, LoginOutlined, LogoutOutlined } from "@ant-design/icons";
import { Bubble, Card, Text } from "./Components";
import { user } from "./getUser";

interface MainPanelProps {
  user: user | null;
}

const MainPanel: React.FC<MainPanelProps> = ({ user }) => {
  return (
    <Card style={{ width: "300px", height: "fit-content" }}>
      <User user={user} />
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
          lineHeight: "42px",
          marginLeft: "12px",
          overflow: "hidden",
        }}
      >
        {user ? user.username : "未登录"}
      </Text>
      <Button
        style={{ width: "36px", height: "36px", marginLeft: "12px" }}
        onClick={handleClick}
        type="link"
        danger={user ? true : false}
      >
        <Text size="title">
          {user ? <LogoutOutlined /> : <LoginOutlined />}
        </Text>
      </Button>
    </Bubble>
  );
};

export default MainPanel;
