const { createFilePdf, sendMailInvoice } = require("../service/invoiceService");
const ListPage = require("../view/ListPage");
const SinglePage = require("../view/SinglePage")
const Layout = require("../view/layout")
const Order = require("../models/Order");
async function ExportTest(req, res) {

    const invoice = {
        id: "47427759-9362-4f8e-bfe4-2d3733534e83",
        username: "Lê Văn Tùng",
        createDate: "11/05/2002",
        email: "levantung14112002@gmail.com",
        phone: "0373984007",
        address: "Ngõ 32/84/57 Đỗ Đức Dục Hà Nội",
        status: "Đã thanh toán",
        total: "100.000đ",
        products: [
            {
                _id: 1234,
                name: "Iphone 15 Pro Max",
                category: "Black x 256GB",
                quantity: "1",
                price: "70.000đ",
                total: "70.000đ"
            },
            {
                _id: 3214,
                name: "Iphone 11 Pro Max",
                category: "Black x 256GB",
                quantity: "1",
                price: "30.000đ",
                total: "30.000đ"
            }
        ]
    }
    const htmlContent = Layout(SinglePage(invoice))
    const options = { format: 'Letter' };
    createFilePdf(htmlContent, options, res)
}


async function ExportDetail(req, res) {
    
    try {
        const invoice =req.body;
        const htmlContent = Layout(SinglePage(invoice))
        const options = { format: 'Letter' };
        createFilePdf(htmlContent, options, res)
    } catch (error) {
        console.log('Có lỗi xảy ra:', error);
    }
    
}

async function ExportAll(req, res) {

    // const {invoices} =req.body;
    const orders = await Order.find({ status: "1" }).populate({
        path: 'products.productId',
        model: 'Product',
    }).populate({
        path: 'userId',
        model: 'User',
    });
    try {
        const htmlContent = Layout(ListPage(orders))
        const options = { format: 'Letter' };
        createFilePdf(htmlContent, options, res)
    } catch (error) {
        console.log('Có lỗi xảy ra:', error);
    }
    // console.log();
    // console.log('orders',orders);
    // ListPage(orders)
    // return res.json({orders: orders})
    
}

async function SendMail(req, res) {

    const invoice =req.body;
    console.log('invoice',invoice)
    try {
        const htmlContent = Layout(SinglePage(invoice))
        const options = { format: 'Letter' };
        sendMailInvoice(htmlContent, options, invoice, res)
    } catch (error) {
        console.log('Có lỗi xảy ra:', error);
    }
    // console.log('invoice', invoice);
   
}

module.exports = {
    ExportTest,
    ExportAll,
    ExportDetail,
    SendMail
}