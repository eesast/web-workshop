import React from "react";
import { useNavigate } from "react-router-dom";
import { message, Typography } from "antd";
import {
  LoginFormPage,
  ProFormText,
} from "@ant-design/pro-components";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import axios from "axios";

const { Link } = Typography;

const RequestResetPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 发送用户名到后端，后端会查找对应的邮箱并发送重置邮件
      await axios.post("/user/change-password/request", {
        username: values.username,
      });
      message.success("重置邮件已发送到您账户关联的邮箱，请查收");
      setTimeout(() => navigate('/user/change-password/action'), 2000);
    } catch (error: any) {
      console.error(error);
      if (error.response?.status === 404) {
        message.error("用户名不存在");
      } else {
        message.error("发送重置邮件失败，请稍后重试");
      }
    }
  };

  return (
    <LoginFormPage
      style={{ height: "100vh" }}
      backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      logo="https://eesast.com/android-chrome-192x192.png"
      title="重置密码"
      subTitle="请输入您的用户名以接收重置链接"
      submitter={{ searchConfig: { submitText: "发送重置邮件" } }}
      onFinish={handleSubmit}
    >
      <ProFormText
        name="username"
        fieldProps={{
          size: "large",
          prefix: <UserOutlined />,
        }}
        placeholder="用户名"
        rules={[
          { required: true, message: "请输入用户名！" },
        ]}
        allowClear
      />
      <div style={{ marginBlockEnd: 24, textAlign: "center" }}>
        <Link onClick={() => navigate("/login")}>
          <ArrowLeftOutlined /> 返回登录
        </Link>
      </div>
    </LoginFormPage>
  );
};

export default RequestResetPage;