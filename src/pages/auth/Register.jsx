import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "@/services/auth";
import AuthLayout from "@/components/layout/AuthLayout";
import { WargaTechLogoMark } from "@/components/common/WargaTechLogo";
import {
    Loader2,
    ArrowRight,
    Eye,
    EyeOff,
    ShieldCheck,
    Calendar,
    ChevronDown,
    Building2,
} from "lucide-react";
import toast from "react-hot-toast";
import logo from "../../assets/logo_app.png";

export default function Register() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        gender: "",
        phone: "",
        birthday: "",
        nik: "",
        nomor_kk: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!formData.name || formData.name.length < 3)
            errs.name = "Nama minimal 3 karakter";
        else if (!/^[A-Za-z ]+$/.test(formData.name))
            errs.name = "Nama hanya huruf & spasi";
        if (!formData.email) errs.email = "Email wajib diisi";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            errs.email = "Format email tidak valid";
        if (!formData.password || formData.password.length < 6)
            errs.password = "Password minimal 6 karakter";
        if (!formData.gender) errs.gender = "Pilih jenis kelamin";
        if (!formData.phone) errs.phone = "Nomor telepon wajib diisi";
        else if (formData.phone.length < 10 || formData.phone.length > 16)
            errs.phone = "Telepon 10-16 digit";
        if (!formData.birthday) errs.birthday = "Tanggal lahir wajib diisi";
        if (!formData.nik) errs.nik = "NIK wajib diisi";
        else if (formData.nik.length !== 16) errs.nik = "NIK harus 16 digit";
        if (!formData.nomor_kk) errs.nomor_kk = "Nomor KK wajib diisi";
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        try {
            await authService.register(formData);
            toast.success("Pendaftaran berhasil! Silakan verifikasi email.");
            navigate(`/verify?email=${encodeURIComponent(formData.email)}`);
        } catch (error) {
            if (error.response?.status === 422) {
                const serverErrors = error.response.data.errors || {};
                const fieldErrors = {};
                Object.entries(serverErrors).forEach(([key, msgs]) => {
                    fieldErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                });
                setErrors(fieldErrors);
                toast.error("Data tidak valid, periksa kembali");
            } else {
                toast.error("Pendaftaran gagal, coba lagi");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    };

    return (
        <AuthLayout>
            <div className="w-full max-w-5xl bg-white rounded-3xl shadow-xl shadow-orange-500/5 border border-gray-100 flex flex-col lg:flex-row overflow-hidden text-left">
                <div className="w-full lg:w-[40%] bg-[#fdfaf7] p-8 sm:p-10 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-gray-100">
                    <div>
                        <Link
                            to="/"
                            className="flex justify-center items-center gap-2 pb-2 group"
                        >
                            <img
                                src={logo}
                                alt="WargaTech Logo"
                                className="h-16 w-16 transition-transform"
                            />
                            <h3
                                className={`text-2xl items-center justify-items-center font-black tracking-tight transition-colors`}
                            >
                                <span className="text-gray-600">Warga</span>
                                <span className="text-orange-500">Tech</span>
                            </h3>
                        </Link>
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-900 leading-tight mb-4 tracking-tight">
                            Aksi Nyata,{" "}
                            <span className="text-orange-500">
                                Mulai dari Anda.
                            </span>
                        </h2>
                        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed font-normal">
                            Bergabunglah dengan platform terdepan dalam
                            efisiensi sipil dan keberlanjutan kota. Satu akun
                            untuk semua inisiatif pintar.
                        </p>
                    </div>

                    {/* Feature Badges */}
                    <div className="space-y-4 pt-8 lg:pt-12">
                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 shadow-xs">
                                <ShieldCheck size={20} />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">
                                Data terenkripsi dan aman
                            </span>
                        </div>

                        <div className="flex items-center gap-3.5">
                            <div className="w-10 h-10 rounded-full bg-gray-200/80 text-gray-700 flex items-center justify-center shrink-0 shadow-xs">
                                <Building2 size={19} />
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-gray-800">
                                Akses instan ke layanan kota
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Form Panel */}
                <div className="w-full lg:w-[60%] p-8 sm:p-10 lg:p-12 flex flex-col justify-center">
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Buat Akun{" "}
                            <span className="text-orange-500">Baru</span>
                        </h1>
                        <p className="text-xs sm:text-sm text-gray-500 mt-1">
                            Lengkapi data diri Anda sesuai identitas resmi.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nama Lengkap */}
                        <div>
                            <label
                                className="block text-xs font-bold text-gray-800 mb-1.5"
                                htmlFor="reg-name"
                            >
                                Nama Lengkap
                            </label>
                            <input
                                id="reg-name"
                                type="text"
                                className={`w-full px-4 py-3 text-sm bg-white border rounded-xl text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                    errors.name
                                        ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                        : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                }`}
                                placeholder="Sesuai KTP"
                                value={formData.name}
                                onChange={(e) =>
                                    handleChange("name", e.target.value)
                                }
                            />
                            {errors.name && (
                                <p className="text-xs text-red-500 font-medium mt-1">
                                    {errors.name}
                                </p>
                            )}
                        </div>

                        {/* Row 2: NIK & KK */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-800 mb-1.5"
                                    htmlFor="reg-nik"
                                >
                                    NIK (Nomor Induk Kependudukan)
                                </label>
                                <input
                                    id="reg-nik"
                                    type="text"
                                    maxLength={16}
                                    className={`w-full px-4 py-3 text-sm bg-white border rounded-xl text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                        errors.nik
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                    }`}
                                    placeholder="16 Digit Angka"
                                    value={formData.nik}
                                    onChange={(e) =>
                                        handleChange(
                                            "nik",
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                />
                                {errors.nik && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.nik}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-800 mb-1.5"
                                    htmlFor="reg-kk"
                                >
                                    Nomor KK (Kartu Keluarga)
                                </label>
                                <input
                                    id="reg-kk"
                                    type="text"
                                    maxLength={16}
                                    className={`w-full px-4 py-3 text-sm bg-white border rounded-xl text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                        errors.nomor_kk
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                    }`}
                                    placeholder="16 Digit Angka"
                                    value={formData.nomor_kk}
                                    onChange={(e) =>
                                        handleChange(
                                            "nomor_kk",
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                />
                                {errors.nomor_kk && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.nomor_kk}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Row 3: Tanggal Lahir & Jenis Kelamin */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-800 mb-1.5"
                                    htmlFor="reg-birthday"
                                >
                                    Tanggal Lahir
                                </label>
                                <div className="relative">
                                    <input
                                        id="reg-birthday"
                                        type="date"
                                        className={`w-full pl-4 pr-10 py-3 text-sm bg-white border rounded-xl text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                            errors.birthday
                                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                                : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                        }`}
                                        value={formData.birthday}
                                        onChange={(e) =>
                                            handleChange(
                                                "birthday",
                                                e.target.value,
                                            )
                                        }
                                    />
                                    <Calendar
                                        size={18}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                                {errors.birthday && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.birthday}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-800 mb-1.5"
                                    htmlFor="reg-gender"
                                >
                                    Jenis Kelamin
                                </label>
                                <div className="relative">
                                    <select
                                        id="reg-gender"
                                        className={`w-full pl-4 pr-10 py-3 text-sm bg-white border rounded-xl text-gray-800 outline-none appearance-none transition-all ${
                                            errors.gender
                                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                                : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                        } ${!formData.gender ? "text-gray-400" : "text-gray-800"}`}
                                        value={formData.gender}
                                        onChange={(e) =>
                                            handleChange(
                                                "gender",
                                                e.target.value,
                                            )
                                        }
                                    >
                                        <option value="" disabled hidden>
                                            Pilih...
                                        </option>
                                        <option
                                            value="male"
                                            className="text-gray-800"
                                        >
                                            Laki-laki
                                        </option>
                                        <option
                                            value="female"
                                            className="text-gray-800"
                                        >
                                            Perempuan
                                        </option>
                                    </select>
                                    <ChevronDown
                                        size={18}
                                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                </div>
                                {errors.gender && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Row 4: Email & Phone */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-800 mb-1.5"
                                    htmlFor="reg-email"
                                >
                                    Email
                                </label>
                                <input
                                    id="reg-email"
                                    type="email"
                                    className={`w-full px-4 py-3 text-sm bg-white border rounded-xl text-gray-800 placeholder-gray-400 outline-none transition-all ${
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
                                {errors.email && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    className="block text-xs font-bold text-gray-800 mb-1.5"
                                    htmlFor="reg-phone"
                                >
                                    Nomor Telepon
                                </label>
                                <input
                                    id="reg-phone"
                                    type="tel"
                                    className={`w-full px-4 py-3 text-sm bg-white border rounded-xl text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                        errors.phone
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                    }`}
                                    placeholder="08xx-xxxx-xxxx"
                                    value={formData.phone}
                                    onChange={(e) =>
                                        handleChange(
                                            "phone",
                                            e.target.value.replace(/\D/g, ""),
                                        )
                                    }
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Row 5: Password */}
                        <div>
                            <label
                                className="block text-xs font-bold text-gray-800 mb-1.5"
                                htmlFor="reg-password"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="reg-password"
                                    type={showPassword ? "text" : "password"}
                                    className={`w-full pl-4 pr-11 py-3 text-sm bg-white border rounded-xl text-gray-800 placeholder-gray-400 outline-none transition-all ${
                                        errors.password
                                            ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                            : "border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                    }`}
                                    placeholder="Minimal 8 karakter"
                                    value={formData.password}
                                    onChange={(e) =>
                                        handleChange("password", e.target.value)
                                    }
                                    autoComplete="new-password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-500 font-medium mt-1">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Terms Agreement text */}
                        <p className="text-[11px] sm:text-xs text-gray-600 leading-relaxed pt-1">
                            Dengan mendaftar, Anda menyetujui{" "}
                            <button
                                type="button"
                                onClick={() => toast.info("Syarat & Ketentuan")}
                                className="font-bold text-orange-500 hover:text-orange-600 hover:underline cursor-pointer"
                            >
                                Syarat Ketentuan
                            </button>{" "}
                            dan{" "}
                            <button
                                type="button"
                                onClick={() => toast.info("Kebijakan Privasi")}
                                className="font-bold text-orange-500 hover:text-orange-600 hover:underline cursor-pointer"
                            >
                                Kebijakan Privasi
                            </button>{" "}
                            WargaTech.
                        </p>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 px-4 bg-orange-500 hover:bg-orange-600 active:scale-[0.98] text-white font-bold text-sm rounded-xl shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-3"
                        >
                            {loading ? (
                                <>
                                    <Loader2
                                        size={18}
                                        className="animate-spin"
                                    />
                                    Mendaftarkan...
                                </>
                            ) : (
                                <>
                                    Daftar Sekarang
                                    <ArrowRight size={18} />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Bottom link */}
                    <p className="text-center text-xs sm:text-sm text-gray-600 font-medium mt-6">
                        Sudah punya akun?{" "}
                        <Link
                            to="/login"
                            className="font-bold text-orange-500 hover:text-orange-600 hover:underline"
                        >
                            Masuk di sini
                        </Link>
                    </p>
                </div>
            </div>
        </AuthLayout>
    );
}
