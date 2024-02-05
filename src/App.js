import React, { useState, useRef } from 'react';
import BillCaptureForm, { extractTextFromImage } from './BillCaptureForm';

const App = () => {
  const [capturedTexts, setCapturedTexts] = useState({
    shippingAddress: null,
    billingAddress: null,
    totalAmount: null,
    taxAmount: null,
  });

  const videoRef = useRef(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  const captureImageAndExtractText = async (category) => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise(resolve => canvas.toBlob(resolve));

      const extractedText = await extractTextFromImage(blob);

      setCapturedTexts((prevTexts) => ({
        ...prevTexts,
        [category]: extractedText,
      }));
    }
  };

  return (
    <div>
      <h1>Bill Capture App</h1>

      <button onClick={startCamera}>Start Camera</button>

      <button onClick={() => captureImageAndExtractText('shippingAddress')}>
        Capture Shipping Address
      </button>
      <button onClick={() => captureImageAndExtractText('billingAddress')}>
        Capture Billing Address
      </button>
      <button onClick={() => captureImageAndExtractText('totalAmount')}>
        Capture Total Amount
      </button>
      <button onClick={() => captureImageAndExtractText('taxAmount')}>
        Capture Tax Amount
      </button>

      <div>
        <h2>Extracted Texts:</h2>
        <p>Shipping Address: {capturedTexts.shippingAddress}</p>
        <p>Billing Address: {capturedTexts.billingAddress}</p>
        <p>Total Amount: {capturedTexts.totalAmount}</p>
        <p>Tax Amount: {capturedTexts.taxAmount}</p>
      </div>

      <video ref={videoRef} width="400" height="300" autoPlay muted className="video" />
    </div>
  );
};

export default App;
