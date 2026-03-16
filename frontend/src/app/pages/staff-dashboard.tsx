import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  LayoutDashboard,
  Users,
  CheckCircle,
  FileBarChart,
  ShieldAlert,
  Settings,
  Search,
  Filter,
  Download,
  Eye,
  Check,
  X,
  Bell,
  AlertTriangle,
  TrendingUp,
  Clock,
} from "lucide-react";

export function StaffDashboard() {
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", active: true },
    { icon: Users, label: "Student Placements", active: false },
    { icon: CheckCircle, label: "Approvals", active: false },
    { icon: FileBarChart, label: "Reports", active: false },
    { icon: ShieldAlert, label: "Compliance", active: false },
    { icon: Settings, label: "Settings", active: false },
  ];

  const studentPlacements = [
    {
      id: 1,
      studentName: "Alex Student",
      company: "Tech Solutions Ltd",
      status: "approved",
      lastUpdated: "2 hours ago",
    },
    {
      id: 2,
      studentName: "Emma Wilson",
      company: "Healthcare Innovation",
      status: "pending",
      lastUpdated: "5 hours ago",
    },
    {
      id: 3,
      studentName: "James Chen",
      company: "Finance Corp",
      status: "review",
      lastUpdated: "1 day ago",
    },
    {
      id: 4,
      studentName: "Sarah Johnson",
      company: "Design Studio",
      status: "approved",
      lastUpdated: "1 day ago",
    },
    {
      id: 5,
      studentName: "Michael Brown",
      company: "Engineering Works",
      status: "pending",
      lastUpdated: "2 days ago",
    },
    {
      id: 6,
      studentName: "Lisa Anderson",
      company: "Marketing Agency",
      status: "rejected",
      lastUpdated: "3 days ago",
    },
  ];

  const approvalQueue = [
    {
      student: "Emma Wilson",
      type: "Placement Agreement",
      submitted: "5 hours ago",
      urgent: true,
    },
    {
      student: "James Chen",
      type: "Insurance Certificate",
      submitted: "1 day ago",
      urgent: false,
    },
    {
      student: "Michael Brown",
      type: "Health & Safety Form",
      submitted: "2 days ago",
      urgent: false,
    },
  ];

  const complianceAlerts = [
    {
      student: "David Kumar",
      issue: "DBS Check Expired",
      severity: "high",
      dueDate: "Mar 18, 2026",
    },
    {
      student: "Sophie Martin",
      issue: "Missing Insurance",
      severity: "high",
      dueDate: "Mar 20, 2026",
    },
    {
      student: "Tom Richards",
      issue: "Incomplete Documentation",
      severity: "medium",
      dueDate: "Mar 25, 2026",
    },
  ];

  const recentActivity = [
    {
      action: "Placement Approved",
      user: "Dr. Sarah Johnson",
      student: "Alex Student",
      time: "2 hours ago",
    },
    {
      action: "Document Reviewed",
      user: "Prof. Mark Davis",
      student: "Emma Wilson",
      time: "5 hours ago",
    },
    {
      action: "Compliance Alert",
      user: "System",
      student: "David Kumar",
      time: "1 day ago",
    },
    {
      action: "New Placement Submitted",
      user: "Student Portal",
      student: "Michael Brown",
      time: "2 days ago",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "review":
        return "bg-blue-100 text-blue-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <span className="font-semibold text-lg">PlacementHub Admin</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-purple-600">SJ</span>
              </div>
              <div className="text-sm">
                <div className="font-medium">Dr. Sarah Johnson</div>
                <div className="text-gray-500 text-xs">Staff Administrator</div>
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
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold mb-1">Staff Dashboard</h1>
            <p className="text-gray-600">
              Monitor student placements and manage approvals
            </p>
          </div>

          {/* Metrics Cards */}
          <div className="grid md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Total Students</p>
                    <p className="text-3xl font-semibold">156</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-green-600">
                      <TrendingUp className="w-3 h-3" />
                      <span>+12% this month</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Approved Placements</p>
                    <p className="text-3xl font-semibold">124</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-gray-600">
                      <span>79% approval rate</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Pending Reviews</p>
                    <p className="text-3xl font-semibold">18</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-yellow-600">
                      <Clock className="w-3 h-3" />
                      <span>Action needed</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <Clock className="w-6 h-6 text-yellow-600" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Compliance Alerts</p>
                    <p className="text-3xl font-semibold">7</p>
                    <div className="flex items-center gap-1 mt-2 text-xs text-red-600">
                      <AlertTriangle className="w-3 h-3" />
                      <span>2 urgent</span>
                    </div>
                  </div>
                  <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
                    <ShieldAlert className="w-6 h-6 text-red-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Student Placements Table - Takes 2 columns */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Student Placement Overview</CardTitle>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input placeholder="Search students..." className="pl-9" />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Company</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Last Updated</TableHead>
                          <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {studentPlacements.map((placement) => (
                          <TableRow key={placement.id}>
                            <TableCell className="font-medium">
                              {placement.studentName}
                            </TableCell>
                            <TableCell>{placement.company}</TableCell>
                            <TableCell>
                              <Badge
                                variant="secondary"
                                className={getStatusColor(placement.status)}
                              >
                                {placement.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-gray-600 text-sm">
                              {placement.lastUpdated}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <Button variant="ghost" size="icon">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {placement.status === "pending" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-green-600 hover:text-green-700"
                                    >
                                      <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="text-red-600 hover:text-red-700"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Side Panels */}
            <div className="space-y-6">
              {/* Approval Queue */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Placement Approval Queue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {approvalQueue.map((item, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${
                          item.urgent ? "border-red-200 bg-red-50" : ""
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="font-medium text-sm">{item.student}</p>
                            <p className="text-xs text-gray-600">{item.type}</p>
                          </div>
                          {item.urgent && (
                            <Badge variant="destructive" className="text-xs">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mb-2">{item.submitted}</p>
                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1 h-8 text-xs">
                            <Check className="w-3 h-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 h-8 text-xs"
                          >
                            Review
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-3" size="sm">
                    View All
                  </Button>
                </CardContent>
              </Card>

              {/* Compliance Warnings */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                    Compliance Warnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {complianceAlerts.map((alert, index) => (
                      <div
                        key={index}
                        className={`p-3 border rounded-lg ${
                          alert.severity === "high"
                            ? "border-red-200 bg-red-50"
                            : "border-yellow-200 bg-yellow-50"
                        }`}
                      >
                        <div className="flex items-start justify-between mb-1">
                          <p className="font-medium text-sm">{alert.student}</p>
                          <Badge
                            variant={
                              alert.severity === "high" ? "destructive" : "secondary"
                            }
                            className="text-xs"
                          >
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-700 mb-1">{alert.issue}</p>
                        <p className="text-xs text-gray-600">Due: {alert.dueDate}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Activity Log */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex gap-3">
                        <div className="w-2 h-2 rounded-full bg-blue-600 mt-2"></div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{activity.action}</p>
                          <p className="text-xs text-gray-600">
                            {activity.user} • {activity.student}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
