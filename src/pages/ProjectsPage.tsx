import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchProjects, createProject, Project } from '../services/projectService';
import '../styles/pages/ProjectsView.css';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    address: '',
    managerName: '',
    managerPhone: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const loadProjects = async () => {
      try {
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError('Failed to load projects');
        console.error(err);
      }
    };
    loadProjects();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const newProject = await createProject({
        name: form.name,
        address: form.address,
        managerName: form.managerName,
        managerPhone: form.managerPhone,
        permits: [],
      });
      
      setProjects([...projects, newProject]);
      setShowModal(false);
      setForm({ name: '', address: '', managerName: '', managerPhone: '' });
    } catch (err) {
      setError('Failed to create project');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRowClick = (projectId: string) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div>
      <h1>Projects</h1>
      {error && <div className="error-message">{error}</div>}
      <button onClick={() => setShowModal(true)}>+ New Project</button>

      {showModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <input
                name="name"
                placeholder="Project Name"
                value={form.name}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                name="managerName"
                placeholder="Project Manager Name"
                value={form.managerName}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <input
                name="managerPhone"
                placeholder="Project Manager Phone Number"
                value={form.managerPhone}
                onChange={handleChange}
                required
                disabled={isLoading}
              />
              <div className="modal-actions">
                <button type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating...' : 'Create'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} disabled={isLoading}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Project</th>
            <th>Address</th>
            <th>Manager</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((p) => (
            <tr 
              key={p.id} 
              onClick={() => handleRowClick(p.id.toString())}
              className="clickable-row"
            >
              <td>{p.name}</td>
              <td>{p.address}</td>
              <td>{p.managerName}</td>
              <td>{p.managerPhone}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectsPage;
