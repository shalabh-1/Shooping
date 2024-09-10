const { Router } = require('express');
const router = Router();

// Import the controller function
// Correct the function name in the import statement
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, likeBlog, dislikeBlog, getAllLikedBlogsByUser,uploadImage } = require('../controller/blogCtrl.js');

const { authmiddleware, restrictToUser } = require('../middleware/authMiddleware.js');
const {uploadPhoto}=require("../middleware/bloguploadimage.js");
const { blogImageReSize } = require('../middleware/blogImageResize.js');


// Define a route for creating a blog post

router.post('/',authmiddleware,restrictToUser(["admin"]), createBlog);
router.put('/likes',authmiddleware,likeBlog)
router.put('/dislike',authmiddleware,dislikeBlog)
router.get('/likeuser',authmiddleware,getAllLikedBlogsByUser)
router.put('/:id',authmiddleware,restrictToUser(["admin"]), updateBlog);
router.put("/upload/:id",authmiddleware,restrictToUser(["admin"])
 ,uploadPhoto.array("images",2)
,blogImageReSize
 ,uploadImage
 )

router.get('/:id', getBlog);

router.get('/',getAllBlogs)

router.delete("/:id",authmiddleware,restrictToUser(["admin"]),deleteBlog)

module.exports = router;
