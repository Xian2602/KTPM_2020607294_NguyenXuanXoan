const Order = require("../models/Order");
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");
const Product = require("../models/Product");


const router = require("express").Router();
//CREATE
router.post("/", verifyToken, async (req, res) => {
    const newOrder = new Order(req.body);
    try {
        const savedOrder = await newOrder.save();
        res.status(200).json({ success: true, message: "Đặt hàng thành công", data: savedOrder });
    } catch (err) {
        res.status(500).json({ success: false, message: "Đặt hàng thất bại", error: err });
    }
});

//UPDATE STATUS
router.put("/update-status", verifyTokenAndAuth, async (req, res) => {
    const { idOrder, status } = req.body
    // body request: {
    //     idOrder: "65db54b3f4d125a2e26be9ae",
    //     status: "2"
    // }
    try {
        // 0 đang chờ xác nhận, 1 đang giao, 2 thành công, 
        // 3 đơn bị huỷ -> khi admin chưa xác nhận hoặc chưa thành công

        const order = await Order.findById(idOrder);
        // huỷ đơn
        if (status === "3") {
            if (order.status === "0") {
                await Order.findByIdAndUpdate(
                    idOrder,
                    {
                        $set: {status: status}
                    },
                    { new: true }
                );
                return res.status(200).json({ success: true, message: "Đơn hàng đã bị huỷ" })
            } else {
                return res.status(200).json({ success: false, message: "Đơn hàng không thể huỷ" })
            }
        }

        // xác nhận đơn
        if (status === "1") {
            if (order.status === "0") {
                await Order.findByIdAndUpdate(
                    idOrder,
                    {
                        $set: {status: status}
                    },
                    { new: true }
                );
                return res.status(200).json({ success: true, message: "Đơn hàng đã được xác nhận" })
            } else {
                return res.status(200).json({ success: false, message: "Đơn hàng không thể duyệt" })
            }
        }

        // đơn đã giao thành công
        if (status === "2") {
            if (order.status === "1") {
                await Order.findByIdAndUpdate(
                    idOrder,
                    {
                        $set: {status: status}
                    },
                    { new: true }
                );
                return res.status(200).json({ success: true, message: "Đơn hàng đã thực hiện thành công" })
            } else {
                return res.status(200).json({ success: false, message: "Không thể chuyển trạng thái đơn về thành công" })
            }
        }

        // nếu trạng thái đơn hàng truyền vào không hợp lệ
        return res.status(400).json({ success: false, message: "Trạng thái đơn hàng không hợp lệ" })


        // const updatedOrder = await Order.findByIdAndUpdate(
        //     idOrder,
        //     {
        //         $set: req.body
        //     },
        //     { new: true }
        // );
        // res.status(200).json(order)
    } catch (err) {
        return res.status(500).json({success: false, error})
    }
})
// //DELETE CART
// router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
//     try {
//         await Order.findByIdAndDelete(req.params.id)
//         res.status(200).json("ĐƠn hàng đã bị xoá!")
//     } catch (error) {
//         res.status(500).json(error)
//     }
// })

//GET USER ORDERS
router.post('/find/:id', verifyTokenAndAuth, async (req, res) => {
    // body:
    // {
    //     status: 0
    // }
    const status = req.body.status
    try {
        const order = await Order.find({ userId: req.params.id, status: status }).populate({
            path: 'products.productId',
            model: 'Product',
        });
        res.status(200).json({ success: true, message: "Tìm kiếm thành công", data: order })
    } catch (error) {
        res.status(500).json({ success: false, message: "Có lỗi xảy ra khi tìm kiếm đơn hàng", error })
    }
})

// //GET ALL orrder

router.get("/search/:status", verifyTokenAndAdmin, async (req, res) => {
    try {
        let statusOrder = req.params.status
        const orders = await Order.find({ status: statusOrder }).populate({
            path: 'products.productId',
            model: 'Product',
        }).populate({
            path: 'userId',
            model: 'User',
        }).sort({ createdAt: 'desc' });;
        res.status(200).json({ success: true, message: "Lấy danh sách đơn hàng thành công", data: orders })
    } catch (error) {
        res.status(500).json({ success: false, message: "Có lỗi xảy ra", error: error })
    }
})

// GET INCOME


router.get("/income", verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

    try {
        const income = await Order.aggregate([
            { $match: { createdAt: { $gte: previousMonth } } },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: "$month",
                    total: { $sum: "$sales" },
                },
            },
        ]);
        res.status(200).json(income);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get("/top-selling-products", async (req, res) => {
    try {
      // Aggregate pipeline to group orders by product and calculate total quantity sold
      const topSellingProducts = await Order.aggregate([
        {
          $unwind: "$products" // Split array of products into separate documents
        },
        {
          $group: {
            _id: "$products.productId", // Group by productId
            totalQuantitySold: { $sum: "$products.quantity" } // Calculate total quantity sold for each product
          }
        },
        {
          $sort: { totalQuantitySold: -1 } // Sort by total quantity sold in descending order
        },
        {
          $limit: 10 // Limit the result to top 10 selling products
        }
      ]);
      //console.log('totalQuantitySold',totalQuantitySold);
  
      // Retrieve details of the top selling products using their IDs
      const topSellingProductsDetails = await Product.find({
        _id: { $in: topSellingProducts.map(product => product._id) }
      });
  
      res.json(topSellingProductsDetails);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });


module.exports = router