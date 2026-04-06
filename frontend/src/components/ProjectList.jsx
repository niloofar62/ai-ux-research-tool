import ProjectCard from "./ProjectCard";

function ProjectList({ projects, projectsLoading, onDelete, loading }) {
  return (
    <div className="saved-projects">
      <h2>Saved Projects</h2>

      {projectsLoading ? (
        <p className="status">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="empty-state">No saved projects yet.</p>
      ) : (
        projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onDelete={onDelete}
            loading={loading}
          />
        ))
      )}
    </div>
  );
}

export default ProjectList;