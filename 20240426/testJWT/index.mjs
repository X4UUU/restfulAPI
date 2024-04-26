import jwt from 'jsonwebtoken';
import { secretKey } from './config.mjs';

// 方法1
// import dotenv from 'dotenv';
// dotenv.config();
// const secretKey = process.env.SECRET_KEY_RESTFUL;
// 方法2
// const secretKey = 'testKey';
// 方法3
// const secretKey = process.argv[2]

// 用sign作簽核，(物件,,其他選項)
const token = jwt.sign({ userID: 'student' }, secretKey);
console.log(token);