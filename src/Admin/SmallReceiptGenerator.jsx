import React, { useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser } from "../actions/adminAction";

const SmallReceiptGenerator = ({ order }) => {
  const dispatch = useDispatch();
  const { users } = useSelector((state) => state.singleUser);
  const { outlet } = useSelector((state) => state.getOutletInfo);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (order && order.user) {
      dispatch(getSingleUser(order.user));
    }
  }, [order, dispatch]);

  useEffect(() => {
    if (users[order.user] && outlet) {
      setIsLoading(false);
    }
  }, [users, outlet, order.user]);

  const generatePDF = () => {
    if (isLoading) return;

    const currentUser = users[order.user];
    const doc = new jsPDF({
      unit: 'mm',
      format: [80, 297], // Thermal receipt width, auto height
    });

    // Logo and Header
    if (outlet.outletLogo?.url) {
      doc.addImage(outlet.outletLogo.url, 'JPEG', 25, 5, 30, 15);
    }
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(outlet.outletName || '', 40, 25, { align: 'center' });
    doc.setFontSize(7);
    doc.text(outlet.address || '', 40, 30, { align: 'center' });
    doc.text(`Mobile: ${outlet.altPhone || ''} | GST: ${outlet.gst || ''}`, 40, 35, { align: 'center' });

    // Order Info
    doc.text(`Order ID: #${order._id}`, 5, 45);
    doc.text(`Date: ${format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a")}`, 5, 50);
    doc.text(`Customer: ${currentUser?.name || 'N/A'}`, 5, 55);
    doc.text(`Phone: ${order.deliveryInfo.phone || 'N/A'}`, 5, 60);
    doc.text(`Payment: ${order.paymentInfo.status || 'N/A'}`, 5, 65);
    doc.text(`Address: ${order.deliveryInfo.address || ''}, ${order.deliveryInfo.city || ''} - ${order.deliveryInfo.pincode || ''}`, 5, 70, { maxWidth: 70 });

    // Items Table
    doc.autoTable({
      startY: 80,
      head: [['Item', 'Qty', 'Rate', 'Total']],
      body: order.orderItems.map((item) => [
        item.name,
        item.quantity,
        item.price.toFixed(2),
        (item.quantity * item.price).toFixed(2),
      ]),
      styles: { fontSize: 7, cellPadding: 1 },
      headStyles: { fillColor: [240, 240, 240], textColor: 0, fontStyle: 'bold' },
      columnStyles: {
        0: { cellWidth: 30 },
        1: { cellWidth: 10, halign: 'center' },
        2: { cellWidth: 15, halign: 'right' },
        3: { cellWidth: 15, halign: 'right' },
      },
    });

    const finalY = doc.previousAutoTable.finalY || 80;

    // Totals Section
    doc.setFontSize(8);
    doc.text('Subtotal:', 45, finalY + 5);
    doc.text(`₹${order.itemPrice.toFixed(2)}`, 70, finalY + 5, { align: 'right' });

    doc.text('GST (5%):', 45, finalY + 10);
    doc.text(`₹${order.taxPrice.toFixed(2)}`, 70, finalY + 10, { align: 'right' });

    doc.text('Discount:', 45, finalY + 15);
    doc.text(`₹${order.discount.toFixed(2)}`, 70, finalY + 15, { align: 'right' });

    doc.setFont('helvetica', 'bold');
    doc.text('Total:', 45, finalY + 20);
    doc.text(`₹${order.totalPrice.toFixed(2)}`, 70, finalY + 20, { align: 'right' });
    doc.setFont('helvetica', 'normal');

    // Footer
    doc.setFontSize(7);
    doc.text('Thank you for ordering with us!', 40, finalY + 30, { align: 'center', maxWidth: 70 });
    doc.text('Enjoy your meal!', 40, finalY + 35, { align: 'center', maxWidth: 70 });

    // Save PDF
    doc.save(`order-${order._id}.pdf`);
  };

  return (
    <div className="flex justify-center">
      <button
        onClick={generatePDF}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        disabled={isLoading}
      >
        {isLoading ? 'Loading...' : 'Generate Receipt'}
      </button>
    </div>
  );
};

export default SmallReceiptGenerator;
