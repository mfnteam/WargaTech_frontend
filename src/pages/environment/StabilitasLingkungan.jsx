import { useNavigate } from "react-router-dom";
import { AlertTriangle, ArrowRight } from "lucide-react";
import imgOrganik from "@/assets/sampah_organik.png";
import imgAnorganik from "@/assets/sampah_anorganik.png";
import imgB3 from "@/assets/limbah_b3.png";
import imgResidu from "@/assets/sampah_residu.png";
import sampahinAja from "@/assets/logo_sampahinaja.png";

const wasteTypes = [
    {
        icon: "♻️",
        title: "Sampah Organik",
        image: imgOrganik,
        colorTheme: "border-emerald-500 text-emerald-600 bg-emerald-50/60",
        badgeColor: "bg-emerald-100 text-emerald-800",
        desc: "Sampah yang berasal dari sisa makhluk hidup dan dapat terurai secara alami oleh mikroorganisme.",
        examples:
            "Sisa makanan, daun kering, kulit buah, sayuran busuk, serbuk kayu, kotoran hewan.",
        tips: "Kumpulkan dalam wadah terpisah berwarna hijau. Dapat diolah menjadi kompos untuk pupuk tanaman.",
    },
    {
        icon: "🔩",
        title: "Sampah Anorganik",
        image: imgAnorganik,
        colorTheme: "border-blue-500 text-blue-600 bg-blue-50/60",
        badgeColor: "bg-blue-100 text-blue-800",
        desc: "Sampah yang berasal dari bahan-bahan non-hayati dan sulit terurai secara alami.",
        examples: "Plastik, logam, kaca, kertas, kaleng, botol, kardus, karet.",
        tips: "Pisahkan berdasarkan jenis (plastik, kertas, logam). Banyak yang bisa didaur ulang menjadi produk baru.",
    },
    {
        icon: "☢️",
        title: "Limbah B3 (Bahan Berbahaya)",
        image: imgB3,
        colorTheme: "border-red-500 text-red-600 bg-red-50/60",
        badgeColor: "bg-red-100 text-red-800",
        desc: "Bahan Berbahaya & Beracun — sampah yang mengandung zat kimia berbahaya bagi kesehatan dan lingkungan.",
        examples:
            "Baterai, cat, pestisida, obat kadaluwarsa, lampu neon, elektronik rusak, oli bekas.",
        tips: "JANGAN buang bersama sampah biasa! Kumpulkan dan bawa ke tempat pengumpulan limbah B3 resmi.",
    },
    {
        icon: "🗑️",
        title: "Sampah Residu",
        image: imgResidu,
        colorTheme: "border-gray-500 text-gray-600 bg-gray-50/60",
        badgeColor: "bg-gray-200 text-gray-800",
        desc: "Sampah yang tidak termasuk dalam kategori lain dan tidak dapat didaur ulang atau diolah lebih lanjut.",
        examples:
            "Popok sekali pakai, pembalut, tisu kotor, puntung rokok, styrofoam kotor.",
        tips: "Sampah residu akan berakhir di TPA. Kurangi penggunaan bahan sekali pakai untuk meminimalisir residu.",
    },
];

export default function StabilitasLingkungan() {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 pb-16">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200/80 pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                Stabilitas Lingkungan
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Panduan pemilahan sampah & kebersihan lingkungan
                                perkotaan
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
                {/* Intro Card */}
                <div className="bg-gradient-to-r from-orange-50 via-white to-emerald-50 p-8 sm:p-12 rounded-3xl border border-orange-200/70 shadow-sm text-center max-w-3xl mx-auto space-y-4">
                    <div className="text-5xl mb-2">🌍</div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                        Mari Jaga Kebersihan Kota Jakarta
                    </h2>
                    <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
                        Pemilahan sampah yang benar adalah langkah pertama
                        menuju kota yang lebih bersih, sehat, dan berkelanjutan.
                        Kenali jenis-jenis sampah dan cara memilahnya dengan
                        tepat.
                    </p>
                </div>

                {/* Waste Types Grid */}
                <div className="space-y-6">
                    <div className="text-center max-w-xl mx-auto space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
                            Jenis-Jenis{" "}
                            <span className="text-orange-500">Sampah</span>
                        </h2>
                        <p className="text-gray-500 text-xs sm:text-sm">
                            Kenali kategori sampah untuk kemudahan proses daur
                            ulang
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {wasteTypes.map((waste, i) => (
                            <div
                                key={i}
                                className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                            >
                                <div>
                                    <div className="h-56 overflow-hidden bg-gray-100 relative">
                                        <img
                                            src={waste.image}
                                            alt={waste.title}
                                            className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 left-4">
                                            <span
                                                className={`px-3 py-1 text-xs font-black rounded-full shadow-sm ${waste.badgeColor}`}
                                            >
                                                {waste.icon} {waste.title}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-6 space-y-4">
                                        <p className="text-gray-600 text-sm leading-relaxed">
                                            {waste.desc}
                                        </p>

                                        <div
                                            className={`p-3.5 rounded-2xl ${waste.colorTheme} text-xs space-y-1`}
                                        >
                                            <span className="font-bold block text-gray-900">
                                                Contoh Sampah:
                                            </span>
                                            <p className="text-gray-700">
                                                {waste.examples}
                                            </p>
                                        </div>

                                        <div className="p-3.5 rounded-2xl bg-gray-50 border-l-4 border-orange-500 text-xs space-y-1">
                                            <span className="font-bold block text-gray-900">
                                                💡 Tips Pengelolaan:
                                            </span>
                                            <p className="text-gray-600">
                                                {waste.tips}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Quick Guide */}
                <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <h3 className="text-lg font-bold text-gray-900 text-center">
                        Panduan Ringkas Pemilahan Sampah
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {wasteTypes.map((w, i) => (
                            <div
                                key={i}
                                className={`p-4 rounded-2xl ${w.colorTheme} text-center space-y-2`}
                            >
                                <div className="text-3xl">{w.icon}</div>
                                <div className="font-extrabold text-xs text-gray-900">
                                    {w.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Card */}
                <div className="bg-linear-to-r from-orange-500 to-amber-600 p-8 sm:p-12 rounded-3xl shadow-xl shadow-orange-500/20 text-white text-center space-y-8">
                    <div className="w-16 h-16 rounded-2xl bg-white/20 text-white flex items-center justify-center mx-auto text-3xl">
                        <div className="bg-orange-300 h-full w-full"></div>
                        <img
                            className="rounded-3xl transition-all duration-300 hover:scale-125 hover:scale-125"
                            style={{ maxWidth: "100px", maxHeight: "100px" }}
                            src={sampahinAja}
                        ></img>
                    </div>
                    <div className="max-w-md mx-auto space-y-2">
                        <h3 className="text-2xl font-black">
                            Mau Memilah Sampah Otomatis?
                        </h3>
                        <h6 className="text-orange-100 text-sm">
                            Dengan{" "}
                            <span className="text-gray-100 text-md fw-semibold">
                                SampahinAja
                            </span>
                            , deteksi kategori sampah cukup dengan satu klik!
                            penggunaan sangat praktis dan bermanfaat untuk
                            kebersihan lingkungan
                        </h6>
                    </div>
                    <button
                        onClick={() => navigate("/sampahinaja")}
                        className="inline-flex items-center gap-2.5 px-6 py-3.5 bg-white hover:bg-orange-50 text-orange-600 font-extrabold text-sm rounded-2xl shadow-lg transition-transform active:scale-95 cursor-pointer"
                    >
                        Coba SampahinAja
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
