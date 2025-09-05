// frontend/src/RequestPasswordPage.tsx
import { useNavigate } from "react-router-dom";
import { message, Typography } from "antd";
import {
  LoginFormPage,
  ProFormText,
} from "@ant-design/pro-components";
import { UserOutlined } from "@ant-design/icons";
import axios, { AxiosError } from "axios";

const { Link } = Typography;

const RequestPasswordPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSumbit = async (values: any) => {
    try {
      const response = await axios.post("/user/change-password/request", values);
      message.success(response.data.message);
      navigate("/login");
    } catch (error) {
      const err = error as AxiosError;
      message.error((err.response?.data as { error: string })?.error || "密码重置失败！");
    }
  };

  return (
    <LoginFormPage
      style={{ height: "100vh" }}
      title="请求重置密码"
      subTitle="请输入您的用户名（邮箱），我们将发送一个重置链接"
      onFinish={handleSumbit}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: "large",
          prefix: <UserOutlined />,
        }}
        placeholder="用户名"
        rules={[{ required: true, message: "请输入用户名！" }]}
        allowClear
      />
      <div
        style={{
          marginBlockEnd: 24,
        }}
      >
        <Link
          style={{ float: "left" }}
          onClick={() => navigate("/login")}
        >
          返回登录
        </Link>
      </div>
    </LoginFormPage>
  );
};

export default RequestPasswordPage;
