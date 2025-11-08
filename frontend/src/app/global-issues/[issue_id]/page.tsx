"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Navbar } from "@/app/_components/navbar";
import { Footer } from "@/app/_components/footer";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  User,
  Users,
  Mail,
  Phone,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  ArrowUp,
  MessageSquare,
  Send,
} from "lucide-react";

interface Citizen {
  id: string;
  name: string;
  email: string;
  constituency: string;
}

interface MLA {
  id: string;
  name: string;
  party: string;
  constituency: string;
  email: string;
  phone: string | null;
  rating: number | null;
}

interface Comment {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    email: string;
    constituency: string;
    type: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Upvote {
  citizen: {
    id: string;
    name: string;
    constituency: string;
  };
  upvotedAt: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: "PENDING" | "IN_PROGRESS" | "RESOLVED";
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  upvoteCount: number;
  hasUpvoted: boolean;
  citizenId: string;
  mlaId: string | null;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
  citizen: Citizen;
  mla: MLA | null;
  organization: any | null;
  comments: Comment[];
  commentCount: number;
  upvotes: Upvote[];
}

export default function IssueDetailPage() {
  const router = useRouter();
  const params = useParams();
  const issueId = params.issue_id as string;

  const [issue, setIssue] = useState<Issue | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [citizenId, setCitizenId] = useState<string>("");

  useEffect(() => {
    // Get citizen ID from localStorage
    const storedCitizenId = localStorage.getItem("id");
    if (storedCitizenId) {
      setCitizenId(storedCitizenId);
    }
  }, []);

  useEffect(() => {
    if (issueId) {
      fetchIssueDetail();
    }
  }, [issueId]);

  const fetchIssueDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `https://civiciobackend.vercel.app/api/v1/citizen/issue/${issueId}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch issue details");
      }

      const data = await response.json();

      if (data.success) {
        setIssue(data.issue);
      } else {
        throw new Error("API returned unsuccessful response");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleUpvote = async () => {
    if (!citizenId) {
      alert("Please login to upvote");
      return;
    }

    setIsUpvoting(true);
    try {
      const response = await fetch(
        `https://civiciobackend.vercel.app/api/v1/citizen/issue/${issueId}/upvote`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            citizenId: citizenId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upvote");
      }

      const data = await response.json();
      
      if (data.success) {
        // Refresh issue to get updated upvote count and status
        await fetchIssueDetail();
      } else {
        throw new Error(data.message || "Failed to upvote");
      }
    } catch (err) {
      console.error("Upvote error:", err);
      alert(err instanceof Error ? err.message : "Failed to upvote. Please try again.");
    } finally {
      setIsUpvoting(false);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (!citizenId) {
      alert("Please login to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Posting comment:", {
        issueId,
        content: newComment.trim(),
        authorType: "CITIZEN",
        authorId: citizenId,
      });

      const response = await fetch(
        `https://civiciobackend.vercel.app/api/v1/citizen/issue/${issueId}/comment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: newComment.trim(),
            authorType: "CITIZEN",
            authorId: citizenId,
          }),
        }
      );

      const data = await response.json();
      console.log("Comment response:", data);

      if (!response.ok) {
        throw new Error(data.message || `Server error: ${response.status}`);
      }
      
      if (data.success) {
        setNewComment("");
        // Refresh issue to get updated comments
        await fetchIssueDetail();
      } else {
        throw new Error(data.message || "Failed to post comment");
      }
    } catch (err) {
      console.error("Comment error:", err);
      alert(err instanceof Error ? err.message : "Failed to post comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return "bg-red-100 text-red-800 border-red-300";
      case "HIGH":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "LOW":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return <CheckCircle className="w-5 h-5" />;
      case "IN_PROGRESS":
        return <Clock className="w-5 h-5" />;
      case "PENDING":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "RESOLVED":
        return "bg-green-100 text-green-800 border-green-300";
      case "IN_PROGRESS":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "PENDING":
        return "bg-gray-100 text-gray-800 border-gray-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMins < 1) return "Just now";
    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const openInGoogleMaps = () => {
    if (issue?.latitude && issue?.longitude) {
      window.open(
        `https://www.google.com/maps?q=${issue.latitude},${issue.longitude}`,
        "_blank"
      );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading issue details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !issue) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
            <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              {error || "Issue not found"}
            </h2>
            <button
              onClick={() => router.back()}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Go Back
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            <span>Back to Issues</span>
          </motion.button>

          {/* Issue Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md p-6 mb-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900 flex-1">
                {issue.title}
              </h1>
              <div className="flex gap-2">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(
                    issue.severity
                  )}`}
                >
                  {issue.severity}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 ${getStatusColor(
                    issue.status
                  )}`}
                >
                  {getStatusIcon(issue.status)}
                  {issue.status.replace("_", " ")}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-500 flex-wrap">
              <div className="flex items-center gap-1">
                <Calendar size={16} />
                <span>Created: {formatDate(issue.createdAt)}</span>
              </div>
              <span className="px-2 py-1 bg-gray-100 rounded-full text-xs font-medium">
                {issue.category}
              </span>
              <button
                onClick={handleUpvote}
                disabled={isUpvoting}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  issue.hasUpvoted
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-500 hover:text-blue-600"
                }`}
              >
                <ArrowUp size={18} className={isUpvoting ? "animate-bounce" : ""} />
                <span className="font-semibold">{issue.upvoteCount}</span>
                <span className="text-sm">{issue.hasUpvoted ? "Upvoted" : "Upvote"}</span>
              </button>
              <div className="flex items-center gap-1 text-gray-600">
                <MessageSquare size={14} />
                <span className="text-xs font-medium">{issue.commentCount}</span>
              </div>
            </div>
          </motion.div>

          {/* Main Content Grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Left Column - Image & Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="md:col-span-2 space-y-6"
            >
              {/* Image */}
              {issue.mediaUrl && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src={issue.mediaUrl}
                    alt={issue.title}
                    className="w-full h-96 object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-gray-700 leading-relaxed">
                  {issue.description}
                </p>
              </div>

              {/* Location */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                  <MapPin size={20} />
                  Location
                </h2>
                <p className="text-gray-700 mb-3">{issue.location}</p>
                {issue.latitude && issue.longitude && (
                  <button
                    onClick={openInGoogleMaps}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    <ExternalLink size={16} />
                    Open in Google Maps
                  </button>
                )}
              </div>

              {/* Comments Section */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <MessageSquare size={20} />
                  Comments ({issue.commentCount})
                </h2>

                {/* Comment Form */}
                <form onSubmit={handleCommentSubmit} className="mb-6">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!newComment.trim() || isSubmitting}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Posting...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Post Comment
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                  {issue.comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    issue.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="border-l-2 border-blue-200 pl-4 py-2"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-semibold text-sm">
                              {comment.author.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {comment.author.constituency} • {formatRelativeTime(comment.createdAt)}
                            </p>
                          </div>
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded-full">
                            {comment.author.type}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{comment.content}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Upvotes Section */}
              {issue.upvotes.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <ArrowUp size={20} />
                    Upvotes ({issue.upvoteCount})
                  </h2>
                  <div className="space-y-2">
                    {issue.upvotes.map((upvote, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {upvote.citizen.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {upvote.citizen.constituency}
                          </p>
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatRelativeTime(upvote.upvotedAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Right Column - Reporter & MLA Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              {/* Reporter Info */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <User size={20} />
                  Reported By
                </h2>
                <div className="space-y-2">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{issue.citizen.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium text-sm">{issue.citizen.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Constituency</p>
                    <p className="font-medium">{issue.citizen.constituency}</p>
                  </div>
                </div>
              </div>

              {/* MLA Info */}
              {issue.mla && (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Users size={20} />
                    Assigned MLA
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-lg">{issue.mla.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Party</p>
                      <p className="font-medium">{issue.mla.party}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Constituency</p>
                      <p className="font-medium">{issue.mla.constituency}</p>
                    </div>
                    <div className="pt-3 border-t border-gray-100 space-y-2">
                      <a
                        href={`mailto:${issue.mla.email}`}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                      >
                        <Mail size={14} />
                        {issue.mla.email}
                      </a>
                      {issue.mla.phone && (
                        <a
                          href={`tel:${issue.mla.phone}`}
                          className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Phone size={14} />
                          {issue.mla.phone}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Timeline */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-lg font-semibold mb-4">Timeline</h2>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <div className="w-0.5 h-full bg-gray-200"></div>
                    </div>
                    <div className="pb-4">
                      <p className="text-sm font-medium">Issue Created</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(issue.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Last Updated</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(issue.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}