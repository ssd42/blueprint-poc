import React, { useRef, useState } from 'react';
import { useAppContext } from './AppContext';
import ImageMapper from 'react-img-mapper';

const UserView: React.FC = () => {
  const { image, mappings, associations, setAssociations } = useAppContext();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState<number | null>(null);
  const [isUsingFrontCamera, setIsUsingFrontCamera] = useState(false);

  const openCamera = async (mappingId: number, frontCamera: boolean = false) => {
    setSelectedMapping(mappingId);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: frontCamera ? 'user' : 'environment', // Toggle front or back camera
        },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraOpen(true);
    } catch (err) {
      console.error('Failed to access camera:', err);
    }
  };

  const switchCamera = async () => {
    const tracks = (videoRef.current?.srcObject as MediaStream)?.getTracks();
    tracks?.forEach((track) => track.stop()); // Stop current stream

    // Toggle between front and back cameras
    setIsUsingFrontCamera((prev) => !prev);

    // Reopen the camera with the new setting
    if (selectedMapping !== null) {
      await openCamera(selectedMapping, !isUsingFrontCamera);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && selectedMapping !== null) {
      const canvas = document.createElement('canvas');
      const video = videoRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const photoData = canvas.toDataURL('image/png');
      setAssociations((prev) => ({ ...prev, [selectedMapping]: photoData }));
      setCameraOpen(false);

      const tracks = (video.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };

  const map = {
    name: 'image-map',
    areas: mappings.map((mapping) => ({
      id: mapping.id.toString(),
      shape: mapping.shape,
      coords: mapping.coords,
      preFillColor: associations[mapping.id]
        ? 'rgba(0, 255, 0, 0.3)' // Green if associated
        : 'rgba(255, 0, 0, 0.3)', // Red if not associated
      lineWidth: 2,
    })),
  };

  return (
    <div>
      <h1>User View</h1>
      {image ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <ImageMapper
            src={image}
            map={map}
            onClick={(area) => area.id && openCamera(parseInt(area.id, 10))}
            width={800}
          />
        </div>
      ) : (
        <p>Please select an image in the Admin View first.</p>
      )}
      {cameraOpen && (
        <div>
          <video ref={videoRef} style={{ width: '100%' }} />
          <div>
            <button onClick={capturePhoto}>Capture Photo</button>
            <button onClick={switchCamera}>
              Switch to {isUsingFrontCamera ? 'Back' : 'Front'} Camera
            </button>
          </div>
        </div>
      )}
      <h2>Photo Associations</h2>
      <ul>
        {Object.entries(associations).map(([id, photo]) => (
          <li key={id}>
            Mapping {id}: <img src={photo} alt={`Mapping ${id}`} style={{ width: '100px' }} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserView;
