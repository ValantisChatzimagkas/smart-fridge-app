import { useState, useRef, useEffect } from 'react';
import { Camera, Image, RefreshCw, X } from 'lucide-react';

const ToggleableCameraComponent = () => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const startCamera = async () => {
    try {
      console.log("Starting camera...");
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraError(null);
      

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;

        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(err => {
            console.error("Error playing video:", err);
            setCameraError("Error starting video stream");
          });
        };
      } else {
        console.warn("videoRef.current is null in startCamera()");
      }
    } catch (err) {
      console.error('Camera error:', err);
      let errorMessage = 'Failed to access camera';

      if (err instanceof Error) {
        if (err.name === 'NotAllowedError') {
          errorMessage = 'Camera permission denied. Please allow camera access.';
        } else if (err.name === 'NotFoundError') {
          errorMessage = 'No camera device found on this device.';
        } else {
          errorMessage = `Camera error: ${err.message}`;
        }
      }

      setCameraError(errorMessage);
    }
  };

  const stopCamera = () => {
    console.log("Stopping camera...");
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const captureImage = () => {
    if (!videoRef.current || !canvasRef.current || !stream) {
      console.error("Missing video/canvas/stream");
      setCameraError("Camera not ready. Please try again.");
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (width === 0 || height === 0) {
      console.error("Video dimensions are zero");
      setCameraError("Camera not ready. Try again in a moment.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext('2d');
    if (!context) {
      console.error("Failed to get canvas context");
      setCameraError("Failed to capture image.");
      return;
    }

    context.drawImage(video, 0, 0, width, height);

    try {
      const imageDataURL = canvas.toDataURL('image/png');
      if (!imageDataURL || imageDataURL === 'data:,') {
        throw new Error('Empty image data');
      }

      setCapturedImage(imageDataURL);
      console.log("Image captured successfully");
      stopCamera();
    } catch (err) {
      console.error("Error capturing image:", err);
      setCameraError("Failed to capture image.");
    }
  };

  const toggleCamera = () => {
    if (!showCamera) {
      setShowCamera(true);
    } else {
      stopCamera();
      setCapturedImage(null);
      setShowCamera(false);
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };


  useEffect(() => {
    if (!showCamera || stream || capturedImage) return;

    const interval = setInterval(() => {
      if (videoRef.current) {
        console.log("videoRef is available, starting camera");
        startCamera();
        clearInterval(interval);
      } else {
        console.log("Waiting for videoRef to become available...");
      }
    }, 100);

    return () => clearInterval(interval);
  }, [showCamera, stream, capturedImage]);

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="relative">
      <button
        onClick={toggleCamera}
        className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700"
        title={showCamera ? "Close Camera" : "Open Camera"}
      >
        <Camera className="w-5 h-5" />
      </button>

      {showCamera && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-4 relative">
            <button 
              onClick={toggleCamera}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 p-1 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-lg font-medium mb-4 text-center">Camera</h3>

            <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden aspect-video mb-4">
              {!stream && !capturedImage && !cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white bg-gray-900">
                  <Camera className="w-12 h-12 mb-4 text-blue-500" />
                  <p className="text-center mb-4">Press the button below to start the camera</p>
                </div>
              )}

              {!capturedImage && stream && (
                <video 
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              )}

              {capturedImage && (
                <img 
                  src={capturedImage}
                  alt="Captured"
                  className="w-full h-full object-cover"
                />
              )}

              {cameraError && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white bg-gray-900">
                  <Camera className="w-12 h-12 mb-4 text-red-500" />
                  <p className="text-center mb-4">{cameraError}</p>
                  <button
                    onClick={() => {
                      setCameraError(null);
                      startCamera();
                    }}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Try Again
                  </button>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} className="hidden" />

            <div className="flex justify-center space-x-4">
              {!stream && !capturedImage && !cameraError && (
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  Start Camera
                </button>
              )}

              {!capturedImage && stream && (
                <>
                  <button
                    onClick={captureImage}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Take Photo
                  </button>

                  <button
                    onClick={stopCamera}
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                  >
                    <X className="w-5 h-5 mr-2" />
                    Cancel
                  </button>
                </>
              )}

              {capturedImage && (
                <>
                  <button
                    onClick={retakePhoto}
                    className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center"
                  >
                    <RefreshCw className="w-5 h-5 mr-2" />
                    Retake
                  </button>

                  <button
                    onClick={() => {
                      if (!capturedImage || capturedImage === 'data:,') {
                        console.error('Invalid image data');
                        setCameraError('Failed to save image: Invalid image data');
                        return;
                      }

                      try {
                        const a = document.createElement('a');
                        a.href = capturedImage;
                        a.download = `photo-${new Date().toISOString()}.png`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);

                        toggleCamera();
                      } catch (err) {
                        console.error('Error saving image:', err);
                        setCameraError('Failed to save image');
                      }
                    }}
                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center"
                  >
                    <Image className="w-5 h-5 mr-2" />
                    Save
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ToggleableCameraComponent;
