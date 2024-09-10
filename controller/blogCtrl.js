const asyncHandler = require('express-async-handler')
const validateId = require("../utils/validateMongoDb.js")
const User = require("../models/userModel.js")
const Blog = require("../models/blogModel.js")
const { cloudinaryUploadImg } = require('../utils/cloudinary.js')
const fs = require('fs')


const createBlog=asyncHandler(

    async (request,response)=>{
       try 
       {
        const blog=await Blog.create(request.body)
        response.json({"message":"blog created",
            blog
        })
       } catch (error) {
        throw new Error(error)
       }

    }



)

const updateBlog=asyncHandler(

    async (request,response)=>{
       try 
       {
        const id=request.params.id
        validateId(id)
        const blog=await Blog.findByIdAndUpdate(id,request.body,{
            new:true
        });
        response.json({"message":"blog Updated",
            blog
        })
       } catch (error) {
        throw new Error(error)
       }

    }



)

const getBlog=asyncHandler(

    async (request,response)=>{
       try 
       {
        const id=request.params.id
        validateId(id)
        
        const updatedBlog = await Blog.findByIdAndUpdate(
            id, 
            { 
                $inc: { 
                    numViews: 1 
                }
            
            }, // Increment the numViews field
            { new: true } // Return the updated document
          ).populate("likes").populate("dislikes");

        //   console.log(updatedBlog._id.toString())
        response.json(
            updatedBlog
        )
       } catch (error) {
        throw new Error(error)
       }

    }



)

    const getAllBlogs=asyncHandler(
        async (request,response)=>{
            
            try {

                const blog=await Blog.find({})
                response.json(blog)
            } catch (error) {
                throw new Error(error)   
            }
    })


    const deleteBlog=asyncHandler(

        async (request,response)=>{
           try 
           {
            const id=request.params.id
            validateId(id)
            const deleteBlog = await Blog.findByIdAndDelete(
                id, 
              );
    
            
            response.json(
                deleteBlog
            )
           } catch (error) {
            throw new Error(error)
           }
    
        }
    
    
    
    )

    const likeBlog=asyncHandler(

        async (request,response)=>{
          

            try{
                const {blogId}=request.body
               
                validateId(blogId)
                // find the blog which you want to like 
                const blog=await Blog.findById(blogId)
                //find the login user
                const loginUserId=request?.user?.id
                // find the user has like the blog
                const isLiked=blog?.likes?.includes(loginUserId)
                // find the user has dislike the blog
                const hasUserDisliked = blog.dislikes.includes(loginUserId);

              
                let updatequery={}
                 // suppose if the post is already liked so we need to unlike not dislike
                if(isLiked){
                    updatequery={
                        $pull:{
                            likes:loginUserId
                        },

                         $set:{
                            isLiked:true
                        }
                    }

                }else if(hasUserDisliked){
                    // suppose if the post is already disliked

                    updatequery={
                        $pull:{
                            dislikes:loginUserId
                        },
                        
                        $addToSet:{
                            likes:loginUserId, 
                        },
                        $set:{
                            isDisliked:false,
                            isLiked:true
                        }
                        

                    }

                }else {
                    // aggar na hi usne dislike kiya va h na hi like 
                    updatequery={
                        $addToSet:{
                            likes:loginUserId
                        },
                        $set:{
                            
                            isLiked:true
                        }
                      

                    }


                }
                
                const updatedBlog = await Blog.findByIdAndUpdate
                (blogId, updatequery, { new: true }).populate("likes").populate("dislikes")
             
                response.json(updatedBlog)
            }catch(error){

                throw new Error(error)
            }
        }


    )


    
    const dislikeBlog=asyncHandler(

        async (request,response)=>{
          

            try{
                const {blogId}=request.body
                console.log(blogId)
                validateId(blogId)
                // find the blog which you want to like 
                const blog=await Blog.findById(blogId)
                //find the login user
                const loginUserId=request?.user?.id
                // find the user has like the blog
                const isLiked=blog?.likes?.includes(loginUserId)
                // find the user has dislike the blog
                const hasUserDisliked = blog.dislikes.includes(loginUserId);

              
                let updatequery={}
                 // suppose if the post is already liked and we need to dislke
                if(isLiked){
                    updatequery={
                        $pull: { 
                            likes: loginUserId
                         }, // Remove the user ID from likes
                        $push: {
                             dislikes: loginUserId 
                            }, // Add the user ID to dislikes
                        $set: { 
                            isLiked: false, isDisliked: true
                         } // Update like and dislike status
                    }

                }else if(hasUserDisliked){
                    // suppose if the post is already disliked

                    updatequery={
                        $pull:{
                            dislikes:loginUserId
                        },
                        isDisliked:false

                    }

                }else {
                    // aggar na hi usne dislike kiya va h na hi like 
                    updatequery={
                        $push:{
                            dislikes:loginUserId
                        },
                        isDisliked:true

                    }


                }
                
                const updatedBlog = await Blog.findByIdAndUpdate
                (blogId, updatequery, { new: true }).populate("dislikes")
             
                response.json(updatedBlog)
            }catch(error){

                throw new Error(error)
            }
        }


    )
    // get app blogs that a current user likes
    const getAllLikedBlogsByUser=asyncHandler(

      
        async (request,response)=>{
            console.log("helli")
          try{
            const blogs= await Blog.find({
                likes:request.user.id
    
            })

            response.json(blogs)
          }catch(error){
            throw new Error(error)
          }
    
        }        
        )

        
const uploadImage=asyncHandler(


    async(request,response)=>{

      const {id}=request.params
     

      try{

        const uploader = (path) => cloudinaryUploadImg(path);
        const files=request.files
        // console.log(files)
        const urls = await Promise.all(files.map(async (file) => {
          const { path,resizePath} = file;
          fs.unlink(path, (err) => {
            if (err) {
              console.error('Error deleting the file:', err);
              return;
            }
            console.log('File deleted successfully!');
          });
          return uploader(resizePath);
      }));
      // console.log(urls)    
    
      console.log(urls)
        const findBlog=await Blog.findByIdAndUpdate(id,{
          image:urls

        },{
          new:true
        })
        response.json(findBlog)
        
      }catch(error){
      throw new Error(error)
  }

}


)

    

module.exports={
    createBlog,updateBlog,getBlog,getAllBlogs,deleteBlog,likeBlog,dislikeBlog,getAllLikedBlogsByUser,uploadImage
}