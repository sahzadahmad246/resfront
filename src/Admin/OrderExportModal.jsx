import React, { useState } from 'react';
import { format } from 'date-fns';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { useSelector } from 'react-redux';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
} from '@mui/material';

const OrderExportModal = ({ isOpen, onClose, orders }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [exportType, setExportType] = useState('csv');
  const [isGenerating, setIsGenerating] = useState(false);
  const { users } = useSelector((state) => state.singleUser);

  const filterOrdersByDateRange = () => {
    if (!startDate || !endDate) return [];
    
    return orders.filter(order => {
      const orderDate = new Date(order.createdAt);
      return orderDate >= startDate && orderDate <= endDate;
    });
  };

  const generateCSVData = () => {
    const filteredOrders = filterOrdersByDateRange();
    return filteredOrders.map(order => ({
      OrderID: order._id,
      CustomerName: order.deliveryInfo.name,
      Phone: order.deliveryInfo.phone,
      Address: `${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.pincode}`,
      OrderDate: format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a"),
      TotalPrice: `₹${order.totalPrice}`,
      Status: order.orderStatus,
      PaymentStatus: order.paymentInfo.status
    }));
  };

  const generatePDF = () => {
    setIsGenerating(true);
    const filteredOrders = filterOrdersByDateRange();
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text('Orders Report', 14, 22);

    doc.setFontSize(11);
    doc.text(`From: ${format(startDate, 'dd/MM/yyyy')} To: ${format(endDate, 'dd/MM/yyyy')}`, 14, 30);

    doc.autoTable({
      head: [['Order ID', 'Customer Name', 'Phone', 'Address', 'Order Date', 'Total Price', 'Status', 'Payment Status']],
      body: filteredOrders.map(order => [
        order._id,
        order.deliveryInfo.name,
        order.deliveryInfo.phone,
        `${order.deliveryInfo.address}, ${order.deliveryInfo.city}, ${order.deliveryInfo.pincode}`,
        format(new Date(order.createdAt), "dd/MM/yyyy hh:mm a"),
        `₹${order.totalPrice}`,
        order.orderStatus,
        order.paymentInfo.status
      ]),
      startY: 35,
    });

    doc.save(`orders-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.pdf`);
    setIsGenerating(false);
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Export Orders</DialogTitle>
      <DialogContent>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <TextField
            label="Start Date"
            type="date"
            value={startDate ? format(startDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setStartDate(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '48%' }}
          />
          <TextField
            label="End Date"
            type="date"
            value={endDate ? format(endDate, 'yyyy-MM-dd') : ''}
            onChange={(e) => setEndDate(new Date(e.target.value))}
            InputLabelProps={{
              shrink: true,
            }}
            style={{ width: '48%' }}
          />
        </div>
        
        <FormControl component="fieldset">
          <FormLabel component="legend">Export Type</FormLabel>
          <RadioGroup
            row
            value={exportType}
            onChange={(e) => setExportType(e.target.value)}
          >
            <FormControlLabel value="csv" control={<Radio />} label="CSV" />
            <FormControlLabel value="pdf" control={<Radio />} label="PDF" />
          </RadioGroup>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        {exportType === 'csv' ? (
          <CSVLink
            data={generateCSVData()}
            filename={`orders-${format(startDate || new Date(), 'yyyy-MM-dd')}-to-${format(endDate || new Date(), 'yyyy-MM-dd')}.csv`}
            style={{ textDecoration: 'none' }}
          >
            <Button color="primary" variant="contained">
              Export CSV
            </Button>
          </CSVLink>
        ) : (
          <Button
            color="primary"
            variant="contained"
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating PDF...' : 'Export PDF'}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default OrderExportModal;