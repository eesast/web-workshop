// frontend/src/ActionPasswordPage.tsx
import { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom"; // 新增 useSearchParams
import { message } from "antd";
import {
  LoginFormPage,
  ProFormText,
} from "@ant-design/pro-components";
import { LockOutlined } from "@ant-design/icons";
import axios, { AxiosError } from "axios";
import md5 from "md5";

const ActionPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [token, setToken] = useState<string | null>(null);

  const [searchParams] = useSearchParams();

  useEffect(() => {
    // 直接从 searchParams 中获取 token
    const urlToken = searchParams.get("token");

    if (urlToken) {
      setToken(urlToken);
    } else {
      message.error("无效的密码重置链接！");
    }
  }, [searchParams]);

  const onFinish = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("两次输入的密码不一致！");
      return;
    }
    if (!token) {
      message.error("缺少重置令牌！");
      return;
    }
    try {
      const response = await axios.post("/user/change-password/action", {
        token,
        newPassword: values.newPassword,
      });
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
      title="重置密码"
      subTitle="请输入您的新密码"
      onFinish={onFinish}
    >
      <ProFormText.Password
        name="newPassword"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined />,
        }}
        placeholder="新密码"
        rules={[{ required: true, message: "请输入新密码！" }]}
        allowClear
      />
      <ProFormText.Password
        name="confirmPassword"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined />,
        }}
        placeholder="确认新密码"
        rules={[{ required: true, message: "请再次输入新密码！" }]}
        allowClear
      />
    </LoginFormPage>
  );
};

export default ActionPasswordPage;
