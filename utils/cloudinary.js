const asyncHandler = require('express-async-handler');
const { errorHandler } = require('../middleware/errorHandler');
const cloudinary = require('cloudinary').v2;

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.API_KEY, 
    api_secret: process.env.API_SECRET,
    secure: true
});
const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
  };


// const cloudinaryUploadImg = async (imagePath) => {
//     return new Promise((resolve, reject) => {
//         cloudinary.uploader.upload(
//             imagePath,
//             {
//                 //  public_id: publicId,
//                 resource_type: "auto" // Automatically detects the resource type (e.g., image, video)
//             },
//             (error, result) => {
//                 if (error) {
//                     console.log(error);
//                     reject(error); // Handle errors by rejecting the promise
//                 } else {
//                     const url = cloudinary.url(result.public_id, { type: 'upload', secure: true });
//                     resolve({
//                         // url: result.secure_url // URL to access the uploaded image
//                         url:url
//                     });
//                 }
//             }
//         );
//     });
// };
const cloudinaryUploadImg = async (imagePath) => {

  
      try {
        // Upload the image
        const result = await cloudinary.uploader.upload(imagePath, options);

        return {
          url:result.secure_url,
          asset_id:result.asset_id,
          public_id:result.public_id
        }
        
      } catch (error) {
       throw new Error(error)
      }
  };

  const cloudinarydeleteImg = async ( public_id) => {
    try {
      // Delete the image from Cloudinary
      const result = await cloudinary.uploader.destroy(public_id);
  
      if (result.result === 'ok') {
        return  {
          message: "Image deleted successfully",
          public_id: public_id,
        };
      } else {
        throw new Error("Failed to delete image");
      }
    } catch (error) {
      throw new Error(error.message);
    }
  };
  

module.exports = { cloudinaryUploadImg,cloudinarydeleteImg};
