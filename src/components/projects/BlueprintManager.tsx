import React, { useState, useCallback } from 'react';
import ImageMapper from 'react-img-mapper';
import { FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import { updateBlueprintName } from '../../services/blueprintService';

type Mapping = {
  id: number;
  shape: 'rect';
  coords: [number, number, number, number];
  title: string;
};

type Blueprint = {
  id: string;
  name: string;
  image: string;
  mappings: Mapping[];
};

interface BlueprintManagerProps {
  blueprint: Blueprint;
  onUpdateMappings: (mappings: Mapping[]) => void;
  onDelete: () => void;
  projectId: string;
}

const BlueprintManager: React.FC<BlueprintManagerProps> = ({
  blueprint,
  onUpdateMappings,
  onDelete,
  projectId,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(blueprint.name);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startCoords, setStartCoords] = useState<{ x: number; y: number } | null>(null);
  const [currentCoords, setCurrentCoords] = useState<{ x: number; y: number } | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const handleNameEdit = () => {
    setIsEditingName(true);
  };

  const handleNameSave = () => {
    updateBlueprintName(projectId, blueprint.id, editedName);
    setIsEditingName(false);
  };

  const handleNameCancel = () => {
    setEditedName(blueprint.name);
    setIsEditingName(false);
  };

  const getLocalCoords = (e: React.TouchEvent | React.MouseEvent, rect: DOMRect) => {
    const point = 'touches' in e ? e.touches[0] : e;
    return { x: point.clientX - rect.left, y: point.clientY - rect.top };
  };

  const handleStart = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { x, y } = getLocalCoords(e, rect);
    setStartCoords({ x, y });
    setCurrentCoords({ x, y });
    setIsDrawing(true);
  };

  const handleMove = (e: React.TouchEvent<HTMLDivElement> | React.MouseEvent<HTMLDivElement>) => {
    if (!isEditing || !isDrawing || !startCoords) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const { x, y } = getLocalCoords(e, rect);
    setCurrentCoords({ x, y });
  };

  const handleEnd = () => {
    if (!isEditing || !isDrawing || !startCoords || !currentCoords) return;

    const normalizedCoords: [number, number, number, number] = [
      Math.min(startCoords.x, currentCoords.x),
      Math.min(startCoords.y, currentCoords.y),
      Math.max(startCoords.x, currentCoords.x),
      Math.max(startCoords.y, currentCoords.y),
    ];

    const newMapping: Mapping = {
      id: blueprint.mappings.length + 1,
      shape: 'rect',
      coords: normalizedCoords,
      title: `Mapping ${blueprint.mappings.length + 1}`,
    };

    onUpdateMappings([...blueprint.mappings, newMapping]);
    setIsDrawing(false);
    setStartCoords(null);
    setCurrentCoords(null);
  };

  const handleUndo = useCallback(() => {
    if (blueprint.mappings.length > 0) {
      onUpdateMappings(blueprint.mappings.slice(0, -1));
    }
  }, [blueprint.mappings, onUpdateMappings]);

  const map = {
    name: 'image-map',
    areas: blueprint.mappings.map((mapping) => ({
      id: mapping.id.toString(),
      shape: mapping.shape,
      coords: mapping.coords,
      preFillColor:
        hoveredId === mapping.id.toString()
          ? 'rgba(255, 0, 0, 0.15)'
          : 'rgba(255, 0, 0, 0.3)',
      lineWidth: 2,
    })),
  };

  return (
    <div className="blueprint-manager">
      <div className="blueprint-header">
        {isEditingName ? (
          <div className="name-edit-container">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="name-edit-input"
              autoFocus
            />
            <button className="icon-btn" onClick={handleNameSave} title="Save">
              <FaCheck />
            </button>
            <button className="icon-btn" onClick={handleNameCancel} title="Cancel">
              <FaTimes />
            </button>
          </div>
        ) : (
          <div className="blueprint-title-wrapper">
            <h3>{blueprint.name}</h3>
            <button className="icon-btn" onClick={handleNameEdit} title="Edit name">
              <FaEdit />
            </button>
          </div>
        )}
        <div className="blueprint-actions">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`edit-btn ${isEditing ? 'active' : ''}`}
          >
            <FaEdit />
          </button>
          <button onClick={onDelete} className="delete-btn">
            <FaTimes />
          </button>
        </div>
      </div>
      
      {isEditing && (
        <button
          onClick={handleUndo}
          disabled={blueprint.mappings.length === 0}
          className="undo-btn"
        >
          Undo
        </button>
      )}

      <div
        className="mapper-wrapper"
        style={{ position: 'relative', display: 'inline-block', marginTop: '20px' }}
        onMouseDown={handleStart}
        onMouseMove={handleMove}
        onMouseUp={handleEnd}
        onTouchStart={handleStart}
        onTouchMove={handleMove}
        onTouchEnd={handleEnd}
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
          src={blueprint.image}
          map={map}
          width={800}
          onMouseEnter={(area) => setHoveredId(area.id ?? null)}
          onMouseLeave={() => setHoveredId(null)}
        />
      </div>
    </div>
  );
};

export default BlueprintManager; 