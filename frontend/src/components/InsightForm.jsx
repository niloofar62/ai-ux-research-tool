function InsightForm({
  title,
  setTitle,
  notes,
  setNotes,
  loading,
  handleSubmit,
  maxChars = 5000,
}) {
  return (
    <div className="form-section">
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

      <p className="char-count">
        {notes.length} / {maxChars}
      </p>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Analyzing..." : "Generate Insights"}
      </button>
    </div>
  );
}

export default InsightForm;