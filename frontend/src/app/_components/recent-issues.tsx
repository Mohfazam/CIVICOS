"use client";

import { motion } from "framer-motion";
import { BarChart3, MapPin } from "lucide-react";
import type { Issue } from "@/lib/cache";

export default function Issues({ recentIssues }: { recentIssues: Issue[] }) {
  const severityClasses = {
    CRITICAL: "bg-red-500/10 text-red-600",
    HIGH: "bg-orange-500/10 text-orange-600",
    MEDIUM: "bg-yellow-500/10 text-yellow-600",
    LOW: "bg-blue-500/10 text-blue-600",
  } as const;

  const statusClasses = {
    RESOLVED: "bg-green-500/10 text-green-600",
    IN_PROGRESS: "bg-yellow-500/10 text-yellow-600",
    REJECTED: "bg-red-500/10 text-red-600",
    PENDING: "bg-gray-500/10 text-gray-600",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-card border border-border rounded-lg p-6"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <BarChart3 className="text-primary-dark-blue" size={24} />
        <h2 className="text-xl font-bold">Your Recent Issues</h2>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {recentIssues.length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No issues reported yet
          </p>
        ) : (
          recentIssues.map((issue) => (
            <motion.div
              key={issue.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="border border-border rounded-lg p-4 hover:bg-muted/50 transition"
            >
              <div className="flex justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold">{issue.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mt-2">
                    <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                      {issue.category}
                    </span>

                    <span
                      className={`text-xs px-2 py-1 rounded ${
                        severityClasses[issue.severity]
                      }`}
                    >
                      {issue.severity}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mt-2 flex items-center gap-1">
                    <MapPin size={14} />
                    <span className="line-clamp-1">{issue.location}</span>
                  </p>

                  <p className="text-xs text-muted-foreground mt-1">
                    Reported: {new Date(issue.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                    statusClasses[issue.status]
                  }`}
                >
                  {issue.status.replace("_", " ")}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <button className="w-full mt-6 py-2 border border-border rounded-lg hover:bg-muted transition font-medium">
        View All Issues
      </button>
    </motion.div>
  );
}
