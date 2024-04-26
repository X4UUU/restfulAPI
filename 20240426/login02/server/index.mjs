import express from "express";
import multer from "multer";
import moment from "moment";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import users from "./users.mjs";
// console.log(users);

dotenv.config();
const secretKey = process.env.SECRET_KEY_LOGIN;
const upload = multer();
const whiteList = ["http://localhost:5500", "http://127.0.0.1:5500"];
const corsOptions = {
    credentials: true,
    origin(origin, callback) {
        //
        if (!origin || whiteList.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("不允許傳遞資料"))
        }
    }
}
const app = express();
app.use(cors(corsOptions));
app.use(express.json());
// 解析完成放入postman
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.send("網站首頁");
})

app.post("/api/users/login", upload.none(), (req, res) => {
    const { account, password } = req.body;
    let user = users.find(u => u.account === account && u.password === password);
    if (user) {
        const token = jwt.sign({
            account: user.account,
            name: user.name,
            mail: user.mail,
            head: user.head
        }, secretKey, {
            expiresIn: "30m"
        });
        res.status(200).json({
            status: "success",
            token
        })
    } else {
        res.status(400).json({
            status: "fail",
            message: "找不到使用者，帳號或密碼錯誤"
        });
    }
    // res.status(200).json({ message: "使用者登入", account, password });
});

app.post("/api/users/logout", checkToken, (req, res) => {
    console.log(req.decoded);
    let token = jwt.sign({
        account: undefined,
        name: undefined,
        mail: undefined,
        head: undefined
    }, secretKey, {
        // 設置負數讓其即刻失效
        expiresIn: "-10s"
    });
    res.status(200).json({
        status: "success",
        token
    });
    // res.status(200).json({ message: "使用者登出" });
});

app.get("/api/users/status", checkToken, (req, res) => {
    
    const user = users.find(u => u.account === req.decoded.account);
    if (user) {
        const token = jwt.sign({
            account: user.account,
            name: user.name,
            mail: user.mail,
            head: user.head
        }, secretKey, {
            expiresIn: "30m"
        });
        res.status(200).json({
            status: "success",
            token
        })
    } else {
        res.status(400).json({
            status: "error",
            message: "找不到使用者，帳號錯誤"
        });
    }
    // res.status(200).json({ message: "檢查使用者登入、登出狀態" });
});

app.listen(3000, () => {
    console.log("running at http://localhost:3000");
})

function checkToken(req, res, next) {
    let token = req.get("Authorization");
    if (token && token.startsWith("Bearer ")) {
        token = token.slice(7);
        jwt.verify(token, secretKey, (err, decoded) => {
            if (err) {
                return res.status(401).json({
                    status: "error",
                    message: "登入驗證失效，請重新登入"
                })
            }
            req.decoded = decoded;
            next();
        })
    } else {
        return res.status(401).json({
            status: "error",
            message: "無登入驗證資料，請重新登入"
        })
    }
}