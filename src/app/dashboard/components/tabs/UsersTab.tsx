"use client";

import { useState, useEffect } from "react";
import { getDocuments, addDocument } from "@/lib/firestore";
import { User } from "@/types";
import LoadingSpinner from "../LoadingSpinner";

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch users function
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getDocuments<User>("users");

      if (response.success && response.data) {
        setUsers(response.data);
      } else {
        setError(response.error || "Failed to fetch users");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Unknown error occurred";
      console.error("Error fetching users:", err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Show error message
  useEffect(() => {
    if (error) {
      setMessage({ type: "error", text: error });
    }
  }, [error]);

  const handleUserAdded = async (userData: { name: string; email: string }) => {
    try {
      // Generate UID with fallback
      let uid: string;
      if (typeof crypto !== "undefined" && crypto.randomUUID) {
        uid = crypto.randomUUID();
      } else {
        // Fallback for older browsers
        uid =
          "user_" + Math.random().toString(36).substr(2, 9) + "_" + Date.now();
      }

      const response = await addDocument<User>("users", {
        uid,
        name: userData.name,
        email: userData.email,
      });

      if (response.success && response.data) {
        setUsers((prev) => [...prev, response.data!]);
        setMessage({ type: "success", text: "Agent added successfully!" });
        setTimeout(() => setMessage(null), 3000);
      } else {
        setError(response.error || "Failed to add user");
      }
    } catch (error) {
      console.error("Error adding user:", error);
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "An error occurred while adding user",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await handleUserAdded({
        name: formData.name.trim(),
        email: formData.email.trim(),
      });

      // Reset form on success
      setFormData({ name: "", email: "" });
    } catch (error) {
      console.error("Error adding user:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-6">Agents Details</h2>

      {/* Message Display */}
      {message && (
        <div
          className={`mb-6 p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-50 border border-green-200 text-green-700"
              : "bg-red-50 border border-red-200 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Add User Form */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          Add New Agent
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email address"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Adding Agent..." : "Add Agent"}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          All Agents ({users.length})
        </h3>
        {loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" color="blue" />
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-8">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500">
              No users found. Add a user to get started.
            </p>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {users.map((user) => (
                <li
                  key={user.id || user.uid}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-medium text-sm">
                              {user.name?.charAt(0)?.toUpperCase() || "?"}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500 truncate">
                            {user.email || "No email"}
                          </p>
                          <p className="text-xs text-gray-400">
                            UID: {user.uid || "No UID"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
