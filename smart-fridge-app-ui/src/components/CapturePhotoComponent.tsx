import React, { useState } from 'react';
import Webcam from 'react-webcam';
import { Camera } from 'lucide-react';

const CameraComponent: React.FC = () => {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = React.useRef<Webcam>(null);

  const handleStartCamera = () => {
    setIsCameraActive(true);
  };

  const handleCancel = () => {
    setIsCameraActive(false);
    setCapturedImage(null);
  };

  const handleCapture = () => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImage(imageSrc);
    }
  };

  return (
    <div>
      {!isCameraActive ? (
        <div>
          <button
            onClick={handleStartCamera}
            // relative inline-flex h-6 w-11 items-center rounded-full transition-colors
            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full space-x-2 mx-auto  relative inline-flex "
          >

            <Camera className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="relative w-full max-w-md mx-auto">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{ facingMode: "user" }}
            className="w-full rounded-md border-2 border-gray-200"
          />
          <div className="absolute top-4 left-4 z-10">
            <button
              onClick={handleCancel}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full"
            >
              X
            </button>
          </div>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
            <button
              onClick={handleCapture}
              className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full"
            >
              <Camera className="w-5 h-5"/>
            </button>
          </div>
        </div>
      )}

      {capturedImage && (
        <div className="mt-8 text-center">
          <h2 className="text-lg font-semibold mb-2">Captured Image</h2>
          <img 
            src={capturedImage} 
            alt="Captured" 
            className="w-64 h-64 rounded-md border border-gray-200 object-cover" 
          />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;