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

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setStartCoords({ x, y });
    setIsDrawing(true);
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDrawing || !startCoords) return;

    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newMapping: Mapping = {
        id: mappings.length + 1,
        shape: "rect", // Literal type
        coords: [startCoords.x, startCoords.y, x, y] as [number, number, number, number], // Tuple
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
      id: mapping.id.toString(), // Convert id to a string
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
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
        >
          <ImageMapper
            src={image}
            map={map}
            onClick={() => handleAreaClick()}
            width={800} // Set a fixed width to ensure proper rendering.
          />
        </div>
      )}
    </div>
  );
};

export default AdminView;
