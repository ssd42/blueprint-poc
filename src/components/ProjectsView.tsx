import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectsView.css';



interface Project {
  id: number;
  name: string;
  address: string;
  managerName: string;
  managerPhone: string;
}

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
  

const ProjectsView: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(sampleProjects);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: '',
    address: '',
    managerName: '',
    managerPhone: '',
  });
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newProject: Project = {
      id: Date.now(),
      ...form,
    };
    setProjects([...projects, newProject]);
    setShowModal(false);
    setForm({ name: '', address: '', managerName: '', managerPhone: '' });
  };

  const handleRowClick = (projectId: number) => {
    navigate(`/projects/${projectId}`);
  };

  return (
    <div>
      <h1>Projects</h1>
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
              />
              <input
                name="address"
                placeholder="Address"
                value={form.address}
                onChange={handleChange}
                required
              />
              <input
                name="managerName"
                placeholder="Project Manager Name"
                value={form.managerName}
                onChange={handleChange}
                required
              />
              <input
                name="managerPhone"
                placeholder="Project Manager Phone Number"
                value={form.managerPhone}
                onChange={handleChange}
                required
              />
              <div className="modal-actions">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowModal(false)}>
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
              onClick={() => handleRowClick(p.id)}
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

export default ProjectsView;
