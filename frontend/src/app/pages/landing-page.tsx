import { Link } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { 
  ClipboardCheck, 
  FileText, 
  ShieldCheck, 
  Users 
} from "lucide-react";

export function LandingPage() {
  const features = [
    {
      icon: ClipboardCheck,
      title: "Placement Tracking",
      description: "Monitor your placement progress in real-time with comprehensive tracking tools."
    },
    {
      icon: FileText,
      title: "Secure Document Upload",
      description: "Upload and manage all placement documents securely in one centralized location."
    },
    {
      icon: Users,
      title: "Staff Review System",
      description: "Streamlined review process enabling staff to quickly approve and provide feedback."
    },
    {
      icon: ShieldCheck,
      title: "Compliance Monitoring",
      description: "Automated compliance checks ensure all placements meet university requirements."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold text-lg">PlacementHub</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#" className="text-sm hover:text-blue-600 transition-colors">Home</a>
              <a href="#features" className="text-sm hover:text-blue-600 transition-colors">Features</a>
              <a href="#students" className="text-sm hover:text-blue-600 transition-colors">For Students</a>
              <a href="#staff" className="text-sm hover:text-blue-600 transition-colors">For Staff</a>
              <Button variant="outline" size="sm" asChild>
                <Link to="/student">Login</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Secure Student Placement Management Platform
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            A comprehensive platform enabling students to seamlessly apply for placements 
            while allowing staff to monitor progress, ensure compliance, and streamline approvals.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" className="px-8" asChild>
              <Link to="/student">Access Dashboard</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8">
              Learn More
            </Button>
          </div>
        </div>

        {/* Illustration Area */}
        <div className="mt-16 relative">
          <div className="bg-gradient-to-br from-blue-100 to-blue-50 rounded-2xl p-12 shadow-lg">
            <div className="flex items-center justify-center gap-12">
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center">
                  <Users className="w-12 h-12 text-white" />
                </div>
                <span className="font-semibold text-gray-700">Students</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="h-1 w-32 bg-blue-400 rounded"></div>
                <div className="h-1 w-32 bg-blue-400 rounded"></div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-green-600 flex items-center justify-center">
                  <ShieldCheck className="w-12 h-12 text-white" />
                </div>
                <span className="font-semibold text-gray-700">Staff</span>
              </div>
              
              <div className="flex flex-col gap-2">
                <div className="h-1 w-32 bg-green-400 rounded"></div>
                <div className="h-1 w-32 bg-green-400 rounded"></div>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center">
                  <ClipboardCheck className="w-12 h-12 text-white" />
                </div>
                <span className="font-semibold text-gray-700">Employers</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <span className="font-semibold">PlacementHub</span>
            </div>
            <div className="text-sm text-gray-600">
              © 2026 University Placement System. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-600">
              <a href="#" className="hover:text-blue-600">Privacy Policy</a>
              <a href="#" className="hover:text-blue-600">Terms of Service</a>
              <a href="#" className="hover:text-blue-600">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
