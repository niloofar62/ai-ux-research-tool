function ResultCards({ result, title = "Latest Result", resultRef = null, loading = false }) {
  if (loading) {
    return (
      <div className="result" ref={resultRef}>
        <h2>{title}</h2>
        <div className="result-skeleton">Analyzing...</div>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="result" ref={resultRef}>
      <h2>{title}</h2>

      <div className="result-cards">
        <div className="result-card">
          <h3>Summary</h3>
          <p>{result.summary}</p>
        </div>

        <div className="result-card">
          <h3>Themes</h3>
          <ul>
            {result.themes?.map((theme, index) => (
              <li key={index}>{theme}</li>
            ))}
          </ul>
        </div>

        <div className="result-card">
          <h3>Insights</h3>
          <ul>
            {result.insights?.map((insight, index) => (
              <li key={index}>{insight}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default ResultCards;