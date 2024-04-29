import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";

const defaultData = { users: {}, products: [] };
const db = new Low(new JSONFile("./db2.json"), defaultData);
await db.read();
const uid = uuidv4();
const user = {
    id:uid,
    account: "testuser",
    password: "1111",
    name: "nameuser",
    head: "https://randomuser.me/api/portraits/men/44.jpg",
}
db.data.users[uid] = user;
await db.write();

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
