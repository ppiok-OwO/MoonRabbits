import dotenv from 'dotenv';

dotenv.config();

export const PORT = process.env.PORT || 5554;

export const HOST = process.env.HOST || 'localhost';
export const CLIENT_VERSION = process.env.CLIENT_VERSION || '1.0.0';

// DB
export const DB1_NAME = process.env.DB1_NAME || 'database1';
export const DB1_USER = process.env.DB1_USER || 'user1';
export const DB1_PASSWORD = process.env.DB1_PASSWORD || 'password1';
export const DB1_HOST = process.env.DB1_HOST || 'localhost';
export const DB1_PORT = process.env.DB1_PORT || 3306;

// JWT
export const TOKEN_SECRET_KEY = process.env.TOKEN_SECRET_KEY || 'custom_secret_key';
