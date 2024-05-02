import { createRouter } from "next-connect";
const router = createRouter();

router.get((req, res) => {
  const { id } = req.query;
  res.status(200).json({ message: `獲取特定ID的使用者${id}` });
});
// POST新增一筆資料
router.post((req, res) => {
  const { id } = req.query;
  res.status(200).json({ message: `新增特定ID的使用者${id}` });
});
// 
router.put((req, res) => {
  const { id } = req.query;
  res.status(200).json({ message: `更新特定ID的使用者${id}` });
});
// 
router.delete((req, res) => {
  const { id } = req.query;
  res.status(200).json({ message: `刪除特定ID的使用者${id}` });
});

export default router.handler({
  onError: (err, req, res) => {
    console.log(err);
    res.status(err.statusCode || 500).json({ error: err.message });
  },
  onNoMatch: (req, res) => {
    res.status(404).json({ error: `路由 ${req.method} ${req.url} 找不到` });
  },
});
