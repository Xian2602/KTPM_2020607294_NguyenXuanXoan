const ListPage = (invoices) => {
    
    return `${invoices.map(item => (
        `
        <div>
            <div style="text-align: center;">
                <h1>T&T Shop</h1>
            </div>
            <div>
                <p class="muted" style="text-align: center;">Ngày đặt:  ${item.createdAt}</p>
            </div>
        </div>
        <div style="margin-bottom: 10px;">
            <table>
                <tr>
                    <td colspan="2">
                        <span>Mã hóa đơn: </span> <strong>${item.id}</strong>
                    </td>
                </tr>
                <tr>
                    <td><span>Khách hàng: </span> <strong>${item.name}</strong></td>
                   
                </tr>
                <tr>
                    <td>
                        <span>Số điện thoại: </span> <strong>${item.phone}</strong>
                    </td>
                    <td>
                        <span>Địa chỉ nhận hàng: </span> <strong>${item.address}</strong>
                    </td>
                </tr>
                <tr>
                    <td>
                    <span>Số tiền cần thanh toán: </span> <strong>${item.amount}</strong>
                    </td>
                    <td>
                        
                    </td>
                </tr>
            </table>


        </div>
        <table id="customers">
            <thead>
                <tr>
                    <th>Mã sản phầm</th>
                    <th>Tên sản phầm</th>
                    <th>Phân loại</th>
                    <th class="text-right">Số lượng</th>
                    <th class="text-right">Đơn giá</th>
                    <th class="text-right">Thành tiền</th>
                </tr>
            </thead>
            <tbody>

            ${item?.products?.map(product => (
                `<tr>
                    <td>${ product.productId?._id }</td>
                    <td>${ product.productId?.title }</td>
                    <td>${ product?.sizeOrder + " x " + product?.colorOrder }</td>
                    <td class="text-right">${ product?.quantityOrder }</td>
                    <td class="text-right">${ product?.productId?.price }</td>
                    <td class="text-right">${ product?.productId?.price *  product?.quantityOrder}</td>
               </tr>`
            )).join('')
        }
                <tr>

                    <td colspan="5" class="text-right">
                        <strong>
                            Tổng cộng:
                        </strong>
                    </td>
                    <td class="text-right">
                        <strong>
                            ${item.amount}
                        </strong>
                    </td>
                </tr>

            </tbody>
        </table>
        <div class="footer">
            <p>Chúc quý khách có những trải nhiệm tốt cùng <strong>T&T Shop</strong></p>
            <p>Xin chân thành cảm ơn !</p>
        </div>
        <div class="muted" style="text-align: left; padding: 8px 0;">Thông tin cửa hàng: Đặng Thu Thuỷ - 2020607837
        </div>
        <div style="text-align: center; background-color: #f5f5f5; padding: 4px;">
            <p>T&T Shop ©2024 Created by HT 0368463886</p>
        </div>
        <div style="margin: 20px 0; border: 2px dashed black; width: 100%;"></div>`
    )).join('')}`
}

module.exports = ListPage