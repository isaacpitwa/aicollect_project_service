/* eslint-disable no-useless-catch */
require('dotenv').config();

const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET
});

/**
 * @description Image upload util function
 * @param {string} base64Image Image Base64 string
 * @param {string} uploadPreset cloudinary config, location to store image
 * @returns {string} Url of uploaded image
 */
const uploadImage = async (base64Image, uploadPreset) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64Image}`,
      { upload_preset: uploadPreset }
    );
    return uploadResponse;
  } catch (error) {
    console.log('Error uploading image to cloudinary: ', error);
    throw error;
  }
};

export default uploadImage;
