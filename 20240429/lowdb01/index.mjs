import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

const defaultData = { users: {}, products: [] };
const db = new Low(new JSONFile("./db.json"), defaultData);
await db.read();

db.data.products = db.data.products.filter(
  (p) => p.id !== "f14c57a2-da25-4352-8cdf-08ce0ad7f739"
);
// let p = db.data.products.find(
//   p => p.id === "f14c57a2-da25-4352-8cdf-08ce0ad7f739"
// );
// let price = 40;
// let stock = 10;
// Object.assign(p, { price, stock });
// await db.write();

// let page = 1;
// let limit = 5;
// let start = (page - 1) * limit;
// let end = page * limit;
// sort((a, b) => b.price - a.price)以呈現升冪、降冪
// let data = db.data.products.sort((a, b) => b.price - a.price).slice(start, end);
// let data = db.data.products.slice(start, end).sort((a, b) => b.price - a.price);
// db.data.products.find(
//   (p) => p.id === "f14c57a2-da25-4352-8cdf-08ce0ad7f739"
// ).stock = 50;
// console.log(data);
// console.log(db.data.products.filter((p) => p.title.includes("瓜")));
// console.log(db.data.products.find(p => p.title === "胡瓜"));
// const uid = uuidv4();
// const user = {
//     id:uid,
//     account: "testuser",
//     password: "1111",
//     name: "nameuser",
//     head: "https://randomuser.me/api/portraits/men/44.jpg",
// }
// db.data.users[uid] = user;
// await db.write();

// const product = {
//   id: uuidv4(),
//   title: "南瓜",
//   price: 120,
//   stock: 124,
//   createTime: Date.now(),
// };
// await db.update(({products}) => products.push(product));
// console.log(db.data);
// unshift() 方法會添加一個或多個元素至陣列的開頭，並且回傳陣列的新長度。
// db.data.products.unshift({
//   id: uuidv4(),
//   title: "胡瓜",
//   price: 30,
//   stock: 100,
//   createTime: Date.now(),
// });
// await db.write();
