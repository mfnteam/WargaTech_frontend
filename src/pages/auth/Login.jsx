import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import AuthLayout from "@/components/layout/AuthLayout";
import WargaTechLogo from "@/components/common/WargaTechLogo";
import {
    Mail,
    Lock,
    Loader2,
    ArrowRight,
    Eye,
    EyeOff,
    Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/logo_app.png";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!formData.email) errs.email = "Email wajib diisi";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errs.email = "Format email tidak valid";
        if (!formData.password) errs.password = "Kata sandi wajib diisi";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await login(formData.email, formData.password);
        setLoading(false);

        if (result.success) {
            toast.success("Login berhasil!");
            navigate("/");
        } else if (result.status === 422) {
            toast.error("Email belum diverifikasi");
            navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
        } else {
            toast.error(result.message || "Email atau password salah");
            setErrors({ general: result.message });
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-[440px] bg-white rounded-3xl justify-content-center grid p-7 sm:p-9 shadow-xl shadow-orange-500/5 border border-gray-100 text-left">
                <div className="flex justify-center pb-4 w-full">
                    <Link
                        to="/"
                        className="flex justify-center items-center gap-2 group"
                    >
                        <img
                            src={logo}
                            alt="WargaTech Logo"
                            className="h-20 w-20 transition-transform"
                        />
                        <h3
                            className={`text-3xl items-center justify-items-center font-black tracking-tight transition-colors`}
                        >
                            <span className="text-gray-600">Warga</span>
                            <span className="text-orange-500">Tech</span>
                        </h3>
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {errors.general && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-semibold">
                            {errors.general}
                        </div>
                    )}

                    <div>
                        <label
                            className="block text-sm font-bold text-gray-800 mb-1.5"
                            htmlFor="login-email"
                        >
                            Alamat Email
                        </label>
                        <div className="relative">
                            <Mail
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                                id="login-email"
                                type="email"
                                className={`w-full pl-10 pr-4 py-3 bg-white border rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                    errors.email
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                }`}
                                placeholder="nama@email.com"
                                value={formData.email}
                                onChange={(e) =>
                                    handleChange("email", e.target.value)
                                }
                                autoComplete="email"
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500 font-medium mt-1">
                                {errors.email}
                            </p>
                        )}
                    </div>

                    <div>
                        <label
                            className="block text-sm font-bold text-gray-800 mb-1.5"
                            htmlFor="login-password"
                        >
                            Kata Sandi
                        </label>
                        <div className="relative">
                            <Lock
                                size={18}
                                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                            />
                            <input
                                id="login-password"
                                type={showPassword ? "text" : "password"}
                                className={`w-full pl-10 pr-10 py-3 bg-white border rounded-xl text-sm text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                    errors.password
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                }`}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) =>
                                    handleChange("password", e.target.value)
                                }
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? (
                                    <EyeOff size={16} />
                                ) : (
                                    <Eye size={16} />
                                )}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 font-medium mt-1">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 pb-1">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-700 font-medium select-none">
                            <input
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) =>
                                    setRememberMe(e.target.checked)
                                }
                                className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-500 accent-orange-500"
                            />
                            Ingat Saya
                        </label>
                        <button
                            type="button"
                            onClick={() =>
                                toast.info(
                                    "Fitur lupa kata sandi dikirim via email.",
                                )
                            }
                            className="font-bold text-orange-500 hover:text-orange-600 hover:underline"
                        >
                            Lupa sandi?
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            <>
                                Masuk
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>
                </form>

                <p className="text-center text-xs sm:text-sm text-gray-600 font-medium pt-4">
                    Belum punya akun?{" "}
                    <Link
                        to="/register"
                        className="font-bold text-orange-500 hover:text-orange-600 hover:underline"
                    >
                        Daftar sekarang
                    </Link>
                </p>
            </div>
        </AuthLayout>
    );
}
