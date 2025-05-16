import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './ProjectDetailView.css';

interface Project {
  id: number;
  name: string;
  address: string;
  managerName: string;
  managerPhone: string;
}

// This would typically come from an API or database
const sampleProjects: Project[] = [
  {
    id: 1,
    name: "Downtown Office Renovation",
    address: "123 Main St, Springfield, IL",
    managerName: "Alice Johnson",
    managerPhone: "555-123-4567",
  },
  {
    id: 2,
    name: "Riverside Mall Expansion",
    address: "456 River Rd, Dayton, OH",
    managerName: "Carlos Mendoza",
    managerPhone: "555-234-5678",
  },
  {
    id: 3,
    name: "Greenfield Apartments",
    address: "789 Elm St, Greenfield, MA",
    managerName: "Samantha Lee",
    managerPhone: "555-345-6789",
  },
  {
    id: 4,
    name: "Tech Park Development",
    address: "321 Innovation Blvd, Austin, TX",
    managerName: "David Chen",
    managerPhone: "555-456-7890",
  },
  {
    id: 5,
    name: "Harborview Condos",
    address: "987 Ocean Dr, Miami, FL",
    managerName: "Lena Rodríguez",
    managerPhone: "555-567-8901",
  },
];

const ProjectDetailView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  
  const project = sampleProjects.find(p => p.id === Number(projectId));

  if (!project) {
    return (
      <div className="project-detail fade-in">
        <header className="project-header">
          <button className="back-btn" onClick={() => navigate('/projects')} title="Back to Projects">
            <FaArrowLeft />
          </button>
          <h1 className="project-title">Project Not Found</h1>
        </header>
      </div>
    );
  }

  return (
    <div className="project-detail fade-in">
      <header className="project-header">
        <button className="back-btn" onClick={() => navigate('/projects')} title="Back to Projects">
          <FaArrowLeft />
        </button>
        <h1 className="project-title">{project.name}</h1>
      </header>
      <main className="project-info">
        <section className="info-section">
          <h2>Project Details</h2>
          <dl className="info-grid">
            <div className="info-item">
              <dt>Address:</dt>
              <dd>{project.address}</dd>
            </div>
            <div className="info-item">
              <dt>Project Manager:</dt>
              <dd>{project.managerName}</dd>
            </div>
            <div className="info-item">
              <dt>Contact:</dt>
              <dd>{project.managerPhone}</dd>
            </div>
          </dl>
        </section>
        <div className="divider" />
        <section className="info-section">
          <h2>Project Images</h2>
          <p className="muted">Images will be displayed here in the future.</p>
        </section>
      </main>
    </div>
  );
};

export default ProjectDetailView; 