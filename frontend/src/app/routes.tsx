import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/landing-page";
import { StudentDashboard } from "./pages/student-dashboard";
import { StaffDashboard } from "./pages/staff-dashboard";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/student",
    Component: StudentDashboard,
  },
  {
    path: "/staff",
    Component: StaffDashboard,
  },
]);
