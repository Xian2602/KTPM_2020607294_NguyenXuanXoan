const jwt = require("jsonwebtoken");


// xác thực người dùng, người dùng đã đăng nhập hay chưa, người gửi yêu cầu là ai
const verifyToken = (req,res,next) =>{
    const authHeader = req.headers.token
    // console.log('req', req.headers);
    if(authHeader){
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC,(err, decoded) =>{
            if(err){
                // console.log('error', err);
                res.status(403).json("Heet han!");
            } 
            // console.log('user', decoded);
            req.user = decoded;
            next();
        })
    }else{
        return res.status(401).json("Chưa xác thực!");
    }
}


// Xác thực người dùng có quyền thực hiện hay không(chắc chắn là phải đã đăng nhập)
// người dùng có quyền thực hiện hành với các chức năng thông tin của bản thân mình, hoặc là admin có quyền thao tác với mọi thông tin trong hệ thống
const verifyTokenAndAuth = (req, res, next) =>{
    verifyToken(req,res,() =>{
        if(req.user?.id === req.params.id || req.user?.isAdmin){
            next();
        }else{
            res.status(403).json("Ban khong co quyen truy cap!");
        }
    })
}


// chỉ có người admin được thực hiện
const verifyTokenAndAdmin = (req, res, next) =>{
    verifyToken(req,res,() =>{
        if(req.user?.isAdmin){
            next();
        }else{
            res.status(403).json("Ban khong phai quan tri vien!");
        }
    })
}
module.exports = {verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin}