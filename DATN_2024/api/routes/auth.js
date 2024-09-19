const router = require("express").Router();
const asyncHandler = require('express-async-handler');
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const sendMail = require('../utils/sendMail')
const bcrypt = require('bcrypt')
const crypto = require('crypto')
//REGISTER
router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });
    try {
        const savedUser = await newUser.save();
        res.status(201).json(savedUser)
    } catch (err) {
        res.status(500).json(err)
    }

});
//LOGIN
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne(
            {
                email: req.body.email
            }
        );
        if (!user) {
            return res.status(401).json("Không đúng tài khoản");
        }


        const hashedPassword = CryptoJS.AES.decrypt(
            user.password,
            process.env.PASS_SEC
        );

        const OriginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);
        if (OriginalPassword !== req.body.password) {
            return res.status(401).json("Không đúng mật khẩu");
        }

        const accessToken = jwt.sign(
            {
                id: user._id,
                isAdmin: user.isAdmin
            },
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        )
        const { password, ...others } = user._doc;
        return res.status(200).json({ ...others, accessToken })

    } catch (err) {
        return res.status(500).json(err)
    }
});

// FORGOT PASSWORD
// router.post("/forgot-password",(req, res) => {
//     const {email} =req.body;
//     User.findOne({email: email})
//     .then(user =>{
//         if(!user){
//             return res.send({Status: "Khoong ton tai nguoi dung"})
//         }
//         const token = jwt.sign({id: user._id},"jwt_secret_key",{expiresIn: "1d"})
//         var transporter = nodemailer.createTransport({
//             service: 'gmail',
//             auth: {
//               user: 'manhtan9122002@gmail.com',
//               pass: 'qoge ffyx ivnp fccj'
//             }
//           });
          
//           var mailOptions = {
//             from: 'manhtan9122002@gmail.com',
//             to: 'manhtan9122002@gmail.com',
//             subject: 'Reset to Password',
//             text: `http:/localhost:3000/rest-password/${user._id}/${token}`
//           };
          
//           transporter.sendMail(mailOptions, function(error, info){
//             if (error) {
//               console.log(error);
//             } else {
//               return res.send({Status: "Success"})
//             }
//           });
//     })
// });

//FORGOT PASSWORD

router.post("/forgot-password",asyncHandler(async(req, res) =>{
    const { email } = req.body
    if (!email) throw new Error('Missing email')
    const user = await User.findOne({ email })
    if (!user) throw new Error('User not found')
    const resetToken = user.createPasswordChangedToken()
    await user.save()
    console.log('usser', user);

    const html = `Xin vui lòng click vào link dưới đây để thay đổi mật khẩu của bạn.Link này sẽ hết hạn sau 15 phút kể từ bây giờ. <a href=http://localhost:3000/reset-password/${user._id}>Click here</a>`

    const data = {
        email,
        html
    }
    const rs = await sendMail(data)
    return res.status(200).json({
        success: true,
        rs
    })
}))

// RESET PASSWORD
// router.post("/reset-password", asyncHandler(async(req,res) =>{
//     const { password, token } = req.body
//     if (!password || !token) throw new Error('Missing imputs')
//     const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex')
//     const user = await User.findOne({ passwordResetToken, passwordResetExpires: { $gt: Date.now() } })
//     if (!user) throw new Error('Invalid reset token')
//     user.password = password
//     user.passwordResetToken = undefined
//     user.passwordChangedAt = Date.now()
//     user.passwordResetExpires = undefined
//     await user.save()
//     return res.status(200).json({
//         success: user ? true : false,
//         mes: user ? 'Updated password' : 'Something went wrong'
//     })
// }));
// password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),



// const verifyToken = (req,res,next) =>{
//     const authHeader = req.headers.token
//     // console.log('req', req.headers);
//     if(authHeader){
//         const token = authHeader.split(" ")[1]
//         jwt.verify(token, process.env.JWT_SEC,(err, decoded) =>{
//             if(err){
//                 // console.log('error', err);
//                 res.status(403).json("Heet han!");
//             } 
//             // console.log('user', decoded);
//             req.user = decoded;
//             next();
//         })
//     }else{
//         return res.status(401).json("Chưa xác thực!");
//     }
// }
router.post('/reset-password/:id', (req, res) => {
    const {id} = req.params
    const {password} = req.body

    // jwt.verify(token, "jwt_secret_key", (err, decoded) => {
    //     if(err) {
    //         console.log('check', err);
    //         return res.json({Status: "Error with token"})
    //     } else {
            const hashedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();
            // bcrypt.hash(hashedPassword, 10)
            // CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
            try {
                User.findByIdAndUpdate({_id: id}, {password: hashedPassword})
                .then(u => res.send({Status: "Success"}))
                .catch(err => res.send({Status: err}))
            } catch (error) {
                
            }
                
           
    //     }
    // })
})

module.exports = router;
