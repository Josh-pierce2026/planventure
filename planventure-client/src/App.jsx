import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import MainLayout from "./layouts/MainLayout";
import { publicRoutes, protectedRoutes } from "./routes/routes";
import "./App.css";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NewTrip from "./pages/NewTrip";
import EditTrip from "./pages/EditTrip";
import TripOverview from "./pages/TripOverview";
import TripItinerary from "./pages/TripItinerary";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/trips/new"
        element={
          <ProtectedRoute>
            <NewTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/trips/:tripId"
        element={
          <ProtectedRoute>
            <TripOverview />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/trips/:tripId/edit"
        element={
          <ProtectedRoute>
            <EditTrip />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/trips/:tripId/itinerary"
        element={
          <ProtectedRoute>
            <TripItinerary />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
