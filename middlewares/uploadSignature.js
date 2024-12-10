// middleware/uploadSignature.js

const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 設定圖片上傳的儲存路徑和檔案命名規則
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '..', 'uploads', 'signature'); // 確保目錄存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const fileExtension = path.extname(file.originalname); // 取得檔案副檔名
    const filename = `${Date.now()}${fileExtension}`; // 使用當前時間戳作為檔案名
    cb(null, filename);
  }
});

// 使用 multer 中介軟體來處理圖片檔案上傳
const upload = multer({ storage: storage });

module.exports = upload.single('signature'); // 這裡假設前端傳來的檔案欄位名稱為 'signature'