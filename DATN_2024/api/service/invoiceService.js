const pdf = require('html-pdf');
const {sendMail} = require('./emailService')
const createFilePdf = (htmlContent, options ,res) => {
    pdf.create(htmlContent, options).toBuffer((pdfErr, buffer) => {
            
        if (pdfErr) {
            console.error(pdfErr);
            return res.status(500).send('Error generating PDF');
        }

        // Trả về tệp PDF cho client
        res.setHeader('Content-Disposition', 'attachment; filename="file.pdf"');
        res.setHeader('Content-Type', 'application/pdf');
        res.end(buffer); // Sử dụng res.end() để gửi dữ liệu Buffer
    });
}

const sendMailInvoice = (htmlContent, options, invoice, res) => {
    pdf.create(htmlContent, options).toBuffer((pdfErr, buffer) => {
            
        if (pdfErr) {
            console.error('pdfErr : ',pdfErr);
            return res.status(500).json({ success: false, message: "Internal server error" })
        }
        const data = {
            email: invoice.userId.email,
            subject: "Thông tin hóa đơn mua hàng",
            html: htmlContent
        }
        // console.log('data', data);
        sendMail(data)


        return res.status(200).json({ success: true, message: "Gửi mã hóa đơn thành công !" })
    });
}

module.exports = {
    createFilePdf,
    sendMailInvoice
}