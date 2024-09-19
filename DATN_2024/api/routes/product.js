const Product = require("../models/Product");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();
//CREATE
router.post("/", verifyTokenAndAdmin, async (req, res) => {
    const newProduct = new Product(req.body);

    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    } catch (err) {
        res.status(500).json(err);
    }
});

//UPDATE
router.put("/:id", verifyTokenAndAuth, async (req, res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            {
                $set: req.body
            },
            { new: true }
        );
        res.status(200).json(updatedProduct)
    } catch (err) {
        res.status(500).json(err)
    }
})
//DELETE
router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id)
        res.status(200).json("Sản phẩm đã bị xoá!")
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET PRODUCT
router.get('/find/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id)
        res.status(200).json(product)
    } catch (error) {
        res.status(500).json(error)
    }
})

//GET ALL PRODUCT
router.get('/', async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;
    const qSearch = req.query.search;
    //console.log("---------------------req------------",req);
    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createAt: -1 }).limit(1);
        } else if (qCategory) {
            products = await Product.find(
                {
                    categories: {
                        $in: [qCategory]
                    }
                }
            );
        }else if (qSearch) { // Nếu có truy vấn tìm kiếm
            products = await Product.find({ name: { $regex: qSearch, $options: 'i' } }); // Tìm sản phẩm có tên chứa qSearch
        }
        else{
            products = await Product.find();
        }
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json(error);
    }
})

module.exports = router