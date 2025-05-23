// src/services/projectService.ts
import axios from 'axios';

// API Types for backend communication
interface ProjectManagerCreate {
  name: string;
  phone: string;
  email?: string;
}

interface ProjectCreate {
  project_name: string;
  location: string;
  project_manager: ProjectManagerCreate;
}

interface ProjectManagerRead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  created_at: string;
  last_updated: string;
}

interface ProjectRead {
  id: string;
  project_name: string;
  location: string;
  project_manager: ProjectManagerRead;
  created_at?: string;
  last_updated?: string;
}

// Frontend Project type (for UI display)
export interface Project {
  id: string;
  name: string;
  address: string;
  managerName: string;
  managerPhone: string;
}

// Sample fallback data
const sampleProjects: Project[] = [
  {
    id: '1',
    name: "Downtown Office Renovation",
    address: "123 Main St, Springfield, IL",
    managerName: "Alice Johnson",
    managerPhone: "555-123-4567",
  },
  {
    id: '2',
    name: "Riverside Mall Expansion",
    address: "456 River Rd, Dayton, OH",
    managerName: "Carlos Mendoza",
    managerPhone: "555-234-5678",
  },
  {
    id: '3',
    name: "Greenfield Apartments",
    address: "789 Elm St, Greenfield, MA",
    managerName: "Samantha Lee",
    managerPhone: "555-345-6789",
  },
  {
    id: '4',
    name: "Tech Park Development",
    address: "321 Innovation Blvd, Austin, TX",
    managerName: "David Chen",
    managerPhone: "555-456-7890",
  },
  {
    id: '5',
    name: "Harborview Condos",
    address: "987 Ocean Dr, Miami, FL",
    managerName: "Lena Rodríguez",
    managerPhone: "555-567-8901",
  },
];

// API configuration
const API_BASE_URL = 'http://127.0.0.1:8000';
const API_ENDPOINT = '/v1/projects/';

/**
 * Fetches all projects from the API.
 */
export const fetchProjects = async (): Promise<Project[]> => {
  try {
    const response = await axios.get<ProjectRead[]>(`${API_BASE_URL}${API_ENDPOINT}`);
    return response.data.map((project) => ({
      id: project.id,
      name: project.project_name,
      address: project.location,
      managerName: project.project_manager.name,
      managerPhone: project.project_manager.phone,
    }));
  } catch (error) {
    console.error('Error fetching projects:', error);
    return sampleProjects;
  }
};

/**
 * Creates a new project.
 */
export const createProject = async (project: Omit<Project, 'id'>): Promise<Project> => {
  try {
    const projectCreate: ProjectCreate = {
      project_name: project.name,
      location: project.address,
      project_manager: {
        name: project.managerName,
        phone: project.managerPhone,
      },
    };

    const response = await axios.post<ProjectRead>(`${API_BASE_URL}${API_ENDPOINT}`, projectCreate);

    return {
      id: response.data.id,
      name: response.data.project_name,
      address: response.data.location,
      managerName: response.data.project_manager.name,
      managerPhone: response.data.project_manager.phone,
    };
  } catch (error) {
    console.error('Error creating project:', error);
    throw error;
  }
};

/**
 * Fetches a single project by ID.
 */
export const fetchProjectById = async (id: string): Promise<Project | null> => {
  try {
    const response = await axios.get<ProjectRead>(`${API_BASE_URL}${API_ENDPOINT}${id}/`);
    return {
      id: response.data.id,
      name: response.data.project_name,
      address: response.data.location,
      managerName: response.data.project_manager.name,
      managerPhone: response.data.project_manager.phone,
    };
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    return null;
  }
};
