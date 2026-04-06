function ProjectCard({ project, onDelete, loading }) {
  return (
    <div className="project-card">
      <h3>{project.title || "Untitled Research"}</h3>

      <p className="project-date">
        {new Date(project.created_at).toLocaleString()}
      </p>

      <div className="project-notes">
        <strong>Notes:</strong>
        <p>{project.notes}</p>
      </div>

      <div className="project-result-cards">
        <div className="project-result-card">
          <h4>Summary</h4>
          <p>{project.result?.summary || project.result?.raw}</p>
        </div>

        <div className="project-result-card">
          <h4>Themes</h4>
          <ul>
            {project.result?.themes?.map((theme, index) => (
              <li key={index}>{theme}</li>
            ))}
          </ul>
        </div>

        <div className="project-result-card">
          <h4>Insights</h4>
          <ul>
            {project.result?.insights?.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>

      <button
        onClick={() => onDelete(project.id)}
        className="delete-btn"
        disabled={loading}
      >
        Delete
      </button>
    </div>
  );
}

export default ProjectCard;