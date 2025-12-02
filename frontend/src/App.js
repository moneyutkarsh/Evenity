import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Hero from "./pages/hero";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import CompleteSignup from "./pages/CompleteSignup.jsx";   // ⭐ NEW IMPORT
import Events from "./Components/events";
import SavedEvents from "./pages/SavedEvents";
import { SavedEventsProvider } from "./pages/SavedEventsContext";
import TechPulseDetail from "./pages/TechPulseDetail";
import TechPulse from "./pages/TechPulse";
import CreateEvent from "./pages/CreateEvent";
import Navbar from "./Components/NavBar";
import About from "./pages/About";
import Dashboard from "./pages/DashBoard";
import { AuthProvider } from "./context/AuthContext";
import ForgotPassword from "./pages/ForgotPassword";
import AuthCallback from "./pages/AuthCallback";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* Page Background Wrapper */
function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0f2c] to-[#1e293b] text-white relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:20px_20px]" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* Main App Component */
function App() {
  const location = useLocation();

  const hideNavbar =
  location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/auth/callback" ||
    location.pathname === "/complete-signup" ||   // ⭐ HIDE NAVBAR ON COMPLETE SIGNUP PAGE
    location.pathname === "/create-event"   // ⭐ HIDE NAVBAR HERE TOO

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/complete-signup" element={<CompleteSignup />} /> {/* ⭐ NEW ROUTE */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Events */}
        <Route
          path="/events"
          element={
            <PageWrapper>
              <Events />
            </PageWrapper>
          }
        />

        <Route
          path="/techpulse"
          element={
            <PageWrapper>
              <TechPulse />
            </PageWrapper>
          }
        />

        <Route
          path="/techpulse/:id"
          element={
            <PageWrapper>
              <TechPulseDetail />
            </PageWrapper>
          }
        />

        {/* About */}
        <Route
          path="/about"
          element={
            <PageWrapper>
              <About />
            </PageWrapper>
          }
        />

        {/* Forgot Password */}
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes */}
        <Route path="/create-event" element={<CreateEvent />} />

        <Route
          path="/saved"
          element={
            <PageWrapper>
              <SavedEvents />
            </PageWrapper>
          }
        />

        <Route
          path="/dashboard"
          element={
            <PageWrapper>
              <Dashboard />
            </PageWrapper>
          }
        />

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <PageWrapper>
              <div className="flex flex-col justify-center items-center h-screen text-gray-400">
                <h1 className="text-3xl font-bold text-indigo-400">404</h1>
                <p className="text-gray-500 mt-2">Page not found.</p>
              </div>
            </PageWrapper>
          }
        />
      </Routes>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </>
  );
}

/* Providers Wrapper */
export default function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <SavedEventsProvider>
          <App />
        </SavedEventsProvider>
      </AuthProvider>
    </Router>
  );
}
