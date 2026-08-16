import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { profileService } from "@/services/profile";
import OTPInput from "@/components/common/OTPInput";
import Modal from "@/components/common/Modal";
import { Camera, Trash2, Loader2, Shield, Save, User } from "lucide-react";
import toast from "react-hot-toast";
import { API_BASE_URL } from "@/services/api";
import loadingAnimation from "../../assets/loading.gif";

export default function Pengaturan() {
    const { user, updateUser } = useAuth();
    const [profile, setProfile] = useState(null);
    const [profilePicture, setProfilePicture] = useState(null);
    const [loading, setLoading] = useState(true);

    // Edit flow
    const [editMode, setEditMode] = useState(false);
    const [verifyModal, setVerifyModal] = useState(false);
    const [verifyCode, setVerifyCode] = useState("");
    const [verifyLoading, setVerifyLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        gender: "",
        phone: "",
        birthday: "",
        nik: "",
        nomor_kk: "",
    });
    const [errors, setErrors] = useState({});

    // Photo
    const photoInputRef = useRef(null);
    const [photoLoading, setPhotoLoading] = useState(false);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await profileService.getProfile();
            const data = res.data || res;
            const u = data.user || data;
            setProfile(u);
            setProfilePicture(data.profile_picture);
            setFormData({
                name: u.name || "",
                gender: u.gender || "",
                phone: u.phone || "",
                birthday: u.birthday || "",
                nik: u.nik || "",
                nomor_kk: u.nomor_kk || "",
            });
        } catch {
            toast.error("Gagal memuat profil");
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getPhotoUrl = () => {
        if (!profilePicture) return null;
        if (profilePicture.startsWith("http")) return profilePicture;
        return `${API_BASE_URL}/${profilePicture}`;
    };

    const handleEditClick = async () => {
        setEditMode(true);
    };

    const handleVerify = async () => {
        if (verifyCode.length !== 6) {
            toast.error("Masukkan 6 digit kode verifikasi");
            return;
        }
        setVerifyLoading(true);
        try {
            await profileService.verifyCode({
                email: profile.email,
                code: verifyCode,
            });
            setVerifyModal(false);
            toast.success("Verifikasi berhasil! Silakan ubah data profil.");
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Kode verifikasi salah",
            );
        } finally {
            setVerifyLoading(false);
        }
    };

    const handleSaveProfile = async () => {
        const errs = {};
        if (!formData.name || formData.name.length < 3)
            errs.name = "Nama minimal 3 karakter";
        if (!formData.gender) errs.gender = "Pilih jenis kelamin";
        if (!formData.phone || formData.phone.length < 12)
            errs.phone = "Nomor telepon 12-16 digit";
        if (!formData.birthday) errs.birthday = "Tanggal lahir wajib diisi";
        if (!formData.nik || formData.nik.length !== 16)
            errs.nik = "NIK harus 16 digit";
        if (!formData.nomor_kk) errs.nomor_kk = "Nomor KK wajib diisi";
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setSaving(true);
        try {
            await profileService.updateProfile(formData);
            toast.success("Profil berhasil diperbarui");
            setEditMode(false);
            updateUser({ ...user, ...formData });
            fetchProfile();
        } catch (error) {
            const serverErrors = error.response?.data?.errors;
            if (serverErrors) {
                const fieldErrors = {};
                Object.entries(serverErrors).forEach(([key, msgs]) => {
                    fieldErrors[key] = Array.isArray(msgs) ? msgs[0] : msgs;
                });
                setErrors(fieldErrors);
            }
            toast.error(
                error.response?.data?.message || "Gagal menyimpan profil",
            );
            if (
                error.response?.status === 422 &&
                error.response?.data?.message ===
                    "Mohon verifikasi terlebih dahulu"
            ) {
                setVerifyModal(true);
            }
        } finally {
            setTimeout(() => {
                setSaving(false);
            }, 500);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        if (file.size > 2 * 1024 * 1024) {
            toast.error("Ukuran foto maksimal 2MB");
            return;
        }
        setPhotoLoading(true);
        try {
            const fd = new FormData();
            fd.append("attachment", file);
            await profileService.uploadPhoto(fd);
            toast.success("Foto profil berhasil diubah");
            fetchProfile();
        } catch {
            toast.error("Gagal mengunggah foto");
        } finally {
            setPhotoLoading(false);
        }
    };

    const handlePhotoDelete = async () => {
        if (!confirm("Yakin ingin menghapus foto profil?")) return;
        setPhotoLoading(true);
        try {
            await profileService.deletePhoto();
            toast.success("Foto profil dihapus");
            setProfilePicture(null);
            fetchProfile();
        } catch {
            toast.error("Gagal menghapus foto");
        } finally {
            setPhotoLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-8 space-y-6">
                <div className="h-32 bg-gray-200 rounded-3xl animate-pulse" />
                <div className="h-96 bg-gray-200 rounded-3xl animate-pulse" />
            </div>
        );
    }

    const photoUrl = getPhotoUrl();

    return (
        <>
            {saving && (
                <div className="fixed flex z-100 inset-0 top-0 w-full h-full bg-black/50 items-center justify-center">
                    <img src={loadingAnimation}></img>
                </div>
            )}
            <div className="space-y-8 pb-16">
                {/* Page Header */}
                <div className="bg-white border-b border-gray-200/80 pt-24 pb-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6">
                        <div className="flex items-center gap-3">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                    Pengaturan Profil
                                </h1>
                                <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                    Kelola identitas diri dan foto profil Anda
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
                    {/* Profile Avatar Card */}
                    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                        <div className="relative shrink-0">
                            {photoUrl ? (
                                <img
                                    src={photoUrl}
                                    alt="Foto Profil"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-orange-100 shadow-md"
                                />
                            ) : (
                                <img
                                    src={photoUrl}
                                    alt="Foto Profil"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-orange-100 shadow-md"
                                />
                            )}

                            {photoLoading && (
                                <div className="absolute inset-0 rounded-full bg-white/80 flex items-center justify-center">
                                    <Loader2
                                        size={24}
                                        className="animate-spin text-orange-500"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="space-y-2 flex-1">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">
                                    {profile?.name}
                                </h2>
                                <p className="text-xs text-gray-500 font-medium">
                                    {profile?.email}
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                                <input
                                    ref={photoInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoUpload}
                                />
                                <button
                                    onClick={() =>
                                        photoInputRef.current?.click()
                                    }
                                    disabled={photoLoading}
                                    className="px-4 py-2 bg-gray-100 hover:bg-orange-50 hover:text-orange-600 text-gray-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                                >
                                    <Camera size={15} /> Ubah Foto Profil
                                </button>

                                {profilePicture && (
                                    <button
                                        disabled={
                                            profilePicture ===
                                            "images/default-profile.jpg"
                                        }
                                        onClick={handlePhotoDelete}
                                        className={`px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                                            profilePicture ===
                                                "images/default-profile.jpg" &&
                                            "hidden"
                                        }`}
                                    >
                                        <Trash2 size={15} /> Hapus Foto
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Profile Info Form */}
                    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                        <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <div>
                                <h3 className="text-base font-bold text-gray-900">
                                    Data Identitas Pengguna
                                </h3>
                            </div>

                            {!editMode ? (
                                <button
                                    onClick={handleEditClick}
                                    className="px-4 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                                >
                                    Edit Data Profil
                                </button>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => {
                                            setEditMode(false);
                                            setErrors({});
                                            fetchProfile();
                                        }}
                                        className="px-3.5 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                                    >
                                        Batal
                                    </button>
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                                    >
                                        {saving ? (
                                            <Loader2
                                                size={14}
                                                className="animate-spin"
                                            />
                                        ) : (
                                            <Save size={14} />
                                        )}
                                        Simpan Perubahan
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Nama Lengkap
                                </label>
                                <input
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                                        !editMode
                                            ? "bg-gray-50 text-gray-600 border-gray-200"
                                            : "border-gray-200 focus:border-orange-500"
                                    }`}
                                    value={formData.name}
                                    disabled={!editMode}
                                    onChange={(e) => {
                                        setFormData((p) => ({
                                            ...p,
                                            name: e.target.value,
                                        }));
                                        setErrors((p) => ({ ...p, name: "" }));
                                    }}
                                />
                                {errors.name && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Alamat Email
                                </label>
                                <input
                                    className="w-full px-3.5 py-2.5 text-sm bg-gray-100 text-gray-500 border border-gray-200 rounded-xl outline-none cursor-not-allowed"
                                    value={profile?.email || ""}
                                    disabled
                                />
                                <p className="text-[10px] text-gray-400 mt-1">
                                    Email utama akun tidak dapat diubah
                                </p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Jenis Kelamin
                                </label>
                                <select
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                                        !editMode
                                            ? "bg-gray-50 text-gray-600 border-gray-200"
                                            : "border-gray-200 focus:border-orange-500"
                                    }`}
                                    value={formData.gender}
                                    disabled={!editMode}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            gender: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">Pilih</option>
                                    <option value="male">Laki-laki</option>
                                    <option value="female">Perempuan</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.gender}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    No. Telepon
                                </label>
                                <input
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                                        !editMode
                                            ? "bg-gray-50 text-gray-600 border-gray-200"
                                            : "border-gray-200 focus:border-orange-500"
                                    }`}
                                    value={formData.phone}
                                    disabled={!editMode}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            phone: e.target.value.replace(
                                                /\D/g,
                                                "",
                                            ),
                                        }))
                                    }
                                />
                                {errors.phone && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.phone}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Tanggal Lahir
                                </label>
                                <input
                                    type="date"
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                                        !editMode
                                            ? "bg-gray-50 text-gray-600 border-gray-200"
                                            : "border-gray-200 focus:border-orange-500"
                                    }`}
                                    value={formData.birthday}
                                    disabled={!editMode}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            birthday: e.target.value,
                                        }))
                                    }
                                />
                                {errors.birthday && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.birthday}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    NIK (16 Digit)
                                </label>
                                <input
                                    maxLength={16}
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                                        !editMode
                                            ? "bg-gray-50 text-gray-600 border-gray-200"
                                            : "border-gray-200 focus:border-orange-500"
                                    }`}
                                    value={formData.nik}
                                    disabled={!editMode}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            nik: e.target.value.replace(
                                                /\D/g,
                                                "",
                                            ),
                                        }))
                                    }
                                />
                                {errors.nik && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.nik}
                                    </p>
                                )}
                            </div>

                            <div className="sm:col-span-2">
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Nomor Kartu Keluarga (KK)
                                </label>
                                <input
                                    className={`w-full px-3.5 py-2.5 text-sm bg-white border rounded-xl outline-none transition-all ${
                                        !editMode
                                            ? "bg-gray-50 text-gray-600 border-gray-200"
                                            : "border-gray-200 focus:border-orange-500"
                                    }`}
                                    value={formData.nomor_kk}
                                    disabled={!editMode}
                                    onChange={(e) =>
                                        setFormData((p) => ({
                                            ...p,
                                            nomor_kk: e.target.value,
                                        }))
                                    }
                                />
                                {errors.nomor_kk && (
                                    <p className="text-xs text-red-500 font-medium mt-1">
                                        {errors.nomor_kk}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Verify Modal */}
                <Modal
                    isOpen={verifyModal}
                    onClose={() => setVerifyModal(false)}
                    title="Verifikasi Keamanan Email"
                    footer={
                        <>
                            <button
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                                onClick={() => setVerifyModal(false)}
                            >
                                Batal
                            </button>
                            <button
                                className={`px-5 py-2 text-xs font-bold  text-white rounded-xl shadow-md ${verifyCode.length < 6 ? "bg-gray-500" : "bg-orange-500 hover:bg-orange-600"}`}
                                onClick={handleVerify}
                                disabled={
                                    verifyLoading || verifyCode.length < 6
                                }
                            >
                                {verifyLoading ? (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Verifikasi Kode"
                                )}
                            </button>
                        </>
                    }
                >
                    <div className="text-center py-2 space-y-3">
                        <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center mx-auto text-2xl">
                            <Shield size={28} />
                        </div>
                        <p className="text-sm text-gray-600">
                            Kode verifikasi 8-digit telah dikirimkan ke email{" "}
                            <span className="font-bold text-gray-900">
                                {profile?.email}
                            </span>
                            . Masukkan kode untuk membuka akses pengeditan
                            profil.
                        </p>
                        <input
                            type="text"
                            onChange={(e) => setVerifyCode(e.target.value)}
                            className="w-full py-2 pl-6 bg-gray-200 border-gray-300 rounded-lg outline-gray-400"
                            placeholder="6 digit kode"
                        ></input>
                    </div>
                </Modal>
            </div>
        </>
    );
}
