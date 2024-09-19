const Cart = require("../models/Cart");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();
//CREATE (Khi ấn thêm sản phẩm vào giỏ hàng, nếu chưa có bản ghi cart của người dùng ->
// tạo 1 bản ghi mới. Nếu người dùng đã có bản ghi cart -> add thêm sản phẩm vào danh sách sản phẩm trong cart)
router.post("/", verifyToken, async (req, res) => {
    try {
        let oldCart = await Cart.findOne({ userId: req.user.id })
        if (!oldCart) {
            const newCart = new Cart(req.body);
            const savedCart = await newCart.save();
            res.status(200).json(savedCart);
        } else {

            let cartUpdate = {
                userId: oldCart.userId,
                products: [
                    ...oldCart.products,
                    ...req.body.products
                ]
            }

            const newCart = await Cart.findByIdAndUpdate(
                oldCart._id,
                {
                    $set: cartUpdate
                },
                { new: true }
            );

            res.status(200).json(newCart);
        }
    } catch (err) {
        console.log('err', err);
        res.status(500).json(err);
    }
});


//Thay đổi giỏ hàng (Xoá sản phẩm khỏi giỏ hàng) 
//Param: truyền id người dùng userId
//body: truyền _id của product trong products của cart
router.put('/delete/:id', verifyTokenAndAuth, async (req, res) => {

    try {
        const productId = req.body.id 
        let oldCart = await Cart.findOne({ userId: req.user.id })
        let cartUpdate = {
            userId: oldCart.userId,
            products: oldCart.products.filter(product => {
                return String(product._id) !== String(productId)
            })
        }

        // console.log('oldCart', oldCart);

        const updatedCart = await Cart.findByIdAndUpdate(
            oldCart._id,
            {
                $set: cartUpdate
            },
            { new: true }
        );
        res.status(200).json({ success: true, message: "Xoá sản phẩm khỏi giỏ hàng thành công" })
    } catch (error) {
        res.status(500).json(error)
    }
})


router.put('/clear/:id', verifyTokenAndAuth, async (req, res) => {

    try {
        await Cart.findOneAndDelete({ userId: req.user.id })
        
        res.status(200).json({ success: true, message: "Giỏ hàng trống" })
    } catch (error) {
        res.status(500).json(error)
    }
})
//Lấy thông tin giỏ hàng của người dùng với param id = userId
//GET USER CART
router.get('/find/:id', verifyTokenAndAuth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.id }).populate({
            path: 'products.productId',
            model: 'Product',
          });
        
        res.status(200).json(cart)
    } catch (error) {
        res.status(500).json(error)
    }
})

// //GET ALL CARTS

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(carts)
    } catch (error) {
        res.status(500).json(error)
    }
})

module.exports = router