import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/projects");
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleSubmit = async () => {
    if (!notes.trim()) {
      setError("Please enter research notes.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await axios.post("http://127.0.0.1:5000/summarize", {
        title,
        notes,
      });

      setResult(response.data.result);
      setTitle("");
      setNotes("");
      fetchProjects();
    } catch (err) {
      setError("Something went wrong. Check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/projects/${projectId}`);
      fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  return (
    <div className="app">
      <h1>UX Research Synthesizer</h1>
      <p>Turn raw user research into structured insights using AI.</p>

      <input
        type="text"
        placeholder="Project title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="title-input"
      />

      <textarea
        placeholder="Paste your research notes here..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={10}
      />

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Generate Insights"}
      </button>

      {loading && <p className="status">Analyzing research notes...</p>}
      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h2>Latest Result</h2>

          <div className="result-section">
            <h3>Summary</h3>
            <p>{result.summary}</p>
          </div>

          <div className="result-section">
            <h3>Themes</h3>
            <ul>
              {result.themes?.map((theme, index) => (
                <li key={index}>{theme}</li>
              ))}
            </ul>
          </div>

          <div className="result-section">
            <h3>Insights</h3>
            <ul>
              {result.insights?.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <div className="saved-projects">
        <h2>Saved Projects</h2>

        {projects.length === 0 ? (
          <p className="empty-state">No saved projects yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title || "Untitled Research"}</h3>
              <p className="project-date">
                {new Date(project.created_at).toLocaleString()}
              </p>

              <div className="project-notes">
                <strong>Notes:</strong>
                <p>{project.notes}</p>
              </div>

              <div className="project-result">
                <h4>Summary</h4>
                <p>{project.result?.summary}</p>

                <h4>Themes</h4>
                <ul>
                  {project.result?.themes?.map((theme, index) => (
                    <li key={index}>{theme}</li>
                  ))}
                </ul>

                <h4>Insights</h4>
                <ul>
                  {project.result?.insights?.map((insight, index) => (
                    <li key={index}>{insight}</li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => handleDelete(project.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;