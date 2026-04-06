import { useEffect, useRef, useState } from "react";
import "./App.css";
import {
  fetchProjectsApi,
  summarizeApi,
  deleteProjectApi,
} from "./api";

import ResultCards from "./components/ResultCards";
import ProjectList from "./components/ProjectList";
import InsightForm from "./components/InsightForm";


function App() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [error, setError] = useState("");
  const resultRef = useRef(null);

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      const response = await fetchProjectsApi();
      setProjects(response.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
      setError("Failed to load projects.");
    } finally {
      setProjectsLoading(false);
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

    if (notes.length > 5000) {
      setError("Notes too long (max 5000 characters).");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const response = await summarizeApi({ title, notes });

      setResult(response.data.result);
      setTitle("");
      setNotes("");
      await fetchProjects();

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err) {
      setError("Something went wrong. Check backend.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Delete this project?")) return;

    try {
      setError("");
      await deleteProjectApi(projectId);
      await fetchProjects();
    } catch (err) {
      console.error("Error deleting project:", err);
      setError("Failed to delete project. Please try again.");
    }
  };

  return (
    <div className="app">
      <h1>UX Research Synthesizer</h1>
      <p>Turn raw user research into structured insights using AI.</p>

      <InsightForm
        title={title}
        setTitle={setTitle}
        notes={notes}
        setNotes={setNotes}
        loading={loading}
        handleSubmit={handleSubmit}
      />

      {error && <p className="error">{error}</p>}

      <ResultCards result={result} resultRef={resultRef} loading={loading} />

      <ProjectList
        projects={projects}
        projectsLoading={projectsLoading}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}

export default App;