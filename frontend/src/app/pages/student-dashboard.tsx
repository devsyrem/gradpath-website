import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Progress } from "../components/ui/progress";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Upload,
  MessageSquare,
  User,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  Bell
} from "lucide-react";

export function StudentDashboard() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Briefcase, label: "My Placement", active: false },
    { icon: FileText, label: "Applications", active: false },
    { icon: Upload, label: "Documents", active: false },
    { icon: MessageSquare, label: "Messages", active: false },
    { icon: User, label: "Profile", active: false },
  ];

  const placementTimeline = [
    { step: "Application Submitted", status: "completed", date: "Feb 10, 2026" },
    { step: "Documents Reviewed", status: "completed", date: "Feb 15, 2026" },
    { step: "Placement Approved", status: "current", date: "Mar 2, 2026" },
    { step: "Start Date Confirmed", status: "pending", date: "Pending" },
  ];

  const documents = [
    { name: "Placement Agreement", status: "approved", uploadDate: "Feb 8, 2026" },
    { name: "Insurance Certificate", status: "approved", uploadDate: "Feb 9, 2026" },
    { name: "Health & Safety Form", status: "pending", uploadDate: "Feb 10, 2026" },
    { name: "DBS Check", status: "pending", uploadDate: "Feb 12, 2026" },
  ];

  const messages = [
    { from: "Dr. Sarah Johnson", subject: "Placement Approval", date: "2 hours ago", unread: true },
    { from: "Admin Team", subject: "Document Reminder", date: "1 day ago", unread: false },
    { from: "Placement Coordinator", subject: "Start Date Update", date: "3 days ago", unread: false },
  ];

  const deadlines = [
    { task: "Submit Final Report", date: "Mar 30, 2026", priority: "high" },
    { task: "Complete Mid-Placement Review", date: "Apr 15, 2026", priority: "medium" },
    { task: "Upload Weekly Timesheet", date: "Mar 20, 2026", priority: "low" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">PlacementHub</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-blue-600">AS</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">Alex Student</div>
                <div className="text-gray-500 text-xs">Student</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-[calc(100vh-73px)] p-4">
          <nav className="space-y-1">
            {navItems.map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  item.active
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link to="/">← Back to Home</Link>
            </Button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Welcome back, Alex Student</h1>
            <p className="text-gray-600">Here's an overview of your placement progress</p>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="border-green-200 bg-green-50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Placement Status</p>
                    <p className="text-2xl font-semibold text-green-700">Approved</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-yellow-200 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Application Deadlines</p>
                    <p className="text-2xl font-semibold text-yellow-700">3 Pending</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-yellow-600 flex items-center justify-center">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Required Documents</p>
                    <p className="text-2xl font-semibold text-blue-700">2 of 4</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column - Larger Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Placement Progress Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Placement Progress Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {placementTimeline.map((item, index) => (
                      <div key={index} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              item.status === "completed"
                                ? "bg-green-100 text-green-600"
                                : item.status === "current"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-gray-100 text-gray-400"
                            }`}
                          >
                            {item.status === "completed" ? (
                              <CheckCircle2 className="w-5 h-5" />
                            ) : item.status === "current" ? (
                              <Clock className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5" />
                            )}
                          </div>
                          {index < placementTimeline.length - 1 && (
                            <div className="w-0.5 h-12 bg-gray-200 my-1"></div>
                          )}
                        </div>
                        <div className="flex-1 pb-6">
                          <div className="flex items-center justify-between mb-1">
                            <p className="font-medium">{item.step}</p>
                            <Badge
                              variant={
                                item.status === "completed"
                                  ? "default"
                                  : item.status === "current"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {item.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{item.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Uploaded Documents */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Uploaded Documents</CardTitle>
                  <Button size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {documents.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">Uploaded {doc.uploadDate}</p>
                          </div>
                        </div>
                        <Badge
                          variant={doc.status === "approved" ? "default" : "secondary"}
                          className={
                            doc.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }
                        >
                          {doc.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Recent Messages */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Messages</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`p-3 rounded-lg border cursor-pointer hover:bg-gray-50 transition-colors ${
                          message.unread ? "bg-blue-50 border-blue-200" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-sm">{message.from}</p>
                          {message.unread && (
                            <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">{message.subject}</p>
                        <p className="text-xs text-gray-500">{message.date}</p>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-3" size="sm">
                    View All Messages
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>

              {/* Upcoming Deadlines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {deadlines.map((deadline, index) => (
                      <div key={index} className="p-3 border rounded-lg">
                        <div className="flex items-start justify-between mb-2">
                          <p className="font-medium text-sm">{deadline.task}</p>
                          <Badge
                            variant={
                              deadline.priority === "high"
                                ? "destructive"
                                : deadline.priority === "medium"
                                ? "secondary"
                                : "outline"
                            }
                            className="text-xs"
                          >
                            {deadline.priority}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <Calendar className="w-3 h-3" />
                          {deadline.date}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Document
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact Advisor
                  </Button>
                  <Button variant="outline" className="w-full justify-start" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Guidelines
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
