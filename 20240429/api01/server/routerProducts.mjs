import express from "express";
import multer from "multer";
import moment from "moment";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import users from "./users.mjs";
import { v4 as uuidv4 } from "uuid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const defaultData = { users: [], products: [] };
const db = new Low(new JSONFile("./db.json"), defaultData);
await db.read();

dotenv.config();
const secretKey = process.env.SECRET_KEY_LOGIN;
const upload = multer();

const whiteList = ["http://localhost:5500", "http://127.0.0.1:5500"];
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || whiteList.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("不允許傳遞料"));
    }
  },
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("網站首頁");
});

app.get("/api/users", (req, res) => {
  res.status(200).json({ message: "獲取所有使用者" });
});

app.post("/api/users", upload.none(), (req, res) => {
  res.status(200).json({ message: "新增一個使用者" });
});

app.post("/api/users/login", upload.none(), (req, res) => {
  const { account, password } = req.body;
  // let user = users.find(u => u.account === account && u.password === password);
  let user = db.data.users.find(
    (u) => u.account === account && u.password === password
  );
  if (user) {
    const token = jwt.sign(
      {
        account: user.account,
        name: user.name,
        mail: user.mail,
        head: user.head,
      },
      secretKey,
      {
        expiresIn: "30m",
      }
    );
    res.status(200).json({
      status: "success",
      token,
    });
  } else {
    res.status(400).json({
      status: "error",
      message: "找不到使用者，帳號或密碼錯誤",
    });
  }
});

app.post("/api/users/logout", checkToken, (req, res) => {
  const token = jwt.sign(
    {
      account: undefined,
      name: undefined,
      mail: undefined,
      head: undefined,
    },
    secretKey,
    {
      expiresIn: "-10s",
    }
  );
  res.status(200).json({
    status: "success",
    token,
  });
});

app.get("/api/users/status", checkToken, (req, res) => {
  // const user = users.find(u => u.account === req.decoded.account);
  const user = db.data.users.find((u) => u.account === req.decoded.account);
  if (user) {
    const token = jwt.sign(
      {
        account: user.account,
        name: user.name,
        mail: user.mail,
        head: user.head,
      },
      secretKey,
      {
        expiresIn: "30m",
      }
    );
    res.status(200).json({
      status: "success",
      token,
    });
  } else {
    res.status(400).json({
      status: "error",
      message: "找不到使用者，帳號錯誤",
    });
  }
});

app.get("/api/products", (req, res) => {
  const id = req.query.id;
  if (id) {
    res.status(200).json({ message: `獲取所有產品` });
  } else {
    res.status(400).json({
      status: "error",
      message: "找不到使用者，帳號錯誤",
    });
  }
});

app.get("/api/products/search?id=1", (req, res) => {
  const id = req.query.id;
  res.status(200).json({ message: `使用 ID 作為搜尋條件來搜尋使用者 ${id}` });
});

app.post("/api/products", (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: "Product updated successfully" });
});

app.put("/api/products/1", upload.none(), (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: "Product updated successfully" });
});

app.delete("/api/products/1", (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: "Product deleted successfully" });
});

app.get("/api/products/search?id=1", (req, res) => {
  const id = req.query.id;
  res.status(200).json({ message: `使用 ID 作為搜尋條件來搜尋使用者 ${id}` });
});

app.listen(3000, () => {
  console.log("running at http://localhost:3000");
});

function checkToken(req, res, next) {
  let token = req.get("Authorization");
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          status: "error",
          message: "登入驗證失效，請重新登入",
        });
      }
      req.decoded = decoded;
      next();
    });
  } else {
    return res.status(401).json({
      status: "error",
      message: "無登入驗證資料，請重新登入",
    });
  }
}
