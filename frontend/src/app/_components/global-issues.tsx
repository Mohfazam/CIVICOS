'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, MapPin, Calendar, User, Users } from 'lucide-react';

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

interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  mediaUrl: string | null;
  location: string;
  latitude: number | null;
  longitude: number | null;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  citizenId: string;
  mlaId: string | null;
  organizationId: string | null;
  createdAt: string;
  updatedAt: string;
  citizen: Citizen;
  mla: MLA | null;
  organization: any | null;
}

interface ApiResponse {
  success: boolean;
  count: number;
  totalCount: number;
  issues: Issue[];
}

export default function GlobalIssues() {
  const router = useRouter();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://civiciobackend.vercel.app/api/v1/citizen/issues');
      
      if (!response.ok) {
        throw new Error('Failed to fetch issues');
      }

      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setIssues(data.issues);
      } else {
        throw new Error('API returned unsuccessful response');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleIssueClick = (issueId: string) => {
    router.push(`/global-issues/${issueId}`);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL': return 'bg-red-100 text-red-800 border-red-200';
      case 'HIGH': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'RESOLVED': return 'bg-green-100 text-green-800';
      case 'IN_PROGRESS': return 'bg-blue-100 text-blue-800';
      case 'PENDING': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading issues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 text-center mb-2">Error Loading Issues</h2>
          <p className="text-red-600 text-center">{error}</p>
          <button 
            onClick={fetchIssues}
            className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Civic Issues Dashboard</h1>
          <p className="text-gray-600">
            Total Issues: <span className="font-semibold">{issues.length}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <div 
              key={issue.id}
              onClick={() => handleIssueClick(issue.id)}
              className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer overflow-hidden transform hover:scale-105 duration-200"
            >
              {issue.mediaUrl && (
                <img 
                  src={issue.mediaUrl} 
                  alt={issue.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex-1">{issue.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSeverityColor(issue.severity)}`}>
                    {issue.severity}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{issue.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span className="truncate">{issue.location}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <User className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{issue.citizen.name} ({issue.citizen.constituency})</span>
                  </div>

                  {issue.mla && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                      <span className="truncate">{issue.mla.name} - {issue.mla.party}</span>
                    </div>
                  )}

                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    <span>{formatDate(issue.createdAt)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="text-xs font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {issue.category}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.status)}`}>
                    {issue.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {issues.length === 0 && (
          <div className="text-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Issues Found</h3>
            <p className="text-gray-500">There are currently no civic issues to display.</p>
          </div>
        )}
      </div>
    </div>
  );
}