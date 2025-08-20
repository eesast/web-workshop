import React, { useState, useEffect, useContext } from 'react';
import { 
  Layout, 
  Card, 
  Button, 
  Typography, 
  Row, 
  Col, 
  Input, 
  List, 
  Avatar, 
  Space, 
  Upload, 
  message,
  Tabs,
  Divider,
  Tooltip,
  Badge
} from 'antd';
import { 
  SendOutlined, 
  UploadOutlined, 
  DownloadOutlined, 
  DeleteOutlined,
  ArrowLeftOutlined,
  UserOutlined,
  FileOutlined,
  MessageOutlined
} from '@ant-design/icons';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

const { Header, Content, Sider } = Layout;
const { Title, Text } = Typography;
const { TextArea } = Input;
const { TabPane } = Tabs;

interface Message {
  uuid: string;
  content: string;
  sender: string;
  created_at: string;
  user?: {
    username: string;
  };
}

interface File {
  uuid: string;
  filename: string;
  filesize: number;
  filetype: string;
  uploader: string;
  created_at: string;
}

const MeetingRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 模拟房间信息
  const roomInfo = {
    name: '项目讨论会',
    description: '讨论新项目的开发计划',
    participants: ['张三', '李四', '王五', '赵六']
  };

  // 模拟消息数据
  useEffect(() => {
    const mockMessages: Message[] = [
      {
        uuid: '1',
        content: '大家好！欢迎来到项目讨论会',
        sender: '00000000-0000-0000-0000-000000000000',
        created_at: '2024-01-01T10:00:00Z',
        user: { username: 'admin' }
      },
      {
        uuid: '2',
        content: '今天我们要讨论新项目的开发计划',
        sender: '00000000-0000-0000-0000-000000000001',
        created_at: '2024-01-01T10:01:00Z',
        user: { username: '张三' }
      },
      {
        uuid: '3',
        content: '好的，我已经准备好了',
        sender: '00000000-0000-0000-0000-000000000002',
        created_at: '2024-01-01T10:02:00Z',
        user: { username: '李四' }
      }
    ];
    setMessages(mockMessages);
  }, []);

  // 模拟文件数据
  useEffect(() => {
    const mockFiles: File[] = [
      {
        uuid: '1',
        filename: '项目计划书.pdf',
        filesize: 1024000,
        filetype: 'application/pdf',
        uploader: '00000000-0000-0000-0000-000000000000',
        created_at: '2024-01-01T09:00:00Z'
      },
      {
        uuid: '2',
        filename: '技术文档.docx',
        filesize: 512000,
        filetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploader: '00000000-0000-0000-0000-000000000001',
        created_at: '2024-01-01T09:30:00Z'
      }
    ];
    setFiles(mockFiles);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      uuid: Date.now().toString(),
      content: newMessage,
      sender: user?.uuid || '',
      created_at: new Date().toISOString(),
      user: { username: user?.username || '' }
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const handleFileUpload = (file: any) => {
    const newFile: File = {
      uuid: Date.now().toString(),
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
      uploader: user?.uuid || '',
      created_at: new Date().toISOString()
    };

    setFiles([...files, newFile]);
    message.success(`${file.name} 上传成功`);
    return false; // 阻止默认上传行为
  };

  const handleFileDownload = (file: File) => {
    message.info(`开始下载 ${file.filename}`);
  };

  const handleFileDelete = (file: File) => {
    setFiles(files.filter(f => f.uuid !== file.uuid));
    message.success(`${file.filename} 删除成功`);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (dateString: string): string => {
    return new Date(dateString).toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ 
        background: 'rgba(255, 255, 255, 0.9)', 
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '0 24px'
      }}>
        <div className="flex-between" style={{ height: '100%' }}>
          <div className="flex-center">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/')}
              style={{ marginRight: '16px' }}
            />
            <Title level={4} style={{ margin: 0, color: '#2c3e50' }}>
              {roomInfo.name}
            </Title>
          </div>
          
          <Space>
            <Text type="secondary">
              参与者：{roomInfo.participants.length}人
            </Text>
          </Space>
        </div>
      </Header>

      <Layout>
        <Content style={{ padding: '16px' }}>
          <Tabs defaultActiveKey="chat" style={{ height: '100%' }}>
            <TabPane tab="聊天室" key="chat">
              <Card style={{ height: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
                  <List
                    dataSource={messages}
                    renderItem={(message) => (
                      <List.Item style={{ border: 'none', padding: '8px 0' }}>
                        <List.Item.Meta
                          avatar={
                            <Avatar icon={<UserOutlined />} />
                          }
                          title={
                            <Space>
                              <Text strong>{message.user?.username}</Text>
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {formatTime(message.created_at)}
                              </Text>
                            </Space>
                          }
                          description={
                            <div style={{ 
                              background: '#f5f5f5', 
                              padding: '8px 12px', 
                              borderRadius: '8px',
                              marginTop: '4px'
                            }}>
                              {message.content}
                            </div>
                          }
                        />
                      </List.Item>
                    )}
                  />
                </div>
                
                <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
                  <Space.Compact style={{ width: '100%' }}>
                    <TextArea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="输入消息..."
                      autoSize={{ minRows: 1, maxRows: 3 }}
                      onPressEnter={(e) => {
                        if (!e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button 
                      type="primary" 
                      icon={<SendOutlined />}
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                    >
                      发送
                    </Button>
                  </Space.Compact>
                </div>
              </Card>
            </TabPane>

            <TabPane tab="文件共享" key="files">
              <Card>
                <div style={{ marginBottom: '16px' }}>
                  <Upload
                    beforeUpload={handleFileUpload}
                    showUploadList={false}
                    accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.gif"
                  >
                    <Button icon={<UploadOutlined />} type="primary">
                      上传文件
                    </Button>
                  </Upload>
                </div>

                <List
                  dataSource={files}
                  renderItem={(file) => (
                    <List.Item
                      actions={[
                        <Tooltip title="下载">
                          <Button 
                            type="text" 
                            icon={<DownloadOutlined />}
                            onClick={() => handleFileDownload(file)}
                          />
                        </Tooltip>,
                        <Tooltip title="删除">
                          <Button 
                            type="text" 
                            icon={<DeleteOutlined />}
                            danger
                            onClick={() => handleFileDelete(file)}
                          />
                        </Tooltip>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileOutlined style={{ fontSize: '24px', color: '#1890ff' }} />}
                        title={file.filename}
                        description={
                          <Space>
                            <Text type="secondary">{formatFileSize(file.filesize)}</Text>
                            <Text type="secondary">{file.filetype}</Text>
                            <Text type="secondary">{formatTime(file.created_at)}</Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </TabPane>
          </Tabs>
        </Content>

        <Sider width={250} style={{ background: 'rgba(255, 255, 255, 0.9)' }}>
          <Card title="参与者" size="small" style={{ margin: '16px' }}>
            <List
              size="small"
              dataSource={roomInfo.participants}
              renderItem={(participant) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={participant}
                  />
                </List.Item>
              )}
            />
          </Card>

          <Card title="会议信息" size="small" style={{ margin: '16px' }}>
            <div>
              <Text strong>会议名称：</Text>
              <br />
              <Text>{roomInfo.name}</Text>
              <br /><br />
              <Text strong>会议描述：</Text>
              <br />
              <Text>{roomInfo.description}</Text>
            </div>
          </Card>
        </Sider>
      </Layout>
    </Layout>
  );
};

export default MeetingRoom;
