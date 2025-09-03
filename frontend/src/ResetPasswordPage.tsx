import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { message, Typography, Alert } from "antd";
import {
  LoginFormPage,
  ProFormText,
} from "@ant-design/pro-components";
import { LockOutlined, ArrowLeftOutlined, KeyOutlined, AlignLeftOutlined } from "@ant-design/icons";
import axios from "axios";

const { Link } = Typography;

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    if (values.newPassword !== values.confirmPassword) {
      message.error("两次输入的密码不一致");
      return;
    }

    setLoading(true);
    try {
      await axios.post("/user/change-password/action", {
        token: values.token,
        newPassword: values.newPassword,
      });
      message.success("密码重置成功，请使用新密码登录");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
        if (error.response?.status === 400) {
            message.error("验证码无效或已过期");
        } else {
            message.error("密码重置失败，请稍后重试");
        }
        console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <LoginFormPage
      style={{ height: "100vh" }}
      backgroundVideoUrl="https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr"
      logo="https://eesast.com/android-chrome-192x192.png"
      title="重置密码"
      subTitle="请输入您的新密码"
      submitter={{ 
        searchConfig: { submitText: "重置密码" },
        submitButtonProps: { loading }
      }}
      onFinish={handleSubmit}
    >
      <Alert
        message="密码重置"
        description="请设置您的新密码，确保密码强度足够"
        type="info"
        showIcon
        style={{ marginBottom: 24 }}
      />
      
      <ProFormText
        name="token"
        fieldProps={{
            size: "large",
            prefix: <KeyOutlined />,
        }}
        placeholder="token: "
        rules={[{ required: true, message: "请输入token！" }]}
        allowClear
        />

      <ProFormText.Password
        name="newPassword"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined />,
        }}
        placeholder="新密码"
        rules={[
          { required: true, message: "请输入新密码！" },
          { min: 3, message: "密码长度至少为3个字符！" },
        ]}
        allowClear
      />
      
      <ProFormText.Password
        name="confirmPassword"
        fieldProps={{
          size: "large",
          prefix: <LockOutlined />,
        }}
        placeholder="确认新密码"
        rules={[
          { required: true, message: "请确认新密码！" },
          { min: 3, message: "密码长度至少为3个字符！" },
        ]}
        allowClear
      />
      
      <div style={{ marginBlockEnd: 24, textAlign: "center"}}>
        <Link onClick={() => navigate("/user/change-password/request")}>
            <AlignLeftOutlined /> 重新发送重置邮件
        </Link>
      </div>
      <div style={{ marginBlockEnd: 24, textAlign: "center" }}>
        <Link onClick={() => navigate("/login")}>
          <ArrowLeftOutlined /> 返回登录
        </Link>
      </div>
    </LoginFormPage>
  );
};

export default ResetPasswordPage;