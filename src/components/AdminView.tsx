import React, { useState } from 'react';
import { useAppContext } from './AppContext';
import blueprint1 from '../assets/blueprint1.png';
import ImageMapper from 'react-img-mapper';

type Mapping = {
  id: number;
  shape: "rect";
  coords: [number, number, number, number];
  title: string;
};

const AdminView: React.FC = () => {
  const { image, setImage, mappings, setMappings } = useAppContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState<{ x: number; y: number } | null>(null);

  const handleImageSelection = () => {
    setImage(blueprint1); // Set the blueprint image.
  };

  const getTouchCoordinates = (e: React.TouchEvent | React.MouseEvent, rect: DOMRect) => {
    if ("touches" in e) {
      const touch = e.touches[0];
      return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
    } else {
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }
  };

  const handleStart = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const { x, y } = getTouchCoordinates(e, rect);
    setStartCoords({ x, y });
    setIsDrawing(true);
  };

  const handleEnd = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startCoords) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const { x, y } = getTouchCoordinates(e, rect);

    const newMapping: Mapping = {
      id: mappings.length + 1,
      shape: "rect",
      coords: [startCoords.x, startCoords.y, x, y] as [number, number, number, number],
      title: `Mapping ${mappings.length + 1}`,
    };

    setMappings([...mappings, newMapping]);
    setIsDrawing(false);
    setStartCoords(null);
  };

  const handleUndo = () => {
    if (mappings.length > 0) {
      setMappings(mappings.slice(0, -1));
    }
  };

  const map = {
    name: 'image-map',
    areas: mappings.map((mapping) => ({
      id: mapping.id.toString(),
      shape: mapping.shape,
      coords: mapping.coords,
      preFillColor: 'rgba(255, 0, 0, 0.3)',
      lineWidth: 2,
    })),
  };

  const handleAreaClick = () => {
    alert(`Clicked on area`);
  };

  return (
    <div>
      <h1>Admin View</h1>
      <button onClick={handleImageSelection}>Select Image</button>
      <button onClick={handleUndo} disabled={mappings.length === 0} style={{ marginLeft: '10px' }}>
        Undo
      </button>
      {image && (
        <div
          style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}
          onMouseDown={handleStart}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchEnd={handleEnd}
          className="non-draggable"
        >
          <ImageMapper
            src={image}
            map={map}
            onClick={() => handleAreaClick()}
            width={800}
            // Prevent default dragging behavior using CSS
            />
        </div>
      )}
      {/* CSS to prevent dragging */}
      <style>
        {`
          .non-draggable img {
            pointer-events: none;
          }
        `}
      </style>
    </div>
  );
};

export default AdminView;
