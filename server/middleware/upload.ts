import multer from 'multer';
import path from 'path';

// Memory storage for parsing files in buffer
const storage = multer.memoryStorage();

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt'];
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/octet-stream'
];

export const uploadResumeFile = multer({
  storage,
  limits: {
    fileSize: 8 * 1024 * 1024, // 8 MB limit
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext) || ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF, DOC, DOCX, and TXT files are allowed.'));
    }
  },
});
