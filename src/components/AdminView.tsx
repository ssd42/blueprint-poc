import React, { useState, useCallback } from 'react';
import { useAppContext } from './AppContext';
import blueprint1 from '../assets/blueprint1.png';
import ImageMapper from 'react-img-mapper';

type Mapping = {
  id: number;
  shape: 'rect';
  coords: [number, number, number, number];
  title: string;
};

type PointerEvent = React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>;

const AdminView: React.FC = () => {
  const { image, setImage, mappings, setMappings } = useAppContext();
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState<{ x: number; y: number } | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ x: number; y: number } | null>(null);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageSelection = useCallback(() => {
    setImage(blueprint1);
    setIsImageLoaded(true);
  }, [setImage]);

  const getLocalCoords = (e: React.TouchEvent | React.MouseEvent, rect: DOMRect) => {
    const point = 'touches' in e ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const handleStart = (e: PointerEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const { x, y } = getLocalCoords(e, rect);
    setStartCoords({ x, y });
    setCurrentCoords({ x, y });
    setIsDrawing(true);
  };

  const handleMove = (e: PointerEvent) => {
    if (!isDrawing || !startCoords) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { x, y } = getLocalCoords(e, rect);
    setCurrentCoords({ x, y });
  };

  const handleEnd = () => {
    if (!isDrawing || !startCoords || !currentCoords) return;

    const normalizedCoords: [number, number, number, number] = [
      Math.min(startCoords.x, currentCoords.x),
      Math.min(startCoords.y, currentCoords.y),
      Math.max(startCoords.x, currentCoords.x),
      Math.max(startCoords.y, currentCoords.y),
    ];

    const newMapping: Mapping = {
      id: mappings.length + 1,
      shape: 'rect',
      coords: normalizedCoords,
      title: `Mapping ${mappings.length + 1}`,
    };

    setMappings([...mappings, newMapping]);
    setIsDrawing(false);
    setStartCoords(null);
    setCurrentCoords(null);
  };

  const handleUndo = useCallback(() => {
    if (mappings.length > 0) {
      setMappings(mappings.slice(0, -1));
    }
  }, [mappings, setMappings]);

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

  const handleAreaClick = useCallback(() => {
    alert('Clicked on area');
  }, []);

  return (
    <div>
      <h1>Admin View</h1>
      {!isImageLoaded && <button onClick={handleImageSelection}>Select Image</button>}
      <button
        onClick={handleUndo}
        disabled={mappings.length === 0}
        style={{ marginLeft: '10px' }}
      >
        Undo
      </button>

      {image && (
        <div
          className="mapper-wrapper"
          style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          aria-label="Blueprint with clickable mapping areas"
        >
          {isDrawing && startCoords && currentCoords && (
            <div
              style={{
                position: 'absolute',
                border: '2px dashed #ff0000',
                backgroundColor: 'rgba(255,0,0,0.1)',
                left: `${Math.min(startCoords.x, currentCoords.x)}px`,
                top: `${Math.min(startCoords.y, currentCoords.y)}px`,
                width: `${Math.abs(startCoords.x - currentCoords.x)}px`,
                height: `${Math.abs(startCoords.y - currentCoords.y)}px`,
                zIndex: 10,
                pointerEvents: 'none',
              }}
            />
          )}

          <ImageMapper
            src={image}
            map={map}
            onClick={handleAreaClick}
            width={800}
          />
        </div>
      )}
    </div>
  );
};

export default AdminView;
