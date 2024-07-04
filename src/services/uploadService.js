import { toast } from 'react-toastify';
import axios from 'axios';
import Compressor from 'compressorjs';

export const uploadImage = async event => {
  let toastId = null;

  const image = await getImage(event);
  if (!image) return null;

  const compressedImage = await compressImage(image);
  
  const formData = new FormData();
  formData.append('image', compressedImage, compressedImage.name);
  const response = await axios.post('api/upload', formData, {
    onUploadProgress: ({ progress }) => {
      if (toastId) toast.update(toastId, { progress });
      else toastId = toast.success('Uploading...', { progress });
    },
  });
  toast.dismiss(toastId);
  return response.data.imageUrl;
};

const getImage = async event => {
  const files = event.target.files;

  if (!files || files.length <= 0) {
    toast.warning('Upload file is not selected!', 'File Upload');
    return null;
  }

  const file = files[0];

  if (!(file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/webp')) {
    toast.error('Only JPG/PNG/WEBP type is allowed', 'File Type Error');
    return null;
  }

  return file;
};

const compressImage = image => {
  return new Promise((resolve, reject) => {
    if (image.size <= 750 * 1024) {
      // If the image size is less than or equal to 750KB, no need to compress
      resolve(image);
    } else {
      new Compressor(image, {
        quality: 0.6, // Adjust the quality as needed
        success: compressedImage => {
          resolve(compressedImage);
        },
        error: err => {
          toast.error('Image compression failed', 'Compression Error');
          reject(err);
        },
      });
    }
  });
};
