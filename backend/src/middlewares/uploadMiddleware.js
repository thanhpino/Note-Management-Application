const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    return {
      folder: file.fieldname === 'avatar' ? 'avatars' : 'note_images',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      public_id: file.originalname.split('.')[0] + '-' + Date.now()
    };
  },
});

const upload = multer({ storage });

exports.uploadAvatar = upload.single('avatar');
exports.uploadNoteImages = upload.array('images', 10);
