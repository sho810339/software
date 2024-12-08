const multer = require('multer');
const path = require('path');

// 設定存放檔案的資料夾及檔名格式
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile'); // 存放在 uploads/profile 資料夾
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// 過濾允許的檔案類型
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('只允許上傳 JPEG, PNG 或 GIF 格式的圖片'));
  }
};

// 設置 multer
const upload = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024, // 限制檔案大小為 2MB
  },
  fileFilter,
});

module.exports = upload;
