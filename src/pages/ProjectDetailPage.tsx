import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaPlus } from 'react-icons/fa';
import { fetchProjectById, Project } from '../services/projectService';
import { Blueprint, getBlueprints, addBlueprint, updateBlueprintMappings, deleteBlueprint } from '../services/blueprintService';
import BlueprintManager from '../components/projects/BlueprintManager';
import ImageModal from '../components/common/ImageModal';
import '../styles/pages/ProjectDetailView.css';

const ProjectDetailPage: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blueprints, setBlueprints] = useState<Blueprint[]>([]);
  const [modalImageUrl, setModalImageUrl] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      try {
        if (!projectId) throw new Error('Invalid project ID');
        const data = await fetchProjectById(projectId);
        if (!data) throw new Error('Project not found');
        setProject(data);
        const blueprintData = await getBlueprints(projectId);
        setBlueprints(blueprintData);
      } catch (err) {
        setError('Failed to fetch project');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProject();
  }, [projectId]);

  const handleAddBlueprint = () => {
    if (!projectId) return;
    const newBlueprint = addBlueprint(projectId);
    setBlueprints([...blueprints, newBlueprint]);
  };

  const handleUpdateMappings = (blueprintId: string, mappings: Blueprint['mappings']) => {
    if (!projectId) return;
    updateBlueprintMappings(projectId, blueprintId, mappings);
    setBlueprints(blueprints.map(bp => 
      bp.id === blueprintId ? { ...bp, mappings } : bp
    ));
  };

  const handleDeleteBlueprint = (blueprintId: string) => {
    if (!projectId) return;
    deleteBlueprint(projectId, blueprintId);
    setBlueprints(blueprints.filter(bp => bp.id !== blueprintId));
  };

  const handleOpenImageModal = (imageUrl: string) => {
    setModalImageUrl(imageUrl);
    setIsModalOpen(true);
  };

  const handleCloseImageModal = () => {
    setIsModalOpen(false);
    setModalImageUrl(null);
  };

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
          <div className="blueprints-header">
            <h2>Project Blueprints</h2>
            <button className="add-blueprint-btn" onClick={handleAddBlueprint}>
              <FaPlus /> Add Blueprint
            </button>
          </div>
          <div className="blueprints-container">
            {blueprints.map((blueprint) => (
              projectId && (
                <BlueprintManager
                  key={blueprint.id}
                  blueprint={blueprint}
                  onUpdateMappings={(mappings) => handleUpdateMappings(blueprint.id, mappings)}
                  onDelete={() => handleDeleteBlueprint(blueprint.id)}
                  projectId={projectId}
                />
              )
            ))}
            {blueprints.length === 0 && (
              <p className="muted">No blueprints added yet. Click the button above to add one.</p>
            )}
          </div>
        </section>
        <div className="divider" />
        <section className="info-section">
          <h2>Project Permits</h2>
          <div className="permits-container">
            {project.permits && project.permits.length > 0 ? (
              <table className="permits-table">
                <thead>
                  <tr>
                    <th>Permit ID</th>
                    <th>Issued Date</th>
                    <th>Expires Date</th>
                    <th>Image</th>
                    <th>Created</th>
                    <th>Last Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {project.permits.map((permit) => (
                    <tr key={permit.id}>
                      <td className="permit-id">{permit.id}</td>
                      <td>{new Date(permit.issued_at).toLocaleDateString()}</td>
                      <td>{new Date(permit.expires_at).toLocaleDateString()}</td>
                      <td>
                        {permit.image_url ? (
                          <button 
                            onClick={() => handleOpenImageModal(permit.image_url)}
                            className="permit-image-link"
                          >
                            View Image
                          </button>
                        ) : (
                          <span className="muted">No image</span>
                        )}
                      </td>
                      <td>{new Date(permit.created_at).toLocaleDateString()}</td>
                      <td>{new Date(permit.last_updated).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="muted">No permits found for this project.</p>
            )}
          </div>
        </section>
      </main>
      
      <ImageModal
        isOpen={isModalOpen}
        onClose={handleCloseImageModal}
        imageUrl={modalImageUrl || ''}
        title="Permit Image"
      />
    </div>
  );
};

export default ProjectDetailPage;
