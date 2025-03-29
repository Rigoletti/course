import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'category-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Неподдерживаемый тип файла. Разрешены только изображения (JPEG, PNG, GIF, WEBP)"), false);
  }
};

const limits = {
  fileSize: 2 * 1024 * 1024 
};

const upload = multer({ 
  storage,
  fileFilter,
  limits
});

export default upload;