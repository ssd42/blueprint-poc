import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchProjectById, Project } from '../services/projectService';
import './ProjectDetailView.css';

const ProjectDetailView: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!projectId) throw new Error('Invalid project ID');
        const data = await fetchProjectById(projectId);
        if (!data) throw new Error('Project not found');
        setProject(data);
      } catch (err) {
        setError('Failed to fetch project');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  if (isLoading) {
    return <div className="project-detail fade-in">Loading...</div>;
  }

  if (error || !project) {
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
