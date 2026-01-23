// /home/iann/mern/andan-store/server/src/routes/upload.js
import express from 'express';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

const router = express.Router();

// Configure multer with size limits and file type validation
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Only allow image files
    const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed (jpeg, png, gif, webp)'));
    }
  }
});

router.post('/', upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    
    if (!file) {
      return res.status(400).json({ 
        success: false,
        error: 'No file uploaded' 
      });
    }

    const result = await cloudinary.uploader.upload_stream(
      { 
        folder: 'andan-grocery',
        resource_type: 'auto',
        max_bytes: 5 * 1024 * 1024 // 5MB limit on cloudinary side too
      },
      (error, result) => {
        if (error) {
          return res.status(500).json({ 
            success: false,
            error: error.message 
          });
        }
        res.json({ 
          success: true,
          url: result.secure_url 
        });
      }
    );
    
    result.end(file.buffer);
  } catch (err) {
    res.status(400).json({ 
      success: false,
      error: err.message 
    });
  }
});

export default router;