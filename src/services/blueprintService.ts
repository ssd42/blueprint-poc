import { v4 as uuidv4 } from 'uuid';
import blueprint1 from '../assets/blueprint1.png';

// API configuration
const API_BASE_URL = 'http://127.0.0.1:8000';
const API_ENDPOINTS = {
  UPLOAD_IMAGE: '/v1/images',
  GET_PROJECT_IMAGES: (projectId: string) => `/v1/projects/${projectId}/images`
};

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

interface BlueprintApiResponse {
  id: string;
  project_id: string;
  type: string;
  image_url: string;
  created_at: string;
  last_updated: string;
}

export const getBlueprints = async (projectId: string): Promise<Blueprint[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.GET_PROJECT_IMAGES(projectId)}?image_type=blueprint`);
    if (!response.ok) {
      throw new Error('Failed to fetch blueprints');
    }
    const data = await response.json();
    return data.map((image: BlueprintApiResponse) => ({
      id: image.id,
      name: 'Unnamed Blueprint', // Since the API doesn't provide a name, we'll use a default
      image: image.image_url,
      mappings: [], // Since the API doesn't provide mappings, we'll initialize as empty
    }));
  } catch (error) {
    console.error('Error fetching blueprints:', error);
    return [];
  }
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

export const uploadBlueprint = async (
  projectId: string,
  file: File
): Promise<Blueprint> => {
  const formData = new FormData();
  formData.append('project_id', projectId);
  formData.append('type', 'blueprint');
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.UPLOAD_IMAGE}`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Failed to upload blueprint: ${response.statusText}`);
  }

  const data = await response.json();

  const newBlueprint: Blueprint = {
    id: data.image_id,
    name: 'Unnamed Blueprint',
    image: data.image_url,
    mappings: [],
  };

  if (!blueprints[projectId]) {
    blueprints[projectId] = [];
  }

  blueprints[projectId].push(newBlueprint);
  return newBlueprint;
};

export const getPreviewUrl = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(file);
  });
};
