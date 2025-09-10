import React, { useState, useContext } from 'react';
import { Form, Input, Button, Card, Tabs, message, Typography } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { AuthContext } from '../App';
import axios from 'axios';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

interface LoginForm {
  username: string;
  password: string;
}

interface RegisterForm {
  username: string;
  password: string;
  confirmPassword: string;
}

const LoginPage: React.FC = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [registerLoading, setRegisterLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const onLogin = async (values: LoginForm) => {
    setLoginLoading(true);
    try {
      const response = await axios.post('http://localhost:8888/user/login', {
        username: values.username,
        password: values.password
      });

      if (response.data.token) {
        login(response.data.user, response.data.token);
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '登录失败，请检查用户名和密码');
    } finally {
      setLoginLoading(false);
    }
  };

  const onRegister = async (values: RegisterForm) => {
    if (values.password !== values.confirmPassword) {
      message.error('两次输入的密码不一致');
      return;
    }

    setRegisterLoading(true);
    try {
      const response = await axios.post('http://localhost:8888/user/register', {
        username: values.username,
        password: values.password
      });

      if (response.data.token) {
        login(response.data.user, response.data.token);
        message.success('注册成功！');
      }
    } catch (error: any) {
      message.error(error.response?.data?.error || '注册失败，请稍后重试');
    } finally {
      setRegisterLoading(false);
    }
  };

  return (
    <div className="main-content">
      <div className="flex-center">
        <Card 
          className="card-container fade-in" 
          style={{ maxWidth: 400, width: '100%' }}
        >
          <div className="page-header">
            <Title level={2} className="page-title">
              趣味会议软件
            </Title>
            <Text className="page-subtitle">
              欢迎使用在线会议平台
            </Text>
          </div>

          <Tabs defaultActiveKey="login" centered>
            <TabPane tab="登录" key="login">
              <Form
                name="login"
                onFinish={onLogin}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  rules={[{ required: true, message: '请输入用户名！' }]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[{ required: true, message: '请输入密码！' }]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={loginLoading}
                    block
                  >
                    登录
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>

            <TabPane tab="注册" key="register">
              <Form
                name="register"
                onFinish={onRegister}
                autoComplete="off"
                layout="vertical"
              >
                <Form.Item
                  name="username"
                  rules={[
                    { required: true, message: '请输入用户名！' },
                    { min: 3, message: '用户名至少3个字符！' }
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="用户名"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: '请输入密码！' },
                    { min: 6, message: '密码至少6个字符！' }
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item
                  name="confirmPassword"
                  rules={[
                    { required: true, message: '请确认密码！' },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('两次输入的密码不一致！'));
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    prefix={<LockOutlined />}
                    placeholder="确认密码"
                    size="large"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    loading={registerLoading}
                    block
                  >
                    注册
                  </Button>
                </Form.Item>
              </Form>
            </TabPane>
          </Tabs>

          <div className="text-center mt-24">
            <Text type="secondary">
              测试账号：admin / admin123
            </Text>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
