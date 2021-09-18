import excel from 'excel4node';

const convertJsonToExcel = (order) => {
    // Require library

    // Create a new instance of a Workbook class
    const workbook = new excel.Workbook();

    // Add Worksheets to the workbook
    const worksheet = workbook.addWorksheet('Sheet 1');

    // Create a reusable style
    const style1 = workbook.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#FF8A00',
            fgColor: '#FF8A00',
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    const style2 = workbook.createStyle({
        fill: {
            type: 'pattern',
            patternType: 'solid',
            bgColor: '#C4C4C4',
            fgColor: '#C4C4C4',
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
    });

    // ID
    worksheet.cell(1, 1).string('id').style(style1);

    worksheet.cell(1, 2).string(order._id.toString()).style(style2);

    // Shipping Price
    worksheet.cell(3, 1).string('shippingPrice').style(style1);

    worksheet.cell(3, 2).number(order.shippingPrice).style(style2);

    // Total Price
    worksheet.cell(5, 1).string('totalPrice').style(style1);

    worksheet.cell(5, 2).number(order.totalPrice).style(style2);

    // Shipping Address
    worksheet.cell(7, 1).string('shippingAddress').style(style1);

    worksheet.cell(7, 2).string('country').style(style1);
    worksheet.cell(8, 2).string(order.shippingAddress.country).style(style2);
    worksheet.cell(7, 3).string('city').style(style1);
    worksheet.cell(8, 3).string(order.shippingAddress.city).style(style2);
    worksheet.cell(7, 4).string('address').style(style1);
    worksheet.cell(8, 4).string(order.shippingAddress.address).style(style2);
    worksheet.cell(7, 5).string('postalCode').style(style1);
    worksheet.cell(8, 5).string(order.shippingAddress.postalCode).style(style2);

    // orderItems
    worksheet.cell(10, 1).string('orderItems').style(style1);

    let count = 0;
    let i = 0;
    order.orderItems.forEach((item, idx) => {
        worksheet
            .cell(10 + i + idx, 2)
            .string('name')
            .style(style1);
        worksheet
            .cell(11 + i + idx, 2)
            .string(item.name)
            .style(style2);
        worksheet
            .cell(10 + i + idx, 3)
            .string('price')
            .style(style1);
        worksheet
            .cell(11 + i + idx, 3)
            .number(item.price)
            .style(style2);
        worksheet
            .cell(10 + i + idx, 4)
            .string('product ID')
            .style(style1);
        worksheet
            .cell(11 + i + idx, 4)
            .string(item.product.toString())
            .style(style2);
        worksheet
            .cell(10 + i + idx, 5)
            .string('quantity')
            .style(style1);
        worksheet
            .cell(11 + i + idx, 5)
            .number(item.qty)
            .style({
                fill: {
                    type: 'pattern',
                    patternType: 'solid',
                    bgColor: '#C4C4C4',
                    fgColor: '#C4C4C4',
                },
            });
        i++;
        count = 11 + i + idx;
    });

    // Payment Method
    worksheet
        .cell(count + 2, 1)
        .string('Payment Method')
        .style(style1);

    worksheet
        .cell(count + 2, 2)
        .string(order.paymentMethod)
        .style(style2);

    // PAID
    worksheet
        .cell(count + 4, 1)
        .string('Paid')
        .style(style1);

    worksheet
        .cell(count + 4, 2)
        .bool(order.isPaid)
        .style(style2);

    // phone Number
    worksheet
        .cell(count + 6, 1)
        .string('phone Number')
        .style(style1);

    worksheet
        .cell(count + 6, 2)
        .string(order.phoneNumber)
        .style(style2);

    // User Email
    worksheet
        .cell(count + 8, 1)
        .string('User Email')
        .style(style1);

    worksheet
        .cell(count + 8, 2)
        .string(order.user.email)
        .style(style2);

    // Order Date
    worksheet
        .cell(count + 10, 1)
        .string('Order Date')
        .style(style1);

    worksheet
        .cell(count + 10, 2)
        .string(order.createdAt.toString().substring(0, 15))
        .style(style2);

    workbook.write(`./excelFiles/order-${order._id}.xlsx`);
};

export default convertJsonToExcel;
