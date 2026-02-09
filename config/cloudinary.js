const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.cloud_API_Key,
  api_secret: process.env.cloud_Secret_Key
});

module.exports = cloudinary;