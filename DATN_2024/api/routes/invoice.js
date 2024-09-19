
const invoiceController = require("../controller/invoiceController")
const { verifyToken, verifyTokenAndAuth, verifyTokenAndAdmin } = require("./verifyToken");

const router = require("express").Router();


// export 1 cái để test
router.get('/export', invoiceController.ExportTest);

// // export hoá đơn theo id đơn hàng
router.post('/export_by_id', invoiceController.ExportDetail);

router.post('/export_all', invoiceController.ExportAll);
router.post('/send_mail', invoiceController.SendMail);




module.exports = router;