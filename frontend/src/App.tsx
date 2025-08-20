import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Layout, message } from 'antd';
import LoginPage from './components/LoginPage';
import MainPanel from './components/MainPanel';
import MeetingRoom from './components/MeetingRoom';
import './App.css';

const { Content } = Layout;

interface User {
  uuid: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  login: (user: User, token: string) => void;
  logout: () => void;
  token: string | null;
}

export const AuthContext = React.createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  token: null,
});

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 从localStorage恢复用户会话
    const savedUser = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      } catch (error) {
        console.error('Failed to parse saved user data:', error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
      }
    }
    
    setLoading(false);
  }, []);

  const login = (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', userToken);
    message.success('登录成功！');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    message.info('已退出登录');
  };

  if (loading) {
    return (
      <div className="app-container">
        <div className="main-content">
          <div className="card-container">
            <div className="flex-center">
              <div>加载中...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, token }}>
      <div className="app-container">
        <Layout>
          <Content>
            <Routes>
              <Route 
                path="/login" 
                element={user ? <Navigate to="/" replace /> : <LoginPage />} 
              />
              <Route 
                path="/meeting/:roomId" 
                element={user ? <MeetingRoom /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="/" 
                element={user ? <MainPanel /> : <Navigate to="/login" replace />} 
              />
              <Route 
                path="*" 
                element={<Navigate to="/" replace />} 
              />
            </Routes>
          </Content>
        </Layout>
      </div>
    </AuthContext.Provider>
  );
};

export default App;
