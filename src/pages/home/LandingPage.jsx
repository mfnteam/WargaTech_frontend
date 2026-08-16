import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { reportService } from "@/services/report";
import { mobilityService } from "@/services/mobility";
import FileUpload from "@/components/common/FileUpload";
import dkiLogo from "@/assets/dki_jakarta.png";
import {
    Stethoscope,
    Bus,
    Leaf,
    ArrowRight,
    MapPin,
    Clock,
    Loader2,
    AlertTriangle,
    Send,
    Trash2,
    Train,
    ChevronRight,
    CheckCircle,
    Clock3,
    LogIn,
    Lock,
    Shield,
    Key,
} from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/services/api";
import jakartaView from "../../assets/jakarta_view.jpg";
import axios from "axios";

export default function LandingPage() {
    const { isWarga, isPetugas, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="space-y-16 pb-16">
            <HeroSection
                navigate={navigate}
                isAuthenticated={isAuthenticated}
            />
            <FeaturesSection navigate={navigate} />
            {isPetugas && <PetugasReportSection />}
            <ReportSection isWarga={isWarga} isPetugas={isPetugas} />
            {isAuthenticated ? <TransportSection /> : <GuestTransportCTA />}
        </div>
    );
}

/* ---- Guest Transport CTA ---- */
function GuestTransportCTA() {
    return (
        <section
            id="transport-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl border border-blue-200/60 p-8 sm:p-12">
                <div className="absolute top-6 right-6 opacity-10">
                    <Bus size={120} className="text-blue-500" />
                </div>
                <div className="relative z-10 max-w-lg space-y-4">
                    <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                        Jadwal Transportasi Terdekat
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                        Pantau jadwal kereta, bus, MRT, dan LRT secara
                        real-time. Masuk ke akun untuk melihat jadwal
                        keberangkatan terbaru.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                    >
                        Masuk untuk Melihat Jadwal
                    </Link>
                </div>
            </div>
        </section>
    );
}

/* ---- Hero Section ---- */
function HeroSection({ navigate, isAuthenticated }) {
    return (
        <section className="kota-jakarta relative min-h-screen flex items-center overflow-hidden bg-slate-900 pt-28 pb-20 md:pt-36 md:pb-28 border-b border-gray-100">
            {/* Background Image */}
            <img
                src={jakartaView}
                alt="Hero"
                className="absolute inset-0 h-full w-full object-cover"
            />
            {/* Dark Overlay for optimal text legibility */}
            <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-[1px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="flex flex-col lg:flex-row items-center justify-evenly gap-12">
                    {/* Left Content */}
                    <div className="flex-1 text-center lg:text-left space-y-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.15] tracking-tight drop-shadow-md">
                            <span className="text-orange-500">
                                Koneksi Digital
                            </span>{" "}
                            untuk Kota Berkelanjutan
                        </h1>

                        <p className="text-gray-200 text-base sm:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed drop-shadow-xs">
                            Akses layanan publik terpadu, pantau mobilitas ramah
                            lingkungan, dan ikut serta membangun lingkungan
                            masyarakat yang lebih cerdas dan aman melalui satu
                            platform.
                        </p>

                        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                            <button
                                onClick={() => {
                                    document
                                        .getElementById("report-section")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                className="px-6 py-3.5 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm rounded-2xl shadow-lg shadow-orange-500/30 transition-all flex items-center gap-2.5 cursor-pointer"
                            >
                                <AlertTriangle size={18} />
                                Lapor Masalah Kota
                            </button>

                            <button
                                onClick={() => {
                                    if (!isAuthenticated) {
                                        navigate("/login");
                                        return;
                                    }
                                    document
                                        .getElementById("transport-section")
                                        ?.scrollIntoView({
                                            behavior: "smooth",
                                        });
                                }}
                                className="px-6 py-3.5 bg-white hover:bg-gray-50 active:scale-[0.98] text-gray-900 font-bold text-sm rounded-2xl border border-gray-200 shadow-md transition-all flex items-center gap-2.5 cursor-pointer"
                            >
                                <Bus size={18} className="text-orange-500" />
                                Cek Jadwal Transportasi
                            </button>
                        </div>
                    </div>

                    {/* Right Visual Badge */}
                    <div className="shrink-0 relative">
                        <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl bg-white/95 backdrop-blur-md p-6 shadow-2xl shadow-black/30 border border-white/20 flex items-center justify-center relative z-10 group transition-transform duration-300 hover:scale-105">
                            <img
                                src={dkiLogo}
                                alt="Logo Provinsi DKI Jakarta"
                                className="w-full h-full object-contain filter drop-shadow-md"
                            />
                        </div>
                        <div className="absolute -inset-4 bg-linear-to-tr from-orange-500 to-amber-400 rounded-3xl blur-2xl opacity-10 group-hover:opacity-60 transition-opacity -z-10" />
                    </div>
                </div>
            </div>
        </section>
    );
}

/* ---- Features Section ---- */
function FeaturesSection({ navigate }) {
    const features = [
        {
            icon: "🏥",
            title: "Layanan Kesehatan",
            desc: "Akses dokter umum, buat perjanjian, dan pantau status booking kesehatan Anda.",
            link: "/layanan-kesehatan",
            bg: "bg-rose-50 border-rose-100 text-rose-600",
        },
        {
            icon: "🚆",
            title: "Mobilitas Sosial",
            desc: "Jadwal kereta, bus, MRT, dan LRT real-time untuk perjalanan yang efisien.",
            link: "/mobilitas",
            bg: "bg-blue-50 border-blue-100 text-blue-600",
        },
        {
            icon: "🌿",
            title: "Stabilitas Lingkungan",
            desc: "Infografis pemilahan sampah dan pelaporan masalah lingkungan sekitar.",
            link: "/stabilitas-lingkungan",
            bg: "bg-emerald-50 border-emerald-100 text-emerald-600",
        },
    ];

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Layanan Pintar untuk Warga{" "}
                    <span className="text-orange-500">Cerdas</span>
                </h2>
                <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                    Akses berbagai fasilitas dan layanan publik perkotaan secara
                    terintegrasi untuk mendukung efisiensi kehidupan sosial
                    masyarakat.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {features.map((f, i) => (
                    <div
                        key={i}
                        onClick={() => navigate(f.link)}
                        className="group bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col justify-between"
                    >
                        <div>
                            <div
                                className={`w-14 h-14 rounded-2xl ${f.bg} border flex items-center justify-center text-2xl mb-6 shadow-xs`}
                            >
                                {f.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-orange-500 transition-colors">
                                {f.title}
                            </h3>
                            <p className="text-gray-500 text-sm leading-relaxed">
                                {f.desc}
                            </p>
                        </div>

                        <div className="mt-6 pt-4 border-t border-gray-50 flex items-center text-orange-600 font-bold text-sm gap-1 group-hover:translate-x-1 transition-transform">
                            <span>Selengkapnya</span>
                            <ChevronRight size={16} />
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

/* ---- Report Section (Warga Only) ---- */
function ReportSection({ isWarga, isPetugas }) {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [formData, setFormData] = useState({
        type: "",
        location: "",
        description: "",
    });
    const [attachment, setAttachment] = useState(null);
    const [errors, setErrors] = useState({});
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [useLoc, setUseLoc] = useState(false);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {
        if (!isAuthenticated) {
            return;
        }

        if (!isWarga) {
            return;
        }

        try {
            const res = await reportService.getUserReports();
            setReports(res.report || res || []);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const reportTypes = [
        { value: "infrastruktur", label: "Jalan Berlubang" },
        { value: "fasilitas", label: "Fasilitas Umum Rusak" },
        { value: "pelanggaran", label: "Pelanggaran Umum" },
        { value: "lingkungan", label: "Lingkungan Kotor" },
    ];

    const getLocation = () => {
        setLoading(true);

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const latitude = position.coords.latitude;
                const longitude = position.coords.longitude;

                try {
                    const response = await axios.get(
                        "https://nominatim.openstreetmap.org/reverse",
                        {
                            params: {
                                lat: latitude,
                                lon: longitude,
                                format: "json",
                            },
                            headers: {
                                "Accept-Language": "id",
                            },
                        },
                    );

                    setFormData((p) => ({
                        ...p,
                        location: response.data.display_name,
                    }));
                } catch (error) {
                    console.error("Gagal mendapatkan alamat:", error);
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                console.error("Gagal mendapatkan lokasi:", error);
                setLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    };

    const handleSubmit = async (e) => {
        if (!isAuthenticated) {
            return;
        }

        e.preventDefault();
        const errs = {};
        if (!formData.type) errs.type = "Pilih jenis laporan";
        if (!formData.location) errs.location = "Lokasi wajib diisi";
        if (!formData.description) errs.description = "Deskripsi wajib diisi";
        if (!attachment) errs.attachment = "Lampiran gambar wajib diunggah";
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSubmitLoading(true);
        try {
            const fd = new FormData();
            fd.append("type", formData.type);
            fd.append("location", formData.location);
            fd.append("description", formData.description);
            fd.append("attachment", attachment);

            await reportService.createReport(fd);
            toast.success("Laporan berhasil dibuat!");
            setFormData({ type: "", location: "", description: "" });
            setAttachment(null);
            setErrors({});
            fetchReports();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal membuat laporan",
            );
        } finally {
            setSubmitLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Yakin ingin menghapus laporan ini?")) return;
        try {
            await reportService.deleteReport(id);
            toast.success("Laporan dihapus");
            setReports((prev) => prev.filter((r) => r.id !== id));
        } catch {
            toast.error("Gagal menghapus laporan");
        }
    };

    {
        return (
            <section
                id="report-section"
                className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 ${isPetugas && "hidden"}`}
            >
                <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                    <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Laporan <span className="text-orange-500">Warga</span>
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Laporkan permasalahan kota di sekitar lingkungan Anda
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    {/* Report Form */}
                    <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-xl shadow-gray-300/50">
                        <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                            <AlertTriangle
                                className="text-orange-500"
                                size={20}
                            />
                            Buat Laporan Baru
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Jenis Laporan{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <select
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                                        errors.type
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                    }`}
                                    value={formData.type}
                                    onChange={(e) => {
                                        setFormData((p) => ({
                                            ...p,
                                            type: e.target.value,
                                        }));
                                        setErrors((p) => ({ ...p, type: "" }));
                                    }}
                                >
                                    <option value="">
                                        Pilih jenis laporan
                                    </option>
                                    {reportTypes.map((t) => (
                                        <option key={t.value} value={t.value}>
                                            {t.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.type && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.type}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Lokasi Kejadiaan{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <div className="flex gap-2 justify-content-center">
                                    <input
                                        disabled={useLoc}
                                        type="text"
                                        className={`w-full ${useLoc ? "bg-gray-200 text-gray-700" : "bg-white text-black"} px-3.5 py-2.5 text-sm border rounded-xl outline-none transition-all ${
                                            errors.location
                                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                                : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                        }`}
                                        placeholder="Contoh: Jl. Sudirman No. 10, Jakarta Pusat"
                                        value={formData.location}
                                        onChange={(e) => {
                                            setFormData((p) => ({
                                                ...p,
                                                location: e.target.value,
                                            }));
                                            setErrors((p) => ({
                                                ...p,
                                                location: "",
                                            }));
                                        }}
                                    />
                                    <button
                                        onClick={() => {
                                            getLocation();
                                            setUseLoc(true);
                                        }}
                                        type="button"
                                        className="bg-orange-500 rounded-lg px-2 text-gray-100 text-sm shadow-sm hover:bg-orange-400 transition-all duration-300 cursor-pointer"
                                    >
                                        Lokasi Saat Ini
                                    </button>
                                </div>
                                {errors.location && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.location}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Deskripsi Detail{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    rows={3}
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all resize-y ${
                                        errors.description
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                    }`}
                                    placeholder="Jelaskan detail permasalahan yang Anda temukan..."
                                    value={formData.description}
                                    onChange={(e) => {
                                        setFormData((p) => ({
                                            ...p,
                                            description: e.target.value,
                                        }));
                                        setErrors((p) => ({
                                            ...p,
                                            description: "",
                                        }));
                                    }}
                                />
                                {errors.description && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.description}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Lampiran Foto{" "}
                                    <span className="text-red-500">*</span>
                                </label>
                                <FileUpload
                                    onFileSelect={setAttachment}
                                    maxSizeMB={5}
                                />
                                {errors.attachment && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.attachment}
                                    </p>
                                )}
                            </div>

                            {!isAuthenticated ? (
                                <div className="space-y-2.5">
                                    <button
                                        type="button"
                                        disabled
                                        className="w-full py-3.5 px-4 bg-gray-300 text-gray-500 font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-not-allowed"
                                    >
                                        <Lock size={16} />
                                        Login Terlebih Dahulu
                                    </button>
                                    <div className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200/80 rounded-xl">
                                        <Lock
                                            size={14}
                                            className="text-amber-600 shrink-0"
                                        />
                                        <p className="text-xs text-amber-700 font-medium">
                                            <Link
                                                to="/login"
                                                className="text-orange-600 font-bold hover:underline"
                                            >
                                                Masuk
                                            </Link>{" "}
                                            atau{" "}
                                            <Link
                                                to="/register"
                                                className="text-orange-600 font-bold hover:underline"
                                            >
                                                daftar akun
                                            </Link>{" "}
                                            untuk mengirim laporan.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <button
                                    type="submit"
                                    disabled={submitLoading}
                                    className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                                >
                                    {submitLoading ? (
                                        <>
                                            <Loader2
                                                size={18}
                                                className="animate-spin"
                                            />{" "}
                                            Mengirim...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={16} /> Buat Laporan
                                        </>
                                    )}
                                </button>
                            )}
                        </form>
                    </div>

                    {/* Reports List */}
                    <div className={`lg:col-span-7 space-y-4`}>
                        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between">
                            <span>Daftar Laporan Anda</span>
                            <span className="text-xs text-gray-400 font-normal">
                                {reports.length} Laporan
                            </span>
                        </h3>

                        {isAuthenticated ? (
                            loading ? (
                                <div className="space-y-4">
                                    {[1, 2].map((i) => (
                                        <div
                                            key={i}
                                            className="h-40 bg-gray-200/60 rounded-3xl animate-pulse"
                                        />
                                    ))}
                                </div>
                            ) : reports?.length === 0 ? (
                                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 shadow-sm text-gray-400 space-y-3">
                                    <AlertTriangle
                                        className="mx-auto text-gray-300"
                                        size={48}
                                    />
                                    <p className="font-bold text-gray-700">
                                        Belum ada laporan
                                    </p>
                                    <p className="text-xs text-gray-400 max-w-xs mx-auto">
                                        Anda belum membuat laporan permasalahan
                                        apapun saat ini.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 shadow-sm">
                                    {reports?.map((report) => (
                                        <div
                                            key={report.id}
                                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between mx-2 my-1"
                                        >
                                            <div>
                                                {report.attachment && (
                                                    <div className="h-40 w-full overflow-hidden bg-gray-100">
                                                        <img
                                                            src={
                                                                report.attachment.startsWith(
                                                                    "http",
                                                                )
                                                                    ? report.attachment
                                                                    : `${API_BASE_URL}${report.attachment}`
                                                            }
                                                            alt="Lampiran"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <div className="p-4 space-y-2">
                                                    <div className="flex items-center justify-between gap-2">
                                                        <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                                                            {reportTypes.find(
                                                                (t) =>
                                                                    t.value ===
                                                                    report.type,
                                                            )?.label ||
                                                                report.type}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 text-xs font-extrabold rounded-full ${
                                                                report.status ===
                                                                "finish"
                                                                    ? "bg-emerald-100 text-emerald-700"
                                                                    : "bg-amber-100 text-amber-700"
                                                            }`}
                                                        >
                                                            {report.status ===
                                                            "finish"
                                                                ? "Selesai"
                                                                : "Proses"}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                                                        <MapPin
                                                            size={13}
                                                            className="text-gray-400 shrink-0"
                                                        />
                                                        <span className="truncate">
                                                            {report.location}
                                                        </span>
                                                    </div>

                                                    <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                                        {report.description}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="px-4 py-3 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between text-xs text-gray-400">
                                                <span>
                                                    {new Date(
                                                        report.created_at,
                                                    ).toLocaleDateString(
                                                        "id-ID",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric",
                                                        },
                                                    )}
                                                </span>
                                                <button
                                                    onClick={() =>
                                                        handleDelete(report.id)
                                                    }
                                                    className="p-1 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                                    title="Hapus laporan"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="bg-white p-12 text-center rounded-3xl shadow-sm border border-gray-100 text-gray-400 space-y-3">
                                <Key
                                    className="mx-auto text-gray-300"
                                    size={64}
                                />
                                <p className="text-md font-bold text-gray-700">
                                    Anda Belum Login
                                </p>
                                <p className="text-sm text-gray-400 max-w-xs mx-auto">
                                    Silahkan login terlebih dahulu untuk melihat
                                    riwayat laporan anda
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        );
    }
}

/* ---- Transport Section ---- */
function TransportSection() {
    const [transports, setTransports] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNearestTransport();
    }, []);

    const fetchNearestTransport = async () => {
        try {
            const now = new Date();
            const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
            const all = [];

            const [trainRes, busRes, mrtRes, lrtRes] = await Promise.allSettled(
                [
                    mobilityService.listTrains(),
                    mobilityService.listBuses({ departure: currentTime }),
                    mobilityService.listMRT(),
                    mobilityService.listLRT(),
                ],
            );

            if (trainRes.status === "fulfilled") {
                const trains = trainRes.value.train || trainRes.value || [];
                trains
                    .filter((t) => t.departure >= currentTime)
                    .slice(0, 3)
                    .forEach((t) => {
                        all.push({
                            type: "train",
                            code: t.code,
                            direction: t.direction,
                            departure: t.departure,
                        });
                    });
            }

            if (busRes.status === "fulfilled") {
                const buses =
                    busRes.value.bus || busRes.value.data || busRes.value || [];
                (Array.isArray(buses) ? buses : []).slice(0, 3).forEach((b) => {
                    all.push({
                        type: "bus",
                        code: b.code,
                        direction: b.direction,
                        departure: b.departure,
                    });
                });
            }

            if (mrtRes.status === "fulfilled") {
                const mrts = mrtRes.value.train || mrtRes.value || [];
                mrts.filter((m) => m.departure >= currentTime)
                    .slice(0, 3)
                    .forEach((m) => {
                        all.push({
                            type: "mrt",
                            code: m.code,
                            direction: m.destination,
                            departure: m.departure,
                        });
                    });
            }

            if (lrtRes.status === "fulfilled") {
                const lrts = lrtRes.value.train || lrtRes.value || [];
                (Array.isArray(lrts) ? lrts : []).slice(0, 3).forEach((l) => {
                    all.push({
                        type: "lrt",
                        code: l.code,
                        direction: l.destination,
                        departure: l.departure,
                    });
                });
            }

            all.sort((a, b) => a.departure.localeCompare(b.departure));
            setTransports(all.slice(0, 8));
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const getWaitTime = (departure) => {
        const now = new Date();
        const [h, m] = departure.split(":").map(Number);
        const depDate = new Date(now);
        depDate.setHours(h, m, 0, 0);
        const diffMs = depDate - now;
        if (diffMs < 0) return null;
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return "Segera tiba";
        if (mins < 60) return `${mins} menit lagi`;
        return `${Math.floor(mins / 60)}j ${mins % 60}m lagi`;
    };

    const typeLabel = { train: "Kereta", bus: "Bus", mrt: "MRT", lrt: "LRT" };
    const typeBadgeStyle = {
        train: "bg-amber-100 text-amber-800 border-amber-200",
        bus: "bg-blue-100 text-blue-800 border-blue-200",
        mrt: "bg-purple-100 text-purple-800 border-purple-200",
        lrt: "bg-emerald-100 text-emerald-800 border-emerald-200",
    };
    const typeIcon = { train: "🚆", bus: "🚌", mrt: "🚇", lrt: "🚈" };

    return (
        <section
            id="transport-section"
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
        >
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
                            Jadwal Transportasi{" "}
                            <span className="text-orange-500">Terdekat</span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Keberangkatan tercepat dari waktu saat ini
                        </p>
                    </div>

                    <button
                        onClick={() => (window.location.href = "/mobilitas")}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-700 font-bold text-xs rounded-xl transition-colors shrink-0"
                    >
                        Lihat Semua Jadwal
                        <ArrowRight size={14} />
                    </button>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : transports.length === 0 ? (
                    <div className="py-12 text-center text-gray-400 space-y-2">
                        <Bus className="mx-auto text-gray-300" size={40} />
                        <p className="font-bold text-gray-700">
                            Tidak ada jadwal tersedia
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {transports.map((t, i) => (
                            <div
                                key={i}
                                className="bg-gray-50/70 hover:bg-orange-50/40 p-4 rounded-2xl border border-gray-200/60 transition-all hover:border-orange-200 flex items-center justify-between gap-3 group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-11 h-11 rounded-xl bg-white shadow-xs border border-gray-100 flex items-center justify-center text-xl shrink-0">
                                        {typeIcon[t.type]}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-1.5 mb-0.5">
                                            <span
                                                className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md border ${typeBadgeStyle[t.type]}`}
                                            >
                                                {typeLabel[t.type]}
                                            </span>
                                            <span className="text-xs font-bold text-gray-900">
                                                {t.code}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500 max-w-[110px] truncate">
                                            {t.direction}
                                        </p>
                                    </div>
                                </div>

                                <div className="text-right shrink-0">
                                    <p className="text-sm font-black text-orange-600">
                                        {t.departure}
                                    </p>
                                    <p className="text-[10px] text-gray-400 font-medium">
                                        {getWaitTime(t.departure)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

/* ---- Petugas Report Section ---- */
function PetugasReportSection() {
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");

    useEffect(() => {
        fetchAllReports();
    }, []);

    const fetchAllReports = async () => {
        try {
            const res = await reportService.getAllReports();
            setReports(res.report || res.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkFinish = async (id) => {
        setActionLoading(id);
        try {
            await reportService.updateReport(id);
            toast.success("Laporan berhasil ditandai selesai");
            fetchAllReports();
        } catch {
            toast.error("Gagal mengubah status laporan");
        } finally {
            setActionLoading(null);
        }
    };

    const reportTypes = [
        { value: "infrastruktur", label: "Jalan Berlubang" },
        { value: "fasilitas", label: "Fasilitas Umum Rusak" },
        { value: "pelanggaran", label: "Pelanggaran Umum" },
        { value: "lingkungan", label: "Lingkungan Kotor" },
    ];

    const filteredReports =
        filterStatus === "all"
            ? reports
            : reports.filter((r) => r.status === filterStatus);

    const totalUnfinished = reports.filter(
        (r) => r.status === "unfinished",
    ).length;
    const totalFinished = reports.filter((r) => r.status === "finish").length;
    console.log(filteredReports);

    const openGoogleMaps = (address) => {
        const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;

        window.open(url, "_blank");
    };

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                    Kelola Laporan{" "}
                    <span className="text-orange-500">Warga</span>
                </h2>
                <p className="text-gray-500 text-sm">
                    Tinjau dan tanggapi seluruh laporan permasalahan kota dari
                    warga
                </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
                {[
                    { value: "all", label: "Semua" },
                    { value: "unfinished", label: "Belum Selesai" },
                    { value: "finish", label: "Selesai" },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        onClick={() => setFilterStatus(tab.value)}
                        className={`px-4 py-2 text-xs font-bold rounded-xl transition-colors whitespace-nowrap cursor-pointer ${
                            filterStatus === tab.value
                                ? "bg-orange-500 text-white shadow-xs"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Report List */}
            {loading ? (
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-28 bg-gray-200/60 rounded-2xl animate-pulse"
                        />
                    ))}
                </div>
            ) : filteredReports.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 space-y-3">
                    <AlertTriangle
                        className="mx-auto text-gray-300"
                        size={48}
                    />
                    <p className="font-bold text-gray-700">
                        Tidak ada laporan ditemukan
                    </p>
                    <p className="text-xs text-gray-400">
                        Belum ada laporan yang sesuai dengan filter saat ini.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReports.map((report) => (
                        <div
                            key={report.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-xs hover:shadow-md transition-shadow overflow-hidden"
                        >
                            <div className="flex flex-col sm:flex-row">
                                {/* Attachment Image */}
                                {report.attachment && (
                                    <div className="sm:w-48 h-40 sm:h-auto shrink-0 bg-gray-100 overflow-hidden">
                                        <img
                                            src={
                                                typeof report.attachment ===
                                                "object"
                                                    ? `${API_BASE_URL}/storage/${report.attachment.img_url}`
                                                    : report.attachment.startsWith(
                                                            "http",
                                                        )
                                                      ? report.attachment
                                                      : `${API_BASE_URL}/storage/${report.attachment}`
                                            }
                                            alt="Lampiran"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* Report Details */}
                                <div className="flex-1 p-4 sm:p-5 flex flex-col justify-between gap-3">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between gap-2 flex-wrap">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                                                    {reportTypes.find(
                                                        (t) =>
                                                            t.value ===
                                                            report.type,
                                                    )?.label || report.type}
                                                </span>
                                                <span
                                                    className={`px-2.5 py-0.5 text-[10px] font-extrabold uppercase rounded-full border ${
                                                        report.status ===
                                                        "finish"
                                                            ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                                            : "bg-amber-100 text-amber-700 border-amber-200"
                                                    }`}
                                                >
                                                    {report.status === "finish"
                                                        ? "Selesai"
                                                        : "Belum Selesai"}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-400">
                                                {report.created_at}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <span className="font-bold text-gray-800">
                                                Pelapor:
                                            </span>
                                            <span>{report.name || "-"}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                            <MapPin
                                                size={13}
                                                className="text-gray-400 shrink-0"
                                            />
                                            <a
                                                className="truncate hover:underline cursor-pointer"
                                                onClick={() =>
                                                    openGoogleMaps(
                                                        report.location,
                                                    )
                                                }
                                            >
                                                {report.location}
                                            </a>
                                        </div>

                                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                                            {report.description}
                                        </p>
                                    </div>

                                    {/* Action Button */}
                                    {report.status !== "finish" && (
                                        <button
                                            onClick={() =>
                                                handleMarkFinish(report.id)
                                            }
                                            disabled={
                                                actionLoading === report.id
                                            }
                                            className="self-start px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
                                        >
                                            {actionLoading === report.id ? (
                                                <Loader2
                                                    size={14}
                                                    className="animate-spin"
                                                />
                                            ) : (
                                                <CheckCircle size={14} />
                                            )}
                                            Tandai Selesai
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
