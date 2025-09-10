import React, { useState, useContext } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Modal, 
  Form, 
  Input, 
  message,
  Avatar,
  Space,
  Divider,
  Tooltip
} from 'antd';
import { 
  PlusOutlined, 
  TeamOutlined, 
  MessageOutlined, 
  FileOutlined,
  LogoutOutlined,
  UserOutlined,
  SettingOutlined,
  QuestionOutlined ,
  ClockCircleOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import Dice from './Dice';
import Timer from './Timer';

const { Header, Content } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;

interface Room {
  uuid: string;
  name: string;
  description?: string;
  created_at: string;
}

const MainPanel: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [rooms, setRooms] = useState<Room[]>([
    {
      uuid: '10000000-0000-0000-0000-000000000000',
      name: '项目讨论会',
      description: '讨论新项目的开发计划',
      created_at: '2024-01-01T10:00:00Z'
    },
    {
      uuid: '10000000-0000-0000-0000-000000000001',
      name: '技术分享会',
      description: '分享最新的技术趋势',
      created_at: '2024-01-02T14:00:00Z'
    },
    {
      uuid: '10000000-0000-0000-0000-000000000002',
      name: '团队建设',
      description: '增进团队凝聚力',
      created_at: '2024-01-03T16:00:00Z'
    }
  ]);

  const handleLogout = () => {
    logout();
  };

  const handleCreateRoom = async (values: any) => {
    setCreateLoading(true);
    try {
      // 模拟创建房间
      const newRoom: Room = {
        uuid: `room-${Date.now()}`,
        name: values.name,
        description: values.description,
        created_at: new Date().toISOString()
      };
      
      setRooms([newRoom, ...rooms]);
      setIsCreateModalVisible(false);
      message.success('房间创建成功！');
    } catch (error) {
      message.error('创建房间失败，请稍后重试');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleJoinRoom = (roomId: string) => {
    navigate(`/meeting/${roomId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout className="app-container">
      <Header style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '0 24px'
      }}>
        <div className="flex-between" style={{ height: '100%' }}>
          <div className="flex-center">
            <TeamOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: '12px' }} />
            <Title level={3} style={{ margin: 0, color: '#2c3e50' }}>
              趣味会议软件
            </Title>
          </div>
          
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text strong>{user?.username}</Text>
            <Tooltip title="设置">
              <Button type="text" icon={<SettingOutlined />} />
            </Tooltip>
            <Tooltip title="退出登录">
              <Button type="text" icon={<LogoutOutlined />} onClick={handleLogout} />
            </Tooltip>
          </Space>
        </div>
      </Header>

      <Content style={{ padding: '24px' }}>
        <div className="main-content">
          {/* 欢迎卡片 */}
          <Card className="card-container fade-in">
            <div className="text-center">
              <Title level={2} style={{ color: '#2c3e50', marginBottom: '8px' }}>
                欢迎回来，{user?.username}！
              </Title>
              <Text type="secondary" style={{ fontSize: '16px' }}>
                开始您的会议之旅吧
              </Text>
            </div>
          </Card>

          {/* 快速工具 */}
          <Card className="card-container fade-in" title="快速工具">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" hoverable>
                  <div className="text-center">
                    <QuestionOutlined  style={{ fontSize: '32px', color: '#1890ff', marginBottom: '8px' }} />
                    <div><Text strong>骰子工具</Text></div>
                    <Dice />
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" hoverable>
                  <div className="text-center">
                    <ClockCircleOutlined style={{ fontSize: '32px', color: '#52c41a', marginBottom: '8px' }} />
                    <div><Text strong>计时器</Text></div>
                    <Timer />
                  </div>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Card size="small" hoverable>
                  <div className="text-center">
                    <MessageOutlined style={{ fontSize: '32px', color: '#722ed1', marginBottom: '8px' }} />
                    <div><Text strong>随机点名</Text></div>
                    <Button type="primary" size="small">开始点名</Button>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>

          {/* 会议房间 */}
          <Card 
            className="card-container fade-in" 
            title="我的会议"
            extra={
              <Button 
                type="primary" 
                icon={<PlusOutlined />}
                onClick={() => setIsCreateModalVisible(true)}
              >
                创建会议
              </Button>
            }
          >
            <Row gutter={[16, 16]}>
              {rooms.map(room => (
                <Col xs={24} sm={12} lg={8} key={room.uuid}>
                  <Card 
                    hoverable 
                    actions={[
                      <Button 
                        type="primary" 
                        onClick={() => handleJoinRoom(room.uuid)}
                      >
                        加入会议
                      </Button>
                    ]}
                  >
                    <Card.Meta
                      title={room.name}
                      description={
                        <div>
                          <Text type="secondary">{room.description}</Text>
                          <br />
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            创建时间：{formatDate(room.created_at)}
                          </Text>
                        </div>
                      }
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </div>
      </Content>

      {/* 创建会议模态框 */}
      <Modal
        title="创建新会议"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        destroyOnClose
      >
        <Form
          layout="vertical"
          onFinish={handleCreateRoom}
        >
          <Form.Item
            name="name"
            label="会议名称"
            rules={[{ required: true, message: '请输入会议名称！' }]}
          >
            <Input placeholder="请输入会议名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="会议描述"
          >
            <TextArea 
              placeholder="请输入会议描述（可选）" 
              rows={3}
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={createLoading}
              block
            >
              创建会议
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Layout>
  );
};

export default MainPanel;
