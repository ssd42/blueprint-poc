import { v4 as uuidv4 } from 'uuid';
import blueprint1 from '../assets/blueprint1.png';

export type Mapping = {
  id: number;
  shape: 'rect';
  coords: [number, number, number, number];
  title: string;
};

export type Blueprint = {
  id: string;
  name: string;
  image: string;
  mappings: Mapping[];
};

// In a real application, this would be stored in a database
const blueprints: { [projectId: string]: Blueprint[] } = {};

export const addBlueprint = (projectId: string): Blueprint => {
  const newBlueprint: Blueprint = {
    id: uuidv4(),
    name: 'Unnamed Blueprint',
    image: blueprint1, // Using the static image for now
    mappings: [],
  };

  if (!blueprints[projectId]) {
    blueprints[projectId] = [];
  }

  blueprints[projectId].push(newBlueprint);
  return newBlueprint;
};

export const getBlueprints = (projectId: string): Blueprint[] => {
  return blueprints[projectId] || [];
};

export const updateBlueprintMappings = (
  projectId: string,
  blueprintId: string,
  mappings: Mapping[]
): void => {
  const blueprint = blueprints[projectId]?.find((bp) => bp.id === blueprintId);
  if (blueprint) {
    blueprint.mappings = mappings;
  }
};

export const deleteBlueprint = (projectId: string, blueprintId: string): void => {
  if (blueprints[projectId]) {
    blueprints[projectId] = blueprints[projectId].filter((bp) => bp.id !== blueprintId);
  }
};

export const updateBlueprintName = (
  projectId: string,
  blueprintId: string,
  name: string
): void => {
  const blueprint = blueprints[projectId]?.find((bp) => bp.id === blueprintId);
  if (blueprint) {
    blueprint.name = name || 'Unnamed Blueprint';
  }
}; 