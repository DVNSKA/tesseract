// src/components/BillDetails.js
import React from 'react';

const BillDetails = ({ details }) => {
  return (
    <div>
      <h2>Shipping Address: {details.shippingAddress}</h2>
      <h2>Billing Address: {details.billingAddress}</h2>
      <h2>Total Amount: {details.totalAmount}</h2>
      <h2>Tax Amount: {details.taxAmount}</h2>
    </div>
  );
};

export default BillDetails;
