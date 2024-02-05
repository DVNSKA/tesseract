import React, { useRef, useEffect } from 'react';
import Tesseract from 'tesseract.js';

const extractTextFromImage = async (image) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const img = new Image();
  const dataUrl = URL.createObjectURL(image);
  img.src = dataUrl;

  await new Promise(resolve => {
    img.onload = resolve;
  });

  canvas.width = img.width;
  canvas.height = img.height;
  context.drawImage(img, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise(resolve => canvas.toBlob(resolve));

  try {
    const { data: { text } } = await Tesseract.recognize(
      blob,
      'eng',
    );

    return text;
  } catch (error) {
    console.error('Error during OCR:', error);
    return '';
  } finally {
    URL.revokeObjectURL(dataUrl);
  }
};

const BillCaptureForm = ({ onCapture }) => {
  const videoRef = useRef(null);

  useEffect(() => {
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

    startCamera();

    return () => {
      if (videoRef.current) {
        const stream = videoRef.current.srcObject;
        if (stream) {
          const tracks = stream.getTracks();
          tracks.forEach(track => track.stop());
        }
      }
    };
  }, []);

  const handleCapture = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise(resolve => canvas.toBlob(resolve));

      onCapture(blob);
    }
  };

  return (
    <div>
      <video ref={videoRef} width="400" height="300" autoPlay muted className="video" />
      <p>Click the "Capture" button to capture from the camera.</p>
      <button onClick={handleCapture}>
        Capture Image
      </button>
    </div>
  );
};

export { extractTextFromImage };
export default BillCaptureForm;
