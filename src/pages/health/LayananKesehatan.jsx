import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { healthService } from "@/services/service";
import Modal from "@/components/common/Modal";
import {
    Stethoscope,
    MapPin,
    Clock,
    Loader2,
    Calendar,
    Check,
    X as XIcon,
    Search,
    User,
    ChevronRight,
} from "lucide-react";
import toast from "react-hot-toast";

export default function LayananKesehatan() {
    const { isWarga, isPetugas } = useAuth();

    return (
        <div className="space-y-8 pb-16">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200/80 pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                Layanan Kesehatan
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Temukan dokter spesialis dan buat jadwal
                                perjanjian medis
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isWarga && <WargaView />}
                {isPetugas && <PetugasView />}
            </div>
        </div>
    );
}

/* ---- Warga View ---- */
function WargaView() {
    const [services, setServices] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [bookingModal, setBookingModal] = useState(null);
    const [bookingForm, setBookingForm] = useState({ date: "", book_time: "" });
    const [bookingLoading, setBookingLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [filterType]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [servRes, bookRes] = await Promise.all([
                healthService.getServices(filterType || undefined),
                healthService.getUserBookings(),
            ]);
            setServices(servRes.data || servRes || []);
            setBookings(bookRes.data || bookRes || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const filteredServices = services?.service?.filter(
        (s) =>
            !searchQuery ||
            s.doctor_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            s.location?.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    const types = [...new Set(services?.service?.map((s) => s.type))].filter(
        Boolean,
    );

    const handleBooking = async (e) => {
        e.preventDefault();
        if (!bookingForm.date || !bookingForm.book_time) {
            toast.error("Lengkapi tanggal dan waktu");
            return;
        }

        setBookingLoading(true);
        try {
            await healthService.createBooking({
                service_id: bookingModal.id,
                date: bookingForm.date,
                book_time: bookingForm.book_time,
            });
            toast.success(
                `Perjanjian telah dibuat dengan ${bookingModal.doctor_name}`,
            );
            setBookingModal(null);
            setBookingForm({ date: "", book_time: "" });
            fetchData();
        } catch (error) {
            const msg =
                error.response?.data?.message || "Gagal membuat perjanjian";
            toast.error(msg);
        } finally {
            setBookingLoading(false);
        }
    };

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split("T")[0];

    const statusMap = {
        pending: {
            label: "Menunggu Konfirmasi",
            badge: "bg-amber-100 text-amber-800 border-amber-200",
        },
        accepted: {
            label: "Diterima",
            badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
        },
        rejected: {
            label: "Ditolak",
            badge: "bg-red-100 text-red-800 border-red-200",
        },
    };

    return (
        <div className="space-y-8">
            {/* Search & Filter Bar */}
            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative w-full md:w-80">
                    <Search
                        size={18}
                        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                        type="text"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:bg-white transition-all"
                        placeholder="Cari nama dokter atau lokasi..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
                    <span>Jenis Layanan : </span>
                    <select
                        className="px-2 py-1 rounded-lg text-gray-500 bg-gray-100"
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">Semua</option>
                        {types.map((f) => {
                            return (
                                <>
                                    <option value={f}>{f}</option>
                                </>
                            );
                        })}
                    </select>
                </div>
            </div>

            {/* Services List Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                    <span>Daftar Praktik Dokter</span>
                </h2>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className="h-56 bg-gray-200/60 rounded-3xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredServices.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 text-gray-400 space-y-2">
                        <Stethoscope
                            className="mx-auto text-gray-300"
                            size={48}
                        />
                        <p className="font-bold text-gray-700">
                            Tidak ada dokter ditemukan
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {filteredServices.map((service) => (
                            <div
                                key={service.id}
                                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center shrink-0 text-xl font-bold">
                                            🧑‍⚕️
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 text-base leading-snug">
                                                {service.doctor_name}
                                            </h3>
                                            <span className="inline-block mt-0.5 text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">
                                                {service.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-xs text-gray-600 pt-2 border-t border-gray-50">
                                        <div className="flex items-center gap-2">
                                            <MapPin
                                                size={14}
                                                className="text-gray-400 shrink-0"
                                            />
                                            <span className="truncate">
                                                {service.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock
                                                size={14}
                                                className="text-gray-400 shrink-0"
                                            />
                                            <span>
                                                {service.open_time} -{" "}
                                                {service.close_time} WIB
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setBookingModal(service)}
                                    className="mt-6 w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Calendar size={14} />
                                    Buat Perjanjian
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* User Bookings Section */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight flex items-center gap-2">
                    <span>Perjanjian Medis Anda</span>
                    <span className="text-xs text-gray-400 font-normal">
                        ({bookings?.booking?.length})
                    </span>
                </h2>

                {bookings?.booking?.length === 0 ? (
                    <div className="py-8 text-center text-gray-400 space-y-2">
                        <Calendar className="mx-auto text-gray-300" size={40} />
                        <p className="font-bold text-gray-700">
                            Belum ada perjanjian aktif
                        </p>
                        <p className="text-xs text-gray-400">
                            Silakan pilih dokter di atas untuk membuat jadwal
                            perjanjian.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {bookings?.booking?.map((b) => (
                            <div
                                key={b.id}
                                className="p-4 rounded-2xl border border-gray-100 bg-gray-50/50 flex flex-col justify-between gap-3"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">
                                            {b.doctor_name ||
                                                b.service?.doctor_name ||
                                                "-"}
                                        </h4>
                                        <p className="text-xs text-gray-500">
                                            {b.type || b.service?.type} •{" "}
                                            {b.location || b.service?.location}
                                        </p>
                                    </div>
                                    <span
                                        className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border shrink-0 ${statusMap[b.status]?.badge || "bg-gray-100 text-gray-600"}`}
                                    >
                                        {statusMap[b.status]?.label || b.status}
                                    </span>
                                </div>

                                <div className="flex items-center gap-4 text-xs font-semibold text-gray-700 pt-2 border-t border-gray-200/60">
                                    <div className="flex items-center gap-1.5">
                                        <Calendar
                                            size={14}
                                            className="text-orange-500"
                                        />
                                        <span>{b.date}</span>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Clock
                                            size={14}
                                            className="text-orange-500"
                                        />
                                        <span>Pukul {b.book_time}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Booking Modal */}
            <Modal
                isOpen={!!bookingModal}
                onClose={() => {
                    setBookingModal(null);
                    setBookingForm({ date: "", book_time: "" });
                }}
                title="Form Perjanjian Medis"
                footer={
                    <>
                        <button
                            className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl transition-colors cursor-pointer"
                            onClick={() => setBookingModal(null)}
                        >
                            Batal
                        </button>
                        <button
                            className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md transition-colors flex items-center gap-1.5 cursor-pointer"
                            onClick={handleBooking}
                            disabled={bookingLoading}
                        >
                            {bookingLoading ? (
                                <Loader2 size={14} className="animate-spin" />
                            ) : (
                                <Check size={14} />
                            )}
                            Konfirmasi Perjanjian
                        </button>
                    </>
                }
            >
                {bookingModal && (
                    <div className="space-y-4">
                        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200/80 space-y-1">
                            <p className="font-bold text-gray-900 text-sm">
                                {bookingModal.doctor_name}
                            </p>
                            <p className="text-xs text-gray-600">
                                {bookingModal.type} • {bookingModal.location}
                            </p>
                            <p className="text-[11px] text-orange-700 font-semibold pt-1">
                                Jam Praktik: {bookingModal.open_time} -{" "}
                                {bookingModal.close_time} WIB
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Tanggal Perjanjian{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                min={minDate}
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                value={bookingForm.date}
                                onChange={(e) =>
                                    setBookingForm((p) => ({
                                        ...p,
                                        date: e.target.value,
                                    }))
                                }
                            />
                            <p className="text-[11px] text-gray-400 mt-1">
                                Pilih tanggal minimal mulai besok hari.
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Waktu Kunjungan{" "}
                                <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500 focus:ring-4 focus:ring-orange-100"
                                value={bookingForm.book_time}
                                onChange={(e) =>
                                    setBookingForm((p) => ({
                                        ...p,
                                        book_time: e.target.value,
                                    }))
                                }
                            />
                            <p className="text-[11px] text-gray-400 mt-1">
                                Sesuaikan dengan jam praktik dokter (
                                {bookingModal.open_time} -{" "}
                                {bookingModal.close_time}).
                            </p>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}

/* ---- Petugas View ---- */
function PetugasView() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const res = await healthService.getAllBookings();
            setBookings(res.data || res || []);
        } catch {
            /* ignore */
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        setActionLoading(id);
        try {
            if (action === "accept") {
                await healthService.acceptBooking(id);
                toast.success("Perjanjian diterima");
            } else {
                await healthService.rejectBooking(id);
                toast.success("Perjanjian ditolak");
            }
            fetchBookings();
        } catch {
            toast.error("Gagal memproses perjanjian");
        } finally {
            setActionLoading(null);
        }
    };

    const statusMap = {
        pending: {
            label: "Menunggu",
            badge: "bg-amber-100 text-amber-800 border-amber-200",
        },
        accepted: {
            label: "Diterima",
            badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
        },
        rejected: {
            label: "Ditolak",
            badge: "bg-red-100 text-red-800 border-red-200",
        },
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    Kelola Perjanjian Pasien
                </h2>
                <span className="text-xs text-gray-400 font-medium">
                    {bookings?.booking?.length} Total Perjanjian
                </span>
            </div>

            {loading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map((i) => (
                        <div
                            key={i}
                            className="h-12 bg-gray-100 rounded-xl animate-pulse"
                        />
                    ))}
                </div>
            ) : bookings?.booking?.length === 0 ? (
                <div className="py-12 text-center text-gray-400 space-y-2">
                    <Calendar className="mx-auto text-gray-300" size={40} />
                    <p className="font-bold text-gray-700">
                        Belum ada data perjanjian pasien
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50/80 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                            <tr>
                                <th className="py-3.5 px-4">Nama Pasien</th>
                                <th className="py-3.5 px-4">Dokter</th>
                                <th className="py-3.5 px-4">Spesialisasi</th>
                                <th className="py-3.5 px-4">Jadwal</th>
                                <th className="py-3.5 px-4">Status</th>
                                <th className="py-3.5 px-4 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {bookings?.booking?.map((b) => (
                                <tr
                                    key={b.id}
                                    className="hover:bg-gray-50/50 transition-colors"
                                >
                                    <td className="py-3.5 px-4 font-bold text-gray-900">
                                        {b.name || "-"}
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-700">
                                        {b.doctor_name || "-"}
                                    </td>
                                    <td className="py-3.5 px-4 text-gray-500 text-xs">
                                        {b.type || "-"}
                                    </td>
                                    <td className="py-3.5 px-4 text-xs font-medium text-gray-700">
                                        {b.date}{" "}
                                        <span className="text-gray-400">
                                            ({b.book_time})
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4">
                                        <span
                                            className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border ${statusMap[b.status]?.badge || "bg-gray-100 text-gray-600"}`}
                                        >
                                            {statusMap[b.status]?.label ||
                                                b.status}
                                        </span>
                                    </td>
                                    <td className="py-3.5 px-4 text-right">
                                        {b.status === "pending" ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    disabled={
                                                        actionLoading === b.id
                                                    }
                                                    onClick={() =>
                                                        handleAction(
                                                            b.id,
                                                            "accept",
                                                        )
                                                    }
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    <Check size={14} /> Terima
                                                </button>
                                                <button
                                                    disabled={
                                                        actionLoading === b.id
                                                    }
                                                    onClick={() =>
                                                        handleAction(
                                                            b.id,
                                                            "reject",
                                                        )
                                                    }
                                                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                                                >
                                                    <XIcon size={14} /> Tolak
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-gray-400 italic">
                                                Selesai
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
