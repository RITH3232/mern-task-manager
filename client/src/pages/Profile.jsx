import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { User, Mail, Calendar, CheckCircle, Clock, BarChart2 } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  const [taskStats, setTaskStats] = useState({ total: 0, completed: 0, pending: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:5000/api/tasks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.ok) {
          const tasks = await response.json();
          const total = tasks.length;
          const completed = tasks.filter((t) => t.status === "Completed").length;
          const pending = tasks.filter((t) => t.status === "Pending").length;
          setTaskStats({ total, completed, pending });
        }
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };
    fetchStats();
  }, []);

  const joinedDate = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not Available";

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 md:p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
      {/* Header Banner */}
      <div className="relative bg-gradient-to-r from-blue-500 to-indigo-600 h-32 rounded-t-2xl -mx-6 -mt-6 md:-mx-8 md:-mt-8 flex items-end p-6">
        <div className="flex items-center gap-4 translate-y-10 md:translate-y-12">
          <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-3xl md:text-4xl font-bold text-blue-600 uppercase">
              {user?.name ? user.name.charAt(0) : "U"}
            </span>
          </div>
          <div className="mb-2">
            <h1 className="text-xl md:text-2xl font-bold text-white drop-shadow-md">
              {user?.name}
            </h1>
            <p className="text-sm text-blue-100">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Spacer for avatar alignment */}
      <div className="h-14 md:h-16"></div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-6">
        {/* User Details Details Card */}
        <div className="md:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
            <User className="text-blue-500" size={20} /> Personal Information
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <Mail className="text-gray-400" size={20} />
              <div>
                <span className="text-xs text-gray-500 block">Email Address</span>
                <span className="text-sm font-medium text-gray-800">{user?.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
              <Calendar className="text-gray-400" size={20} />
              <div>
                <span className="text-xs text-gray-500 block">Member Since</span>
                <span className="text-sm font-medium text-gray-800">{joinedDate}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Task Stats Card Widget */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center gap-2">
            <BarChart2 className="text-blue-500" size={20} /> Task Analytics
          </h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center p-3 bg-blue-50 text-blue-800 rounded-xl border border-blue-100">
              <span className="flex items-center gap-2 font-medium">
                <Clock size={18} /> Total Tasks
              </span>
              <span className="text-lg font-bold">{taskStats.total}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-yellow-50 text-yellow-800 rounded-xl border border-yellow-100">
              <span className="flex items-center gap-2 font-medium">
                <Clock size={18} /> Pending Tasks
              </span>
              <span className="text-lg font-bold">{taskStats.pending}</span>
            </div>

            <div className="flex justify-between items-center p-3 bg-green-50 text-green-800 rounded-xl border border-green-100">
              <span className="flex items-center gap-2 font-medium">
                <CheckCircle size={18} /> Completed Tasks
              </span>
              <span className="text-lg font-bold">{taskStats.completed}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
