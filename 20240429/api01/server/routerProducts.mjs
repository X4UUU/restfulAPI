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

// 得到所有產品
app.get("/api/products", (req, res) => {
  const id = req.query.id;
  res.status(200).json({ message: `得到所有產品` });
});

//得到產品 ID 為 1 的檔案
app.get("/api/products/1", (req, res) => {
  const id = req.query.id;
  res.status(200).json({ message: `得到產品 ID 為 1 的檔案` });
});

//新增一個產品
app.post("/api/products", (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: "Product created successfully" });
});

// 更新產品 ID 為 1 的檔案
app.put("/api/products/1", (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: "Product updated successfully" });
});

// 刪除 ID 為 1 的產品
app.delete("/api/products/1", (req, res) => {
  const id = req.params.id;
  res.status(200).json({ message: "Product deleted successfully" });
});

// 用 id 做為搜尋條件搜尋產品
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
