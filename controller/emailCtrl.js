const nodemailer = require("nodemailer");
const asyncHandler=require("express-async-handler")


const sendEMail= asyncHandler(
    async(data ,request,response)=>{
    
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use `true` for port 465, `false` for all other ports
    auth: {
      user: process.env.Email,
      pass: process.env.Password,
    },
  });
   
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: 'Hey" <maddison53@ethereal.email>', // sender address
      to: data.to, // list of receivers
      subject: data.subject, // Subject line
      text: data.text, // plain text body
      html: data.html, // html body
    });
  
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
  

    }
)




module.exports={sendEMail}