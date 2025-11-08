"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/app/_components/navbar";
import { Footer } from "@/app/_components/footer";
import { motion } from "framer-motion";
import {
  LogOut,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Clock,
  MapPin,
  TrendingUp,
  Mail,
  Phone,
  Globe,
  User,
} from "lucide-react";
import { useUserDetails } from "@/lib/cache/index";
import Issues from "@/app/_components/recent-issues";
import GlobalIssues from "@/app/_components/global-issues";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"global" | "recent">("global");

  useEffect(() => {
    setIsClient(true);
    const storedEmail = localStorage.getItem("email");
    const token = localStorage.getItem("token");
    const id = localStorage.getItem("id");

    if (storedEmail) {
      setEmail(storedEmail);
    }

    if (!token || !id) {
      router.push("/login");
    }
  }, [router]);

  const { data: user, isLoading, isError } = useUserDetails(email);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("id");
    localStorage.removeItem("name");
    localStorage.removeItem("constituency");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("mlaId");
    router.push("/login");
  };

  if (!isClient || !email || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Error fetching user data. Please login again.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  const totalIssues = user.issues?.length || 0;
  const resolvedIssues =
    user.issues?.filter((i) => i.status === "RESOLVED").length || 0;
  const inProgressIssues =
    user.issues?.filter((i) => i.status === "IN_PROGRESS").length || 0;
  const pendingIssues =
    user.issues?.filter((i) => i.status === "PENDING").length || 0;

  const mockStats = [
    {
      label: "Issues Reported",
      value: totalIssues.toString(),
      icon: AlertCircle,
      color: "text-red-500",
    },
    {
      label: "Resolved",
      value: resolvedIssues.toString(),
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      label: "In Progress",
      value: inProgressIssues.toString(),
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      label: "Pending",
      value: pendingIssues.toString(),
      icon: TrendingUp,
      color: "text-blue-500",
    },
  ];

  const recentIssues = user.issues?.slice(0, 5) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-between items-center mb-8"
          >
            <div>
              <h1 className="text-3xl font-bold">Welcome, {user.name}! 👋</h1>
              <p className="text-muted-foreground mt-2">
                Track your civic contributions
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition font-medium"
            >
              <LogOut size={20} />
              Logout
            </button>
          </motion.div>

          {/* User Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-lg p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Profile Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="font-semibold">{user.name}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-semibold">{user.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Constituency
                    </p>
                    <p className="font-semibold">{user.constituency}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-4">
                  Your MLA
                </h3>
                <div className="space-y-3">
                  {!user.currentMLA ? (
                    <p className="text-sm text-muted-foreground">
                      No MLA assigned
                    </p>
                  ) : (
                    <div className="p-4 border border-border rounded-lg bg-muted/30">
                      <p className="font-semibold text-lg">
                        {user.currentMLA.name}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {user.currentMLA.party}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                        <Mail size={12} />
                        {user.currentMLA.email}
                      </p>
                      {user.currentMLA.phone && (
                        <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          <Phone size={12} />
                          {user.currentMLA.phone}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Constituency: {user.currentMLA.constituency}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            {mockStats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-card border border-border rounded-lg p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <stat.icon className={`${stat.color}`} size={24} />
                </div>
                <p className="text-muted-foreground text-sm">{stat.label}</p>
                <p className="text-3xl font-bold mt-2">{stat.value}</p>
              </motion.div>
            ))}
          </div>

          {/* Tabs Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            {/* Tab Headers */}
            <div className="flex gap-4 border-b border-border mb-6">
              <button
                onClick={() => setActiveTab("global")}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
                  activeTab === "global"
                    ? "text-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Globe size={20} />
                Global Issues
                {activeTab === "global" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
              <button
                onClick={() => setActiveTab("recent")}
                className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors relative ${
                  activeTab === "recent"
                    ? "text-blue-600"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <User size={20} />
                My Recent Issues
                {activeTab === "recent" && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                  />
                )}
              </button>
            </div>

            {/* Tab Content */}
            <div className="mt-6">
              {activeTab === "global" ? (
                <GlobalIssues />
              ) : (
                <Issues recentIssues={recentIssues} />
              )}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}