

// this middle ware will be triggered only if we write a wrong route
const notfound=(request,response,next)=>{    
const error=new Error(`Not found ${request?.originalUrl}`) 
response.status(404);
next(error)
}



const errorHandler=(err,request, response,next)=>{
    // console.log(response.statusCode);

    const statusCode = response.statusCode === 200 ? 500 : response.statusCode;

    response.status(statusCode)
    response.json({
        message:err?.message,
        stack:err?.stack
    })
}

module.exports={errorHandler,notfound}




