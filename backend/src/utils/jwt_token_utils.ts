import jwt from 'jsonwebtoken';


// Token 负载接口定义
export interface ResetTokenPayload {
  userID: string;
  passWord: string;
  purpose: 'password_reset';
  iat?: number; // issued at
  exp?: number; // expiration time
}

// 用户信息接口
export interface User {
  user_id: string;
  password: string;
}

// 生成JWT token
export const generateResetToken = (user: User): string => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  return jwt.sign(
    {
      userID: user.user_id,
      passWord: user.password,
      purpose: 'password_reset' as const
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' } // 1小时有效期
  );
};

// 验证JWT token
export const verifyResetToken = (token: string): ResetTokenPayload => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is not defined');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as ResetTokenPayload;

    // 额外的验证：确保token用途正确
    if (decoded.purpose !== 'password_reset') {
      throw new Error('Invalid token purpose');
    }

    return decoded;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error('无效的token');
    } else if (error instanceof jwt.TokenExpiredError) {
      throw new Error('过期的token');
    } else if (error instanceof Error) {
      throw new Error(`token验证失败: ${error.message}`);
    } else {
      throw new Error('无效或过期的token');
    }
  }
};

// // 密码哈希函数（保持类型安全）
// export const hashPassword = async (password: string): Promise<string> => {
//   return await bcrypt.hash(password, 12);
// };

// // 邮件发送函数（类型安全版本）
// interface EmailOptions {
//   from: string;
//   to: string;
//   subject: string;
//   html: string;
// }

// export const sendResetEmail = async (email: string, token: string): Promise<void> => {
//   if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
//     throw new Error('Email configuration is missing');
//   }

//   const transporter = nodemailer.createTransporter({
//     service: process.env.EMAIL_SERVICE || 'gmail',
//     auth: {
//       user: process.env.EMAIL_USER,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

//   const mailOptions: EmailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: '密码重置请求',
//     html: `
//       <p>您请求重置密码，请点击以下链接：</p>
//       <a href="${resetLink}">重置密码</a>
//       <p>该链接将在1小时后失效</p>
//     `,
//   };

//   await transporter.sendMail(mailOptions);
// };
