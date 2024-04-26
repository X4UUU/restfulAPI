import jwt from 'jsonwebtoken';
import { secretKey } from './config.mjs';


// import dotenv from 'dotenv';
// dotenv.config();
// const secretKey = process.env.SECRET_KEY_RESTFUL;

// const secretKey = 'testKey';
// const secretKey = process.argv[2]

let token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiJzdHVkZW50IiwiaWF0IjoxNzE0MDk2MTMyfQ.RiP0-hASJZH5rFabSI7I5m2lJazUV8EaEqfECLdI6bc';
jwt.verify(token, secretKey, (err, data) => {
    if (err) {
        console.log('驗證失敗');
        return false;
    }
    console.log('驗證成功');
    console.log(data);
});