import React, { useState } from "react";

const AIAssistant = ({ tasks = [], theme, darkMode }) => {
  // Task Breakdown States
  const [breakdownInput, setBreakdownInput] = useState("");
  const [breakdownList, setBreakdownList] = useState([]);

  // Priority Suggestion States
  const [suggestTitle, setSuggestTitle] = useState("");
  const [suggestDesc, setSuggestDesc] = useState("");
  const [suggestedPriority, setSuggestedPriority] = useState(null);

  // 1. Task Breakdown Generator Logic
  const handleGenerateBreakdown = (e) => {
    e.preventDefault();
    if (!breakdownInput.trim()) return;

    const query = breakdownInput.toLowerCase();
    let steps = [];

    if (query.includes("auth") || query.includes("jwt") || query.includes("login") || query.includes("register")) {
      steps = [
        { id: 1, text: "Design User Schema with email & hashed password fields", completed: false },
        { id: 2, text: "Install JWT and bcryptjs npm dependencies", completed: false },
        { id: 3, text: "Create register/login endpoints & hashing controllers", completed: false },
        { id: 4, text: "Develop authentication middleware to verify JWT headers", completed: false },
        { id: 5, text: "Configure client API client to store and send tokens", completed: false },
        { id: 6, text: "Test authentication workflows in registration and login views", completed: false },
      ];
    } else if (query.includes("api") || query.includes("backend") || query.includes("server") || query.includes("database")) {
      steps = [
        { id: 1, text: "Set up the web server package structure and configs", completed: false },
        { id: 2, text: "Configure relational or document-based database connection", completed: false },
        { id: 3, text: "Create API route paths, models, and request handlers", completed: false },
        { id: 4, text: "Define environment variables and secure keys", completed: false },
        { id: 5, text: "Implement global error handling and cors middleware", completed: false },
      ];
    } else if (query.includes("frontend") || query.includes("ui") || query.includes("react") || query.includes("design") || query.includes("style")) {
      steps = [
        { id: 1, text: "Define page layouts, colors, and responsive styles", completed: false },
        { id: 2, text: "Create reusable components and layout templates", completed: false },
        { id: 3, text: "Set up client router navigation and page paths", completed: false },
        { id: 4, text: "Connect UI triggers and form submissions to services", completed: false },
        { id: 5, text: "Optimize styles for desktop, tablet, and mobile views", completed: false },
      ];
    } else if (query.includes("deploy") || query.includes("production") || query.includes("host") || query.includes("cloud")) {
      steps = [
        { id: 1, text: "Verify environment configurations for production build", completed: false },
        { id: 2, text: "Compile assets using builder CLI", completed: false },
        { id: 3, text: "Host server and static build files on cloud platforms", completed: false },
        { id: 4, text: "Bind online database credentials and configurations", completed: false },
        { id: 5, text: "Perform live walkthrough and check page access routes", completed: false },
      ];
    } else {
      steps = [
        { id: 1, text: "Analyze the task goals and details", completed: false },
        { id: 2, text: "Outline required materials, endpoints, or pages", completed: false },
        { id: 3, text: "Build out the initial layout or framework foundations", completed: false },
        { id: 4, text: "Code the primary business logic step-by-step", completed: false },
        { id: 5, text: "Test execution flow and eliminate code edge errors", completed: false },
      ];
    }

    setBreakdownList(steps);
  };

  const toggleSubtask = (id) => {
    setBreakdownList((prev) =>
      prev.map((step) => (step.id === id ? { ...step, completed: !step.completed } : step))
    );
  };

  // 2. Priority Suggestion Rule-Based Logic
  const handleSuggestPriority = (e) => {
    e.preventDefault();
    if (!suggestTitle.trim()) return;

    const combined = `${suggestTitle} ${suggestDesc}`.toLowerCase();

    // High keywords: urgent, deadline, interview, internship
    const highKeywords = ["urgent", "deadline", "interview", "internship"];
    // Medium keywords: project, fix, build, feature, database, api
    const medKeywords = ["project", "fix", "build", "feature", "database", "api"];
    // Low keywords: learn, tutorial, watch, read, course
    const lowKeywords = ["learn", "tutorial", "watch", "read", "course"];

    let priority = "Medium"; // fallback

    const hasHigh = highKeywords.some((keyword) => combined.includes(keyword));
    const hasMed = medKeywords.some((keyword) => combined.includes(keyword));
    const hasLow = lowKeywords.some((keyword) => combined.includes(keyword));

    if (hasHigh) {
      priority = "High";
    } else if (hasLow && !hasMed) {
      priority = "Low";
    } else if (hasMed) {
      priority = "Medium";
    }

    setSuggestedPriority(priority);
  };

  // 3. Daily Planner Logic
  const pendingTasks = tasks.filter((t) => t.status !== "Completed");

  const morningTasks = pendingTasks.filter((t) => t.priority === "High");
  const afternoonTasks = pendingTasks.filter((t) => t.priority === "Medium" || !t.priority);
  const eveningTasks = pendingTasks.filter((t) => t.priority === "Low");

  return (
    <div style={{ marginBottom: "30px" }}>
      <h2 style={{ marginBottom: "15px", borderBottom: `1px solid ${theme.border}`, paddingBottom: "10px" }}>
        🤖 AI Productivity Assistant
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
        }}
      >
        {/* 1. Task Breakdown Generator */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "10px",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>⚡ Task Breakdown Generator</h3>
          <p style={{ fontSize: "0.85em", color: "#888", marginBottom: "15px" }}>
            Enter a high-level task to generate actionable steps.
          </p>
          <form onSubmit={handleGenerateBreakdown} style={{ display: "flex", gap: "8px", marginBottom: "15px" }}>
            <input
              type="text"
              placeholder="e.g. Build JWT Authentication"
              value={breakdownInput}
              onChange={(e) => setBreakdownInput(e.target.value)}
              style={{
                flex: 1,
                padding: "8px",
                borderRadius: "5px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bg,
                color: theme.text,
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px 12px",
                backgroundColor: "#3498db",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Generate
            </button>
          </form>

          {breakdownList.length > 0 && (
            <div style={{ marginTop: "5px", display: "flex", flexDirection: "column", gap: "8px" }}>
              {breakdownList.map((step) => (
                <label
                  key={step.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    cursor: "pointer",
                    fontSize: "0.9em",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={step.completed}
                    onChange={() => toggleSubtask(step.id)}
                    style={{ width: "16px", height: "16px", cursor: "pointer" }}
                  />
                  <span
                    style={{
                      textDecoration: step.completed ? "line-through" : "none",
                      color: step.completed ? "#888" : theme.text,
                    }}
                  >
                    {step.text}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 2. Priority Suggestion */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "10px",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>🎯 Priority Suggestion</h3>
          <p style={{ fontSize: "0.85em", color: "#888", marginBottom: "15px" }}>
            Get an instant priority recommendation based on keyword analysis.
          </p>
          <form onSubmit={handleSuggestPriority} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <input
              type="text"
              placeholder="Task Title"
              value={suggestTitle}
              onChange={(e) => setSuggestTitle(e.target.value)}
              required
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bg,
                color: theme.text,
              }}
            />
            <textarea
              placeholder="Task Description"
              value={suggestDesc}
              onChange={(e) => setSuggestDesc(e.target.value)}
              rows={2}
              style={{
                padding: "8px",
                borderRadius: "5px",
                border: `1px solid ${theme.border}`,
                backgroundColor: theme.bg,
                color: theme.text,
                resize: "none",
              }}
            />
            <button
              type="submit"
              style={{
                padding: "8px",
                backgroundColor: "#2ecc71",
                color: "#fff",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Analyze Priority
            </button>
          </form>

          {suggestedPriority && (
            <div style={{ marginTop: "15px", textAlign: "center" }}>
              <span style={{ fontSize: "0.9em" }}>Suggested Priority: </span>
              <strong
                style={{
                  fontSize: "1.1em",
                  padding: "4px 10px",
                  borderRadius: "12px",
                  marginLeft: "5px",
                  backgroundColor:
                    suggestedPriority === "High"
                      ? "#fadbd8"
                      : suggestedPriority === "Medium"
                      ? "#fdebd0"
                      : "#d4efdf",
                  color:
                    suggestedPriority === "High"
                      ? "#c0392b"
                      : suggestedPriority === "Medium"
                      ? "#d35400"
                      : "#27ae60",
                }}
              >
                {suggestedPriority}
              </strong>
            </div>
          )}
        </div>

        {/* 3. Daily Planner */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "10px",
            border: `1px solid ${theme.border}`,
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0" }}>📅 Recommended Daily Planner</h3>
          <p style={{ fontSize: "0.85em", color: "#888", marginBottom: "15px" }}>
            Recommended schedule structured by task priorities.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* Morning */}
            <div>
              <h4 style={{ margin: "0 0 4px 0", color: "#e74c3c", fontSize: "0.95em" }}>☀️ Morning (High Priority)</h4>
              {morningTasks.length === 0 ? (
                <p style={{ margin: 0, fontSize: "0.85em", color: "#888", fontStyle: "italic" }}>No high priority tasks scheduled</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85em" }}>
                  {morningTasks.map((t) => (
                    <li key={t._id}>{t.title}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Afternoon */}
            <div>
              <h4 style={{ margin: "0 0 4px 0", color: "#e67e22", fontSize: "0.95em" }}>🌤️ Afternoon (Medium Priority)</h4>
              {afternoonTasks.length === 0 ? (
                <p style={{ margin: 0, fontSize: "0.85em", color: "#888", fontStyle: "italic" }}>No medium priority tasks scheduled</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85em" }}>
                  {afternoonTasks.map((t) => (
                    <li key={t._id}>{t.title}</li>
                  ))}
                </ul>
              )}
            </div>

            {/* Evening */}
            <div>
              <h4 style={{ margin: "0 0 4px 0", color: "#2ecc71", fontSize: "0.95em" }}>🌙 Evening (Low Priority)</h4>
              {eveningTasks.length === 0 ? (
                <p style={{ margin: 0, fontSize: "0.85em", color: "#888", fontStyle: "italic" }}>No low priority tasks scheduled</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "0.85em" }}>
                  {eveningTasks.map((t) => (
                    <li key={t._id}>{t.title}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
