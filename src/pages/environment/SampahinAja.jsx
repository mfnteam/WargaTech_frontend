import { useState, useRef } from "react";
import axios from "axios";
import { Camera, Upload, X, Loader2, Search, Sparkles } from "lucide-react";

export default function SampahinAja() {
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    const videoRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isCameraActive, setIsCameraActive] = useState(false);

    const getBadgeColor = (kategori) => {
        switch (kategori?.toLowerCase()) {
            case "organik":
                return "bg-emerald-100 text-emerald-700 border-emerald-200";
            case "anorganik":
                return "bg-blue-100 text-blue-700 border-blue-200";
            case "limbah b3":
                return "bg-red-100 text-red-700 border-red-200";
            case "residu":
                return "bg-amber-100 text-amber-800 border-amber-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getKategoriDeskripsi = (kategori) => {
        switch (kategori?.toLowerCase()) {
            case "organik":
                return "Sampah yang berasal dari makhluk hidup dan dapat terurai secara alami, seperti sisa makanan, daun, dan sayuran.";
            case "anorganik":
                return "Sampah yang tidak dapat terurai secara alami dan membutuhkan waktu lama untuk hancur, seperti plastik, kaca, dan logam.";
            case "limbah b3":
                return "Limbah Bahan Berbahaya dan Beracun yang dapat membahayakan kesehatan dan lingkungan, seperti baterai, obat kadaluarsa, dan pestisida.";
            case "residu":
                return "Sampah sisa yang tidak dapat didaur ulang maupun dikompos, seperti popok bekas, styrofoam kotor, dan puntung rokok.";
            default:
                return "Kategori sampah tidak dikenali.";
        }
    };

    const getAccuracyColor = (confidence) => {
        const value = parseFloat(confidence);
        if (value >= 70) return "bg-emerald-500";
        if (value >= 50) return "bg-amber-500";
        return "bg-red-500";
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setResult(null);
        }
    };

    const aktifkanKamera = async () => {
        setIsCameraActive(true);
        setPreview(null);
        setResult(null);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "environment" },
            });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            alert("Gagal mengakses kamera: " + err.message);
            setIsCameraActive(false);
        }
    };

    const matikanKamera = () => {
        if (videoRef.current?.srcObject) {
            videoRef.current.srcObject.getTracks().forEach((t) => t.stop());
        }
        setIsCameraActive(false);
    };

    const ambilFotoDanDeteksi = () => {
        const video = videoRef.current;
        if (!video) return;

        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            const file = new File([blob], "webcam_capture.jpg", {
                type: "image/jpeg",
            });
            setImage(file);
            setPreview(canvas.toDataURL("image/jpeg"));
            matikanKamera();
            kirimKeBackend(file);
        }, "image/jpeg");
    };

    const kirimKeBackend = async (fileToSend = image) => {
        if (!fileToSend) return;

        setLoading(true);
        const formData = new FormData();
        formData.append("file", fileToSend);

        try {
            const response = await axios.post(
                "https://sampahinaja-production.up.railway.app/predict",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } },
            );
            setResult(response.data);
        } catch (error) {
            console.error(error);
            alert("Terjadi kesalahan koneksi ke server backend.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 py-12 pt-24">
            <div className="w-full max-w-xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">
                        Pendeteksi Sampah
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Klasifikasi 4 Kategori Sampah Berbasis AI
                    </p>
                </div>

                {/* Main Card */}
                <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Preview / Camera Area */}
                    <div
                        className="relative w-full bg-slate-900 flex items-center justify-center"
                        style={{ minHeight: "320px" }}
                    >
                        {isCameraActive ? (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-full object-cover absolute inset-0"
                                    style={{ minHeight: "320px" }}
                                />
                                <button
                                    onClick={matikanKamera}
                                    className="absolute top-3 right-3 z-10 w-9 h-9 bg-gray-700/70 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                >
                                    <X size={18} />
                                </button>
                            </>
                        ) : preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                className="w-full h-full object-contain"
                                style={{
                                    minHeight: "320px",
                                    maxHeight: "400px",
                                }}
                            />
                        ) : (
                            <div className="text-center text-gray-400 px-6 py-12">
                                <Camera
                                    size={48}
                                    className="mx-auto mb-3 text-gray-500"
                                />
                                <p className="text-sm">
                                    Belum ada gambar terpilih atau kamera belum
                                    diaktifkan
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Card Body */}
                    <div className="p-5 sm:p-6 space-y-4">
                        {/* Detection Result */}
                        {result && (
                            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 space-y-2.5">
                                <div className="flex items-center justify-between gap-3">
                                    <div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                                            Hasil Deteksi
                                        </span>
                                        <h4 className="text-lg font-extrabold text-gray-900 mt-0.5">
                                            {result.prediction}
                                        </h4>
                                    </div>
                                    <span
                                        className={`${getAccuracyColor(result.confidence)} text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-xs`}
                                    >
                                        {result.confidence}% Akurat
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {getKategoriDeskripsi(result.prediction)}
                                </p>
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className="grid grid-cols-2 gap-3">
                            {/* Upload Foto */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleFileChange}
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center justify-center gap-2 py-3.5 px-4 border-2 border-blue-500 text-blue-600 font-bold text-sm rounded-xl hover:bg-blue-50 active:scale-[0.98] transition-all cursor-pointer"
                            >
                                📁 Upload Foto
                            </button>

                            {/* Buka Kamera / Ambil Foto */}
                            {!isCameraActive ? (
                                <button
                                    onClick={aktifkanKamera}
                                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    📷 Buka Kamera
                                </button>
                            ) : (
                                <button
                                    onClick={ambilFotoDanDeteksi}
                                    className="flex items-center justify-center gap-2 py-3.5 px-4 bg-amber-500 hover:bg-amber-600 text-gray-900 font-extrabold text-sm rounded-xl shadow-md shadow-amber-500/20 active:scale-[0.98] transition-all cursor-pointer"
                                >
                                    📸 Ambil Foto
                                </button>
                            )}
                        </div>

                        {/* Detect Button (after upload) */}
                        {preview && !isCameraActive && (
                            <button
                                onClick={() => kirimKeBackend()}
                                disabled={loading}
                                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                            >
                                {loading ? (
                                    <>
                                        <Loader2
                                            size={18}
                                            className="animate-spin"
                                        />
                                        Menganalisis Gambar...
                                    </>
                                ) : (
                                    <>Mulai Deteksi Sampah</>
                                )}
                            </button>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-6 text-gray-400 text-xs">
                    &copy; 2026 Fathar Project, All right reserved
                </div>
            </div>
        </div>
    );
}
