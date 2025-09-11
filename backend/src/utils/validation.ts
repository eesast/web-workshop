/**
 * 验证邮箱格式是否合法
 * @param email 待验证的邮箱地址
 * @returns 验证结果和错误信息
 */
export const validateEmail = (email: string): { isValid: boolean; error?: string } => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: '邮箱地址不能为空' };
  }

  // 基本格式验证
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: '邮箱格式不正确' };
  }

  // 长度验证
  if (email.length > 254) {
    return { isValid: false, error: '邮箱地址过长' };
  }

  // 本地部分验证（@前面的部分）
  const [localPart] = email.split('@');
  if (localPart.length > 64) {
    return { isValid: false, error: '邮箱用户名部分过长' };
  }

  // 禁止连续的点号
  if (localPart.includes('..')) {
    return { isValid: false, error: '邮箱格式不正确' };
  }

  // 特殊字符验证（更严格的验证）
  const strictEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  if (!strictEmailRegex.test(email)) {
    return { isValid: false, error: '邮箱包含无效字符' };
  }

  return { isValid: true };
};

/**
 * 验证常见的不合法邮箱域名
 * @param email 待验证的邮箱地址
 * @returns 是否包含不合法域名
 */
export const hasInvalidDomain = (email: string): boolean => {
  const invalidDomains = [
    'example.com',
    'test.com',
    'localhost',
    'invalid.com',
    'example.org'
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return invalidDomains.includes(domain || '');
};
