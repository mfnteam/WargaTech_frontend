import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { authService } from "@/services/auth";
import AuthLayout from "@/components/layout/AuthLayout";
import OTPInput from "@/components/common/OTPInput";
import WargaTechLogo from "@/components/common/WargaTechLogo";
import { Loader2, ArrowRight, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/logo_app.png";

export default function Verify() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const email = searchParams.get("email") || "";
    const [code, setCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [countdown, setCountdown] = useState(57);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        if (countdown <= 0) {
            setCanResend(true);
            return;
        }
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (code.length !== 6) {
            toast.error("Masukkan 6 digit kode OTP");
            return;
        }

        setLoading(true);
        try {
            await authService.verifyEmail(email, code);
            toast.success("Email berhasil diverifikasi!");
            navigate("/login");
        } catch (error) {
            const msg = error.response?.data?.message || "Kode OTP tidak valid";
            toast.error(msg);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setResendLoading(true);
        try {
            await authService.resendOTP();
            toast.success("Kode OTP baru telah dikirim");
            setCountdown(60);
            setCanResend(false);
            setCode("");
        } catch {
            toast.error("Gagal mengirim ulang kode");
        } finally {
            setResendLoading(false);
        }
    };

    return (
        <AuthLayout>
            <div className="flex justify-center items-center gap-2 py-4 group">
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
            </div>

            {/* Main Card */}
            <div className="w-full max-w-[460px] bg-white rounded-3xl p-8 sm:p-10 shadow-xl shadow-orange-500/5 border border-gray-100 relative overflow-hidden text-center">
                {/* Top Accent Bar */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-orange-500"></div>

                <h1 className="text-2xl font-extrabold text-gray-900 mb-2 tracking-tight">
                    Verifikasi <span className="text-orange-500">Akun</span>
                </h1>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-6">
                    Masukkan 6 digit kode yang telah dikirimkan ke email Anda.
                    {email && (
                        <span className="block font-semibold text-gray-800 mt-1">
                            {email}
                        </span>
                    )}
                </p>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <OTPInput
                        length={6}
                        value={code}
                        onChange={setCode}
                        disabled={loading}
                    />

                    <button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Memverifikasi...
                            </>
                        ) : (
                            <>
                                Verifikasi
                                <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    {/* Resend Section */}
                    <div className="pt-2 text-center text-xs">
                        <p className="text-gray-600 font-medium">
                            Belum menerima kode?{" "}
                            <span className="font-bold text-gray-900">
                                {formatTime(countdown)}
                            </span>
                        </p>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={!canResend || resendLoading}
                            className="mt-1 font-bold text-orange-500 hover:text-orange-600 hover:underline disabled:opacity-50 disabled:no-underline disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            {resendLoading
                                ? "Mengirim ulang..."
                                : "Kirim ulang kode"}
                        </button>
                    </div>
                </form>
            </div>

            {/* Bottom Back Link */}
            <div className="mt-8 text-center">
                <Link
                    to="/login"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-600 hover:text-orange-600 transition-colors"
                >
                    <ArrowLeft size={15} />
                    Kembali ke Login
                </Link>
            </div>
        </AuthLayout>
    );
}
