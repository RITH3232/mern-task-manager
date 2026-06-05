import { Trash2, CheckCircle, Circle } from "lucide-react";

export default function TaskCard({ task, onUpdate, onDelete }) {
  const priorityColors = {
    High: "bg-red-100 text-red-800",
    Medium: "bg-yellow-100 text-yellow-800",
    Low: "bg-green-100 text-green-800",
  };

  return (
    <div
      className={`bg-white p-5 rounded-xl shadow-sm border ${task.status === "Completed" ? "border-green-200 opacity-75" : "border-gray-200"} transition-all hover:shadow-md`}
    >
      <div className="flex justify-between items-start mb-3">
        <h3
          className={`font-semibold text-lg ${task.status === "Completed" ? "line-through text-gray-500" : "text-gray-900"}`}
        >
          {task.title}
        </h3>
        <span
          className={`text-xs font-medium px-2.5 py-1 rounded-full ${priorityColors[task.priority]}`}
        >
          {task.priority}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-4">{task.description}</p>

      <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
        <button
          onClick={() =>
            onUpdate(task._id, {
              status: task.status === "Completed" ? "Pending" : "Completed",
            })
          }
          className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${task.status === "Completed" ? "text-green-600" : "text-gray-500 hover:text-blue-600"}`}
        >
          {task.status === "Completed" ? (
            <CheckCircle size={18} />
          ) : (
            <Circle size={18} />
          )}
          {task.status === "Completed" ? "Completed" : "Mark Done"}
        </button>

        <button
          onClick={() => onDelete(task._id)}
          className="text-gray-400 hover:text-red-600 transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </div>
  );
}
