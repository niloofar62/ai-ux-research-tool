import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState("");
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
    setResult("");

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

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <h2>Latest Result</h2>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
            {result}
          </div>
        </div>
      )}

      <div className="saved-projects">
        <h2>Saved Projects</h2>
        {projects.length === 0 ? (
          <p>No projects saved yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="project-card">
              <h3>{project.title || "Untitled Research"}</h3>
              <p className="project-date">
                {new Date(project.created_at).toLocaleString()}
              </p>
              <p>
                <strong>Notes:</strong> {project.notes}
              </p>
              <div className="project-result">
                <strong>AI Output:</strong>
                <div style={{ whiteSpace: "pre-wrap", marginTop: "8px" }}>
                  {project.result}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;