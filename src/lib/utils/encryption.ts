// src/lib/utils/encryption.ts
import CryptoJS from 'crypto-js';

// 客户端和服务端共用的加密密钥
// 注意：这个密钥用于本地存储加密，不是高安全场景
const CLIENT_ENCRYPTION_KEY = 'client-secret';

export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, CLIENT_ENCRYPTION_KEY).toString();
}

export function decrypt(ciphertext: string): string {
  if (!ciphertext) return '';
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, CLIENT_ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return '';
  }
}