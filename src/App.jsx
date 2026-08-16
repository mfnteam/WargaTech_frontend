import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

// Layouts
import MainLayout from "@/components/layout/MainLayout";

// Auth Pages
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Verify from "@/pages/auth/Verify";

// Main Pages
import LandingPage from "@/pages/home/LandingPage";
import LayananKesehatan from "@/pages/health/LayananKesehatan";
import MobilitasSosial from "@/pages/mobility/MobilitasSosial";
import StabilitasLingkungan from "@/pages/environment/StabilitasLingkungan";
import Pengaturan from "@/pages/settings/Pengaturan";
import SampahinAja from "./pages/environment/SampahinAja";

// Protected Route wrapper
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return children;
}

// Guest Route wrapper (redirect to home if logged in)
function GuestRoute({ children }) {
    const { isAuthenticated } = useAuth();
    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }
    return children;
}

function AppRoutes() {
    return (
        <Routes>
            {/* Auth Routes (Guest only) */}
            <Route
                path="/login"
                element={
                    <GuestRoute>
                        <Login />
                    </GuestRoute>
                }
            />
            <Route
                path="/register"
                element={
                    <GuestRoute>
                        <Register />
                    </GuestRoute>
                }
            />
            <Route path="/verify" element={<Verify />} />

            {/* MainLayout wrapping Public & Protected Routes */}
            <Route element={<MainLayout />}>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/beranda" element={<Navigate to="/" replace />} />
                <Route
                    path="/stabilitas-lingkungan"
                    element={<StabilitasLingkungan />}
                />

                {/* Protected Routes */}
                <Route
                    path="/layanan-kesehatan"
                    element={
                        <ProtectedRoute>
                            <LayananKesehatan />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/mobilitas"
                    element={
                        <ProtectedRoute>
                            <MobilitasSosial />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/pengaturan"
                    element={
                        <ProtectedRoute>
                            <Pengaturan />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/sampahinaja"
                    element={
                        <ProtectedRoute>
                            <SampahinAja />
                        </ProtectedRoute>
                    }
                />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <AppRoutes />
                <Toaster
                    position="top-right"
                    toastOptions={{
                        duration: 4000,
                        style: {
                            background: "#fff",
                            color: "#1f2937",
                            boxShadow:
                                "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
                            borderRadius: "12px",
                            padding: "14px 18px",
                            fontSize: "0.9375rem",
                            border: "1px solid #e5e7eb",
                        },
                        success: {
                            iconTheme: {
                                primary: "#16a34a",
                                secondary: "#fff",
                            },
                        },
                        error: {
                            iconTheme: {
                                primary: "#dc2626",
                                secondary: "#fff",
                            },
                        },
                    }}
                />
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
