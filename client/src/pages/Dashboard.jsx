import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import AIAssistant from "../components/AIAssistant";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend
} from "recharts";

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");

  const [description, setDescription] = useState("");

  const [priority, setPriority] = useState("Medium");

  const [dueDate, setDueDate] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [filter, setFilter] = useState("All");

  const [editingId, setEditingId] = useState(null);

  // Phase 2 & 3 Features

  const [darkMode, setDarkMode] = useState(false);

  // Theme Colors

  const theme = {
    bg: darkMode ? "#121212" : "#f4f7f6",

    text: darkMode ? "#ffffff" : "#333333",

    cardBg: darkMode ? "#1e1e1e" : "#ffffff",

    border: darkMode ? "#333" : "#ddd",
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) setTasks(await response.json());
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      const url = editingId
        ? `http://localhost:5000/api/tasks/${editingId}`
        : "http://localhost:5000/api/tasks";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ title, description, priority, dueDate }),
      });

      if (response.ok) {
        toast.success(editingId ? "Task updated successfully!" : "Task created successfully!");
        setTitle("");

        setDescription("");

        setPriority("Medium");

        setDueDate("");

        setEditingId(null);

        fetchTasks();
      } else {
        toast.error("Failed to save task.");
      }
    } catch (err) {
      toast.error("Error occurred while saving task.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;

    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: "DELETE",

        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        toast.success("Task deleted successfully!");
        fetchTasks();
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (err) {
      toast.error("Error deleting task.");
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/tasks/${id}/status`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        toast.success(`Task status updated to ${newStatus}`);
        fetchTasks();
      } else {
        toast.error("Failed to update status.");
      }
    } catch (err) {
      toast.error("Error updating status.");
    }
  };

  // 🔥 DRAG AND DROP LOGIC

  const onDragStart = (e, id) => e.dataTransfer.setData("taskId", id);

  const onDragOver = (e) => e.preventDefault();

  const onDrop = (e, newStatus) => {
    const id = e.dataTransfer.getData("taskId");

    handleStatusUpdate(id, newStatus);
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesFilter =
      filter === "All" ||
      task.status === filter ||
      (filter === "High Priority" && task.priority === "High");

    return matchesSearch && matchesFilter;
  });

  const getTaskDueStatus = (task) => {
    if (task.status === "Completed") return "Completed";
    if (!task.dueDate) return "Upcoming";
    const todayStr = new Date().toISOString().split("T")[0];
    const dueStr = task.dueDate.split("T")[0];
    if (dueStr < todayStr) return "Overdue";
    if (dueStr === todayStr) return "Due Today";
    return "Upcoming";
  };

  const sortedFilteredTasks = [...filteredTasks].sort((a, b) => {
    const statusA = getTaskDueStatus(a);
    const statusB = getTaskDueStatus(b);
    if (statusA === "Overdue" && statusB !== "Overdue") return -1;
    if (statusA !== "Overdue" && statusB === "Overdue") return 1;
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
  });

  // ANALYTICS CALCS
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const highPri = tasks.filter((t) => t.priority === "High").length;
  const overdue = tasks.filter((t) => getTaskDueStatus(t) === "Overdue").length;

  const completionPercent = total === 0 ? 0 : Math.round((completed / total) * 100);
  const pendingPercent = total === 0 ? 0 : Math.round((pending / total) * 100);
  const inProgressPercent = total === 0 ? 0 : Math.round((inProgress / total) * 100);

  // priority distributions
  const lowPri = tasks.filter((t) => t.priority === "Low").length;
  const medPri = tasks.filter((t) => t.priority === "Medium").length;

  // Chart data formatting
  const statusChartData = [
    { name: "Pending", value: pending, color: "#f1c40f" },
    { name: "In Progress", value: inProgress, color: "#3498db" },
    { name: "Completed", value: completed, color: "#2ecc71" },
  ].filter(d => d.value > 0);

  const priorityChartData = [
    { name: "Low", count: lowPri, fill: "#2ecc71" },
    { name: "Medium", count: medPri, fill: "#e67e22" },
    { name: "High", count: highPri, fill: "#e74c3c" },
  ];

  return (
    <div
      style={{
        backgroundColor: theme.bg,
        color: theme.text,
        minHeight: "100vh",
        padding: "20px",
        transition: "0.3s",
      }}
    >
      {/* NAVBAR & PROFILE */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          backgroundColor: theme.cardBg,
          padding: "15px 20px",
          borderRadius: "10px",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        }}
      >
        <div>
          <h2 style={{ margin: 0 }}>👋 Welcome Back, {user?.name || "User"}</h2>
          <small style={{ color: "#888", display: "block", marginTop: "4px" }}>
            You have {pending} pending tasks today
          </small>
        </div>

        <button
          onClick={() => setDarkMode(!darkMode)}
          style={{
            padding: "10px 15px",
            cursor: "pointer",
            borderRadius: "20px",
            border: "none",
            backgroundColor: darkMode ? "#f1c40f" : "#34495e",
            color: darkMode ? "#000" : "#fff",
            fontWeight: "bold",
          }}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* STATISTICS CARDS */}
      <div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6"
        style={{
          gap: "15px",
          marginBottom: "20px",
        }}
      >
        {[
          { label: "Total Tasks", val: total, color: "#3498db" },
          { label: "Pending Tasks", val: pending, color: "#f1c40f" },
          { label: "Completed Tasks", val: completed, color: "#2ecc71" },
          { label: "High Priority Tasks", val: highPri, color: "#e74c3c" },
          { label: "Overdue Tasks", val: overdue, color: "#95a5a6" },
          { label: "Completion Percentage", val: `${completionPercent}%`, color: "#9b59b6" },
        ].map((stat, i) => (
          <div
            key={i}
            style={{
              backgroundColor: theme.cardBg,
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center",
              borderLeft: `5px solid ${stat.color}`,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px 0",
                fontSize: "2em",
                color: stat.color,
              }}
            >
              {stat.val}
            </h3>
            <p style={{ margin: 0, fontWeight: "bold", fontSize: "0.95em" }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* ANALYTICS SECTION */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        {/* PIE CHART FOR STATUS & COMPLETION/PENDING % */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0", alignSelf: "flex-start" }}>Status Distribution</h3>
          {total === 0 ? (
            <p style={{ color: "#888", margin: "auto" }}>No data available to display chart</p>
          ) : (
            <div style={{ width: "100%", height: 220 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }} />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-around", width: "100%", marginTop: "10px" }}>
            <span style={{ fontSize: "0.85em" }}>🟢 Completion: <strong>{completionPercent}%</strong></span>
            <span style={{ fontSize: "0.85em" }}>🔵 In Progress: <strong>{inProgressPercent}%</strong></span>
            <span style={{ fontSize: "0.85em" }}>🟡 Pending: <strong>{pendingPercent}%</strong></span>
          </div>
        </div>

        {/* BAR CHART FOR PRIORITY DISTRIBUTION */}
        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3 style={{ margin: "0 0 15px 0" }}>Priority Distribution</h3>
          {total === 0 ? (
            <p style={{ color: "#888", margin: "auto", textAlign: "center" }}>No data available to display chart</p>
          ) : (
            <div style={{ width: "100%", height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityChartData}>
                  <XAxis dataKey="name" stroke={darkMode ? "#ccc" : "#666"} />
                  <YAxis stroke={darkMode ? "#ccc" : "#666"} allowDecimals={false} />
                  <Tooltip contentStyle={{ backgroundColor: theme.cardBg, color: theme.text, border: `1px solid ${theme.border}` }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {priorityChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      {/* AI ASSISTANT SECTION */}
      <AIAssistant tasks={tasks} theme={theme} darkMode={darkMode} />

      {/* TASK FORM & SEARCH */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "30px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>{editingId ? "Edit Task" : "Add Task"}</h3>

          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }}
          />

          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text, resize: "none" }}
          />

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }}
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              backgroundColor: "#007bff",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Save Task
          </button>
        </form>

        <div
          style={{
            backgroundColor: theme.cardBg,
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <h3>Search & Filter</h3>

          <input
            type="text"
            placeholder="🔍 Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", marginBottom: "10px", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }}
          />

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ width: "100%", padding: "8px", borderRadius: "5px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }}
          >
            <option value="All">All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="High Priority">High Priority</option>
          </select>
        </div>
      </div>

      {/* DRAG AND DROP KANBAN BOARD */}
      <div style={{ display: "flex", gap: "20px", overflowX: "auto" }}>
        {["Pending", "In Progress", "Completed"].map((status) => (
          <div
            key={status}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, status)}
            style={{
              flex: 1,
              minWidth: "250px",
              backgroundColor: theme.cardBg,
              padding: "15px",
              borderRadius: "10px",
              border: `1px solid ${theme.border}`,
            }}
          >
            <h3
              style={{
                textAlign: "center",
                paddingBottom: "10px",
                borderBottom: `2px solid ${status === "Pending" ? "#f1c40f" : status === "In Progress" ? "#3498db" : "#2ecc71"}`,
              }}
            >
              {status}
            </h3>

            {sortedFilteredTasks
              .filter((t) => t.status === status)
              .map((task) => {
                const dueStatus = getTaskDueStatus(task);
                return (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={(e) => onDragStart(e, task._id)}
                    style={{
                      backgroundColor: theme.bg,
                      padding: "15px",
                      margin: "10px 0",
                      borderRadius: "8px",
                      cursor: "grab",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      borderLeft: `5px solid ${
                        task.priority === "High"
                          ? "#e74c3c"
                          : task.priority === "Medium"
                          ? "#e67e22"
                          : "#2ecc71"
                      }`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "none";
                      e.currentTarget.style.boxShadow = "0 2px 4px rgba(0,0,0,0.05)";
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "8px" }}>
                      <h4 style={{ margin: "0 0 5px 0" }}>{task.title}</h4>
                      <span
                        style={{
                          fontSize: "0.75em",
                          padding: "2px 8px",
                          borderRadius: "12px",
                          fontWeight: "bold",
                          backgroundColor:
                            task.priority === "High"
                              ? "#fadbd8"
                              : task.priority === "Medium"
                              ? "#fdebd0"
                              : "#d4efdf",
                          color:
                            task.priority === "High"
                              ? "#c0392b"
                              : task.priority === "Medium"
                              ? "#d35400"
                              : "#27ae60",
                        }}
                      >
                        {task.priority}
                      </span>
                    </div>

                    <p style={{ margin: "0 0 10px 0", fontSize: "0.9em", color: darkMode ? "#bbb" : "#666" }}>
                      {task.description || "No description provided."}
                    </p>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center", marginBottom: "10px" }}>
                      <span
                        style={{
                          fontSize: "0.7em",
                          padding: "2px 6px",
                          borderRadius: "4px",
                          fontWeight: "bold",
                          backgroundColor:
                            task.status === "Pending"
                              ? "#fef9e7"
                              : task.status === "In Progress"
                              ? "#ebf5fb"
                              : "#e8f8f5",
                          color:
                            task.status === "Pending"
                              ? "#f1c40f"
                              : task.status === "In Progress"
                              ? "#2980b9"
                              : "#27ae60",
                        }}
                      >
                        {task.status}
                      </span>

                      {task.dueDate && dueStatus !== "Completed" && (
                        <span
                          style={{
                            fontSize: "0.7em",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            fontWeight: "bold",
                            backgroundColor:
                              dueStatus === "Overdue"
                                ? "#fadbd8"
                                : dueStatus === "Due Today"
                                ? "#fef9e7"
                                : "#d4efdf",
                            color:
                              dueStatus === "Overdue"
                                ? "#c0392b"
                                : dueStatus === "Due Today"
                                ? "#d35400"
                                : "#27ae60",
                          }}
                        >
                          {dueStatus === "Overdue"
                            ? "🔴 Overdue"
                            : dueStatus === "Due Today"
                            ? "🟡 Due Today"
                            : "🟢 Upcoming"}
                        </span>
                      )}
                    </div>

                    {task.dueDate && (
                      <p
                        style={{
                          margin: 0,
                          fontSize: "0.8em",
                          color:
                            dueStatus === "Overdue"
                              ? "red"
                              : theme.text,
                        }}
                      >
                        📅 {task.dueDate.split("T")[0]}
                      </p>
                    )}

                    <div
                      style={{ marginTop: "10px", display: "flex", gap: "5px" }}
                    >
                      <button
                        onClick={() => {
                          setEditingId(task._id);
                          setTitle(task.title);
                          setDescription(task.description || "");
                          setPriority(task.priority);
                          setDueDate(
                            task.dueDate ? task.dueDate.split("T")[0] : "",
                          );
                          window.scrollTo(0, 0);
                        }}
                        style={{ padding: "5px", flex: 1, cursor: "pointer", borderRadius: "4px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg, color: theme.text }}
                      >
                        ✏️
                      </button>

                      <button
                        onClick={() => handleDelete(task._id)}
                        style={{ padding: "5px", flex: 1, color: "red", cursor: "pointer", borderRadius: "4px", border: `1px solid ${theme.border}`, backgroundColor: theme.bg }}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
