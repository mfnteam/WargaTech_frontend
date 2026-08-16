import { useState, useRef, useEffect } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import logoImg from "@/assets/logo_app.png";
import {
    Home,
    Stethoscope,
    Bus,
    Leaf,
    Settings,
    LogOut,
    Menu,
    X,
    FileText,
    ChevronDown,
    LogIn,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { profileService } from "../../services/profile";

export default function Navbar() {
    const { user, logout, isWarga, isPetugas } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [profPic, setProfPic] = useState("");
    const dropdownRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        function handleClickOutside(e) {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target)
            ) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isDashboard = location.pathname === "/";

    useEffect(() => {
        if (!isDashboard) {
            setScrolled(true);
            return;
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        handleScroll();

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [isDashboard]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const navLinks = [
        { to: "/", label: "Beranda", icon: Home },
        {
            to: "/layanan-kesehatan",
            label: "Layanan Kesehatan",
            icon: Stethoscope,
        },
        { to: "/mobilitas", label: "Mobilitas Sosial", icon: Bus },
        {
            to: "/stabilitas-lingkungan",
            label: "Stabilitas Lingkungan",
            icon: Leaf,
        },
    ];

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav
            className={`
        fixed top-0 left-0 right-0 w-full z-50
        border-b transition-all duration-300 ease-in-out
        ${
            scrolled
                ? "bg-white/90 backdrop-blur-md shadow-xs border-gray-100/80"
                : "bg-transparent backdrop-blur-md shadow-xs"
        }
    `}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img
                            src={logoImg}
                            alt="WargaTech Logo"
                            className="h-12 w-auto transition-transform group-hover:scale-105"
                        />
                        <span
                            className={`text-2xl font-black tracking-tight transition-colors ${scrolled ? "text-gray-900" : "text-white drop-shadow-xs"}`}
                        >
                            WargaTech
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-1 p-1 rounded-2xl">
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/"}
                                className={({ isActive }) =>
                                    `flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                        isActive
                                            ? "bg-orange-500 text-white shadow-sm font-bold"
                                            : scrolled
                                              ? "text-gray-700 hover:text-gray-900 hover:bg-gray-100/70"
                                              : "text-gray-200 hover:text-white hover:bg-white/15 backdrop-blur-xs"
                                    }`
                                }
                            >
                                <link.icon size={16} />
                                {link.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <span
                                    className={`hidden sm:inline-block px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${
                                        isPetugas
                                            ? "bg-blue-100 text-blue-700 border border-blue-200"
                                            : "bg-orange-100 text-orange-700 border border-orange-200"
                                    }`}
                                >
                                    {isPetugas ? "Petugas" : "Warga"}
                                </span>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() =>
                                            setProfileOpen(!profileOpen)
                                        }
                                        className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-full hover:bg-gray-100 transition-colors border border-gray-200/80 bg-white cursor-pointer"
                                        id="profile-dropdown-btn"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-amber-500 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                                            {getInitials(user?.name)}
                                        </div>
                                        <span className="hidden sm:inline-block text-sm font-semibold text-gray-800 max-w-[110px] truncate">
                                            {user?.name || "User"}
                                        </span>
                                        <ChevronDown
                                            size={16}
                                            className={`text-gray-400 transition-transform duration-200 ${
                                                profileOpen
                                                    ? "rotate-180 text-orange-500"
                                                    : ""
                                            }`}
                                        />
                                    </button>

                                    {profileOpen && (
                                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                                            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50">
                                                <p className="text-sm font-bold text-gray-900 truncate">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs text-gray-500 truncate">
                                                    {user?.email}
                                                </p>
                                            </div>

                                            <div className="p-1.5 space-y-0.5">
                                                {isWarga && (
                                                    <button
                                                        onClick={() => {
                                                            setProfileOpen(
                                                                false,
                                                            );
                                                            navigate(
                                                                "/?section=report",
                                                            );
                                                        }}
                                                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50/60 rounded-xl transition-colors text-left"
                                                    >
                                                        <FileText size={16} />
                                                        Laporan Saya
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => {
                                                        setProfileOpen(false);
                                                        navigate("/pengaturan");
                                                    }}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50/60 rounded-xl transition-colors text-left"
                                                >
                                                    <Settings size={16} />
                                                    Pengaturan
                                                </button>
                                            </div>

                                            <div className="border-t border-gray-100 p-1.5 mt-1">
                                                <button
                                                    onClick={handleLogout}
                                                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors text-left"
                                                >
                                                    <LogOut size={16} />
                                                    Keluar
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <Link
                                to="/login"
                                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center gap-2"
                            >
                                <LogIn size={16} />
                                <span>Portal Warga</span>
                            </Link>
                        )}

                        {/* Mobile Hamburger */}
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors"
                            aria-label="Toggle navigation menu"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            {mobileOpen && (
                <div className="md:hidden border-t border-gray-100 bg-white px-4 py-3 space-y-2 shadow-lg">
                    {navLinks.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/"}
                            onClick={() => setMobileOpen(false)}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                                    isActive
                                        ? "bg-orange-50 text-orange-600 font-bold"
                                        : "text-gray-700 hover:bg-gray-50"
                                }`
                            }
                        >
                            <link.icon size={18} />
                            {link.label}
                        </NavLink>
                    ))}

                    {!user && (
                        <div className="pt-2 border-t border-gray-100">
                            <Link
                                to="/login"
                                onClick={() => setMobileOpen(false)}
                                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-orange-500 text-white font-bold text-sm rounded-xl shadow-md"
                            >
                                <LogIn size={16} />
                                <span>Masuk ke Akun</span>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </nav>
    );
}
