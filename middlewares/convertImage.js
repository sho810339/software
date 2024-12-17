const sharp = require('sharp'); // 圖片處理工具，用於轉換格式及調整圖片。
const path = require('path');   // 路徑模組，用於解析與操作檔案路徑。

const convertImage = async (req, res, next) => {
  if (!req.file) {
    // 如果沒有上傳檔案，直接繼續後續處理
    console.log('沒有上傳檔案，跳過圖片轉換');
    return next();
  }

  const inputPath = req.file.path; // 上傳的檔案路徑
  const outputPath = path.join(
    path.dirname(inputPath),
    `${path.parse(inputPath).name}.jpg`
  );

  try {
    await sharp(inputPath)
      .toFormat('jpeg')
      .toFile(outputPath);

    // 更新 req.file 以指向新的檔案
    req.file.path = outputPath;
    req.file.filename = path.basename(outputPath);

    next(); // 繼續到下一個中介層或控制器
  } catch (error) {
    next(new Error('圖片轉檔失敗'));
  }
};

module.exports = convertImage;
