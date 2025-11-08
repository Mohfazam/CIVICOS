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
  AlertTriangle,
  ExternalLink,
  Wind,
  Users,
  Activity,
  Building2,
} from "lucide-react";
import { useUserDetails } from "@/lib/cache/index";
import Issues from "@/app/_components/recent-issues";
import GlobalIssues from "@/app/_components/global-issues";

export default function DashboardPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [isClient, setIsClient] = useState(false);
  const [activeTab, setActiveTab] = useState<"global" | "recent">("global");
  const [safeDismissed, setSafeDismissed] = useState<string[]>([]);

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

  const handleImSafe = (emergencyId: string) => {
    console.log("User marked safe for emergency:", emergencyId);
    setSafeDismissed([...safeDismissed, emergencyId]);
    // TODO: API call to mark user as safe
  };

  if (!isClient || !email || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3b82f6]"></div>
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
        <div className="text-center">
          <p className="text-red-500 mb-4">
            Error fetching user data. Please login again.
          </p>
          <button
            onClick={() => router.push("/login")}
            className="px-6 py-2 bg-[#3b82f6] text-white rounded-[10px] hover:bg-[#2563eb] transition-colors"
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

  // AQI data with fallback
  const aqi = user.aqi || 85;
  const getAQIColor = (value: number) => {
    if (value <= 50) return { bg: "#10b98114", text: "#10b981", label: "Good" };
    if (value <= 100)
      return { bg: "#eab30814", text: "#eab308", label: "Moderate" };
    if (value <= 150)
      return { bg: "#f9731614", text: "#f97316", label: "Unhealthy" };
    return { bg: "#ef444414", text: "#ef4444", label: "Hazardous" };
  };
  const aqiStyle = getAQIColor(aqi);

  // Emergency data with fallback
  const emergencies = user.emergencies || [];
  const activeEmergencies = emergencies.filter(
    (e: any) => !safeDismissed.includes(e.id)
  );

  const getSeverityStyle = (severity: string) => {
    switch (severity) {
      case "CRITICAL":
        return { bg: "#ef444414", border: "#ef4444", text: "#ef4444" };
      case "HIGH":
        return { bg: "#eab30814", border: "#eab308", text: "#eab308" };
      default:
        return { bg: "#3b82f614", border: "#3b82f6", text: "#3b82f6" };
    }
  };

  const mockStats = [
    {
      label: "Issues Reported",
      value: totalIssues.toString(),
      icon: AlertCircle,
      color: "#ef4444",
      dotColor: "#ef4444",
    },
    {
      label: "Resolved",
      value: resolvedIssues.toString(),
      icon: CheckCircle,
      color: "#10b981",
      dotColor: "#10b981",
    },
    {
      label: "In Progress",
      value: inProgressIssues.toString(),
      icon: Clock,
      color: "#eab308",
      dotColor: "#eab308",
    },
    {
      label: "Pending",
      value: pendingIssues.toString(),
      icon: TrendingUp,
      color: "#3b82f6",
      dotColor: "#3b82f6",
    },
  ];

  const recentIssues = user.issues?.slice(0, 5) || [];

  // Ward snapshot data (fallback if not in user object)
  const wardData = [
    { label: "Active Citizens", value: "2,847", icon: Users },
    { label: "Avg Response Time", value: "4.2 days", icon: Activity },
    { label: "Civic Initiatives", value: "12", icon: Building2 },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0a] text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <Navbar />

      <main className="flex-1 pt-24 pb-12">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          {/* Emergency Banner */}
          {activeEmergencies.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6"
            >
              {activeEmergencies.slice(0, 1).map((emergency: any) => {
                const style = getSeverityStyle(emergency.severity);
                return (
                  <div
                    key={emergency.id}
                    style={{
                      backgroundColor: style.bg,
                      borderLeft: `4px solid ${style.border}`,
                    }}
                    className="rounded-[10px] p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                    role="alert"
                    aria-live="assertive"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <AlertTriangle
                        size={20}
                        style={{ color: style.text }}
                        className="flex-shrink-0 mt-0.5"
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className="font-semibold text-sm mb-1"
                          style={{ color: style.text }}
                        >
                          Emergency Updates
                        </p>
                        <p className="text-sm text-white/80 line-clamp-2">
                          {emergency.message}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {emergency.detailsUrl && (
                        <a
                          href={emergency.detailsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 h-[44px] flex items-center gap-2 text-sm font-medium rounded-[10px] border transition-colors"
                          style={{
                            borderColor: style.border,
                            color: style.text,
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = style.bg;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                          }}
                        >
                          View Details
                          <ExternalLink size={14} />
                        </a>
                      )}
                      <button
                        onClick={() => handleImSafe(emergency.id)}
                        className="px-4 h-[44px] text-sm font-medium rounded-[10px] transition-colors"
                        style={{
                          backgroundColor: style.text,
                          color: "#0a0a0a",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.opacity = "0.9";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.opacity = "1";
                        }}
                      >
                        I'm Safe
                      </button>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {/* Header Masthead */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
          >
            <div className="flex items-start sm:items-center gap-4 flex-wrap">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight leading-tight">
                  Civic Dashboard
                </h1>
                <p className="text-[#a1a1aa] text-sm mt-1.5 font-medium tracking-wide">
                  {user.constituency} · Citizen Portal
                </p>
              </div>
              <div
                className="px-3 py-1.5 rounded-[10px] border flex items-center gap-2"
                style={{
                  backgroundColor: aqiStyle.bg,
                  borderColor: aqiStyle.text,
                }}
                role="status"
                aria-label={`Air Quality Index ${aqi}, ${aqiStyle.label}`}
              >
                <Wind size={14} style={{ color: aqiStyle.text }} />
                <span
                  className="text-xs font-semibold tracking-wide"
                  style={{ color: aqiStyle.text }}
                >
                  AQI {aqi}
                </span>
                <span className="text-xs" style={{ color: aqiStyle.text }}>
                  ·
                </span>
                <span
                  className="text-xs font-medium"
                  style={{ color: aqiStyle.text }}
                >
                  {aqiStyle.label}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 h-[44px] rounded-[10px] border border-[#ef4444] text-[#ef4444] transition-colors hover:bg-[#ef444414] font-medium text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </motion.div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {mockStats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-[#18181b] border border-[#27272a] rounded-[10px] p-5 hover:border-[#3f3f46] transition-colors"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: stat.dotColor }}
                      />
                      <stat.icon
                        size={18}
                        style={{ color: stat.color }}
                        className="opacity-80"
                      />
                    </div>
                    <p className="text-[#a1a1aa] text-xs font-medium tracking-wide uppercase mb-1.5">
                      {stat.label}
                    </p>
                    <p className="text-3xl font-bold tracking-tight">
                      {stat.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* User Info Card */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-[#18181b] border border-[#27272a] rounded-[10px] p-6 mb-8"
              >
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xs font-semibold text-[#a1a1aa] mb-4 uppercase tracking-wider">
                      Profile Information
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-[#71717a] mb-1 font-medium">
                          NAME
                        </p>
                        <p className="font-semibold text-base">{user.name}</p>
                      </div>
                      <div>
                        <p className="text-xs text-[#71717a] mb-1 font-medium">
                          EMAIL
                        </p>
                        <p className="font-medium text-sm text-[#d4d4d8]">
                          {user.email}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-[#71717a] mb-1 font-medium">
                          CONSTITUENCY
                        </p>
                        <p className="font-semibold text-base">
                          {user.constituency}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-[#a1a1aa] mb-4 uppercase tracking-wider">
                      Your MLA
                    </h3>
                    {!user.currentMLA ? (
                      <p className="text-sm text-[#71717a] font-medium">
                        No MLA assigned
                      </p>
                    ) : (
                      <div className="p-4 border border-[#27272a] rounded-[10px] bg-[#0a0a0a]">
                        <p className="font-bold text-lg mb-1">
                          {user.currentMLA.name}
                        </p>
                        <p className="text-sm text-[#a1a1aa] mb-3 font-medium">
                          {user.currentMLA.party}
                        </p>
                        <div className="space-y-2 text-xs">
                          <p className="text-[#d4d4d8] flex items-center gap-2 font-medium">
                            <Mail size={13} className="text-[#71717a]" />
                            {user.currentMLA.email}
                          </p>
                          {user.currentMLA.phone && (
                            <p className="text-[#d4d4d8] flex items-center gap-2 font-medium">
                              <Phone size={13} className="text-[#71717a]" />
                              {user.currentMLA.phone}
                            </p>
                          )}
                          <p className="text-[#71717a] flex items-center gap-2 font-medium">
                            <MapPin size={13} />
                            {user.currentMLA.constituency}
                          </p>
                        </div>
                        <button className="mt-4 w-full h-[44px] border border-[#3b82f6] text-[#3b82f6] rounded-[10px] text-sm font-semibold hover:bg-[#3b82f614] transition-colors">
                          Contact MLA
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Tabs Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Tab Headers */}
                <div className="flex gap-1 border-b border-[#27272a] mb-6">
                  <button
                    onClick={() => setActiveTab("global")}
                    className={`flex items-center gap-2 px-6 h-[48px] font-semibold transition-colors relative text-sm ${
                      activeTab === "global"
                        ? "text-[#3b82f6]"
                        : "text-[#71717a] hover:text-[#a1a1aa]"
                    }`}
                  >
                    <Globe size={18} />
                    Global Issues
                    {activeTab === "global" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6]"
                      />
                    )}
                  </button>
                  <button
                    onClick={() => setActiveTab("recent")}
                    className={`flex items-center gap-2 px-6 h-[48px] font-semibold transition-colors relative text-sm ${
                      activeTab === "recent"
                        ? "text-[#3b82f6]"
                        : "text-[#71717a] hover:text-[#a1a1aa]"
                    }`}
                  >
                    <User size={18} />
                    My Recent Issues
                    {activeTab === "recent" && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#3b82f6]"
                      />
                    )}
                  </button>
                </div>

                {/* Tab Content */}
                <div>
                  {activeTab === "global" ? (
                    <GlobalIssues />
                  ) : (
                    <Issues recentIssues={recentIssues} />
                  )}
                </div>
              </motion.div>
            </div>

            {/* Ward Snapshot Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="lg:w-[280px] flex-shrink-0"
            >
              <div className="bg-[#18181b] border border-[#27272a] rounded-[10px] p-5 sticky top-24">
                <h3 className="text-xs font-semibold text-[#a1a1aa] mb-4 uppercase tracking-wider">
                  Ward Snapshot
                </h3>
                <div className="space-y-1">
                  {wardData.map((item, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between py-3">
                        <div className="flex items-center gap-2.5">
                          <item.icon
                            size={16}
                            className="text-[#71717a] flex-shrink-0"
                          />
                          <span className="text-xs font-medium text-[#d4d4d8]">
                            {item.label}
                          </span>
                        </div>
                        <span className="text-sm font-bold">{item.value}</span>
                      </div>
                      {i < wardData.length - 1 && (
                        <div className="h-px bg-[#27272a]" />
                      )}
                    </div>
                  ))}
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