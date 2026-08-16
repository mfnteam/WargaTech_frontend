import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { mobilityService } from "@/services/mobility";
import Modal from "@/components/common/Modal";
import {
    Bus,
    Train,
    Loader2,
    Clock,
    Plus,
    Search,
    MapPin,
    ChevronRight,
    FileQuestion,
    CircleQuestionMark,
    SearchCheck,
    TrainFront,
} from "lucide-react";
import toast from "react-hot-toast";
import loadingAnimation from "../../assets/loading.gif";

export default function MobilitasSosial() {
    const { isPetugas } = useAuth();
    const [activeTab, setActiveTab] = useState("train");

    const tabs = [
        {
            id: "train",
            label: "KRL Commuter Line",
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ2_VbNW9K6jlgCD2qKn7XI2-C9c_-JBFjezlCKfG2ZYuqnyTSymd-rr49K&s=10.jpg",
        },
        {
            id: "bus",
            label: "Transjakarta",
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQELe2B1VoNtRtTz8o3zAqKZw5EAUEK80Hgrkng9dgkCg&s",
        },
        {
            id: "mrt",
            label: "MRT Jakarta",
            icon: "https://images.seeklogo.com/logo-png/45/1/jakarta-mrt-logo-png_seeklogo-459975.png",
        },
        {
            id: "lrt",
            label: "LRT Jabodebek & JKT",
            icon: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPOC9EPPif_w-cBNx9LVdhP0o6h4pOjoDsr9f1CiuR-A&s=10.jpg",
        },
    ];

    return (
        <div className="space-y-8 pb-16">
            {/* Page Header */}
            <div className="bg-white border-b border-gray-200/80 pt-24 pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                                Mobilitas Sosial
                            </h1>
                            <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
                                Informasi jadwal & rute transportasi umum DKI
                                Jakarta real-time
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                {/* Category Tabs */}
                <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-2 overflow-x-auto">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-xs sm:text-sm transition-all whitespace-nowrap cursor-pointer ${
                                activeTab === tab.id
                                    ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/70"
                            }`}
                        >
                            <img
                                className=""
                                style={{
                                    maxWidth: "30px",
                                    maxHeight: "30px",
                                }}
                                src={tab.icon}
                            />
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "train" && <TrainTab isPetugas={isPetugas} />}
                {activeTab === "bus" && <BusTab isPetugas={isPetugas} />}
                {activeTab === "mrt" && <MRTTab isPetugas={isPetugas} />}
                {activeTab === "lrt" && <LRTTab isPetugas={isPetugas} />}
            </div>
        </div>
    );
}

/* ---- Train Tab ---- */
function TrainTab({ isPetugas }) {
    const [trains, setTrains] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAdd, setShowAdd] = useState(false);
    const [addLoading, setAddLoading] = useState(false);
    const [line, setLine] = useState("");
    const [form, setForm] = useState({
        code: "",
        departure: "",
        line: "",
        stasiun_awal: "",
        stasiun_akhir: "",
    });
    const [detailModal, setDetailModal] = useState(null);

    const lineRoutes = {
        redline: [
            ["Bogor", "JakartaKota"],
            ["JakartaKota", "Bogor"],
            ["Nambo", "JakartaKota"],
            ["JakartaKota", "Nambo"],
        ],
        blueline: [
            ["Cikarang", "KampungBandan"],
            ["Bekasi", "KampungBandan"],
            ["KampungBandan", "Cikarang"],
            ["Kampungbandan", "Bekasi"],
            ["Cikarang", "Angke"],
            ["Bekasi", "Angke"],
            ["Angke", "Cikarang"],
            ["Angke", "Bekasi"],
        ],
        greenline: [
            ["TanahAbang", "Rangkasbitung"],
            ["Rangkasbitung", "TanahAbang"],
        ],
        purpleline: [
            ["JakartaKota", "TanjungPriok"],
            ["TanjungPriok", "JakartaKota"],
        ],
        brownline: [
            ["Duri", "Tangerang"],
            ["Tangerang", "Duri"],
        ],
    };

    const needsVia = (line, awal, akhir) => {
        if (line !== "blueline") return false;
        const route = `${awal}↔${akhir}`.toLowerCase();
        return (
            (route.includes("cikarang") && route.includes("kampungbandan")) ||
            (route.includes("bekasi") && route.includes("kampungbandan"))
        );
    };

    useEffect(() => {
        fetchTrains();
    }, []);

    const fetchTrains = async () => {
        try {
            const res = await mobilityService.listTrains();
            setTrains(res.train || res || []);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const fetchDetail = async (id) => {
        try {
            const res = await mobilityService.detailTrain(id);
            setDetailModal(res.data || res);
        } catch {
            toast.error("Gagal memuat detail");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (
            !form.code ||
            !form.departure ||
            !form.line ||
            !form.stasiun_awal ||
            !form.stasiun_akhir
        ) {
            toast.error("Lengkapi semua field");
            return;
        }
        setAddLoading(true);
        try {
            await mobilityService.createTrain(form);
            toast.success("Jadwal kereta ditambahkan");
            setShowAdd(false);
            setForm({
                code: "",
                departure: "",
                line: "",
                stasiun_awal: "",
                stasiun_akhir: "",
                via: "",
            });
            fetchTrains();
        } catch (error) {
            toast.error(
                error.response?.data?.message || "Gagal menambahkan jadwal",
            );
            console.log(error.response?.data);
        } finally {
            setAddLoading(false);
        }
    };

    const now = new Date();
    const filteredTrains = trains.filter(
        (train) => line === "" || train.line === line,
    );

    return (
        <>
            {addLoading && (
                <div className="fixed flex z-100 inset-0 top-0 w-full h-full bg-black/50 items-center justify-center">
                    <img src={loadingAnimation}></img>
                </div>
            )}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <select
                                onChange={(e) => setLine(e.target.value)}
                                defaultValue={""}
                                className="border-gray-200 rounded-md bg-gray-100 text-gray-700 px-2 py-1 outline-gray-300"
                                w
                            >
                                <option value="">semua line</option>
                                <option value="redline">redline</option>
                                <option value="blueline">blueline</option>
                                <option value="greenline">greenline</option>
                                <option value="brownline">brownline</option>
                                <option value="purpleline">purpleline</option>
                            </select>
                        </div>
                        <span className="text-xs font-semibold text-gray-500">
                            {filteredTrains?.length} Jadwal Tersedia
                        </span>
                    </div>

                    {isPetugas && (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 justify-center cursor-pointer"
                        >
                            <Plus size={16} /> Tambah Jadwal Kereta
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : filteredTrains?.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 text-gray-400 space-y-2">
                        <Train className="mx-auto text-gray-300" size={40} />
                        <p className="font-bold text-gray-700">
                            Tidak ada jadwal KRL tersedia
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filteredTrains?.map((t, i) => {
                            return (
                                <div
                                    key={t.id || i}
                                    onClick={() => fetchDetail(t.id)}
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs hover:shadow-md hover:border-orange-200 transition-all flex items-center justify-between gap-4 cursor-pointer group"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform">
                                            🚆
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md bg-orange-50 text-orange-700 border border-orange-200">
                                                    {t.line}
                                                </span>
                                                <h4 className="font-extrabold text-gray-900 text-sm">
                                                    {t.code}
                                                </h4>
                                            </div>
                                            <p className="text-xs text-gray-500 font-medium max-w-[130px] truncate">
                                                {t.direction}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="text-right flex gap-2 justify-items-center align-middle">
                                        <span className="text-base font-black text-orange-600 block">
                                            {t.departure}
                                        </span>
                                        <span className="text-gray-500">➤</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Detail Modal */}
                <Modal
                    isOpen={!!detailModal}
                    onClose={() => setDetailModal(null)}
                    title="Detail Rute & Stasiun"
                >
                    {detailModal && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                                <h4 className="font-bold text-gray-900 text-base">
                                    {detailModal.code}
                                </h4>
                                <p className="text-xs text-gray-600 font-medium">
                                    {detailModal.direction}
                                </p>
                            </div>

                            <div className="space-y-0 relative pl-4 border-l-2 border-orange-200">
                                {(detailModal.station || []).map((s, i) => (
                                    <div
                                        key={i}
                                        className="relative py-4 flex items-center justify-between text-xs"
                                    >
                                        <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-500 border-2 border-white" />
                                        <span className="text-xl font-semibold text-gray-800">
                                            {s.station}
                                        </span>
                                        <span className="text-lg font-mono text-gray-400 font-bold">
                                            {s.time}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Add Modal */}
                <Modal
                    isOpen={showAdd}
                    onClose={() => setShowAdd(false)}
                    title="Tambah Jadwal KRL"
                    footer={
                        <>
                            <button
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                                onClick={() => setShowAdd(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md"
                                onClick={handleAdd}
                                disabled={addLoading}
                            >
                                {addLoading ? (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Simpan Jadwal"
                                )}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Kode Kereta *
                            </label>
                            <input
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                                value={form.code}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        code: e.target.value,
                                    }))
                                }
                                placeholder="Contoh: KA 1234"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Waktu Berangkat *
                            </label>
                            <input
                                type="time"
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                                value={form.departure}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        departure: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Jalur Line *
                            </label>
                            <select
                                className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                                value={form.line}
                                onChange={(e) =>
                                    setForm((p) => ({
                                        ...p,
                                        line: e.target.value,
                                        stasiun_awal: "",
                                        stasiun_akhir: "",
                                        via: "",
                                    }))
                                }
                            >
                                <option value="">Pilih Line</option>
                                {Object.keys(lineRoutes).map((l) => (
                                    <option key={l} value={l}>
                                        {l}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {form.line && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Rute Perjalanan *
                                    </label>
                                    <select
                                        className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                                        value={`${form.stasiun_awal}|${form.stasiun_akhir}`}
                                        onChange={(e) => {
                                            const [a, b] =
                                                e.target.value.split("|");
                                            setForm((p) => ({
                                                ...p,
                                                stasiun_awal: a,
                                                stasiun_akhir: b,
                                            }));
                                        }}
                                    >
                                        <option value="|">Pilih Rute</option>
                                        {lineRoutes[form.line]?.map(
                                            ([a, b], i) => (
                                                <option
                                                    key={i}
                                                    value={`${a}|${b}`}
                                                >
                                                    {a} ↔ {b}
                                                </option>
                                            ),
                                        )}
                                    </select>
                                </div>
                                {needsVia(
                                    form.line,
                                    form.stasiun_awal,
                                    form.stasiun_akhir,
                                ) && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                            Via Stasiun *
                                        </label>
                                        <select
                                            className="w-full px-3 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                                            value={form.via}
                                            onChange={(e) =>
                                                setForm((p) => ({
                                                    ...p,
                                                    via: e.target.value,
                                                }))
                                            }
                                        >
                                            <option value="">Pilih Via</option>
                                            <option value="pse">
                                                Pasar Senen
                                            </option>
                                            <option value="mri">
                                                Manggarai
                                            </option>
                                        </select>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
}

/* ---- Bus Tab ---- */
function BusTab({ isPetugas }) {
    const [buses, setBuses] = useState([]);
    const [corridors, setCorridors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCorridor, setSelectedCorridor] = useState("");
    const [searchTime, setSearchTime] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({ route_id: "", departure: "" });
    const [addLoading, setAddLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [selectedCorridor, searchTime]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedCorridor) params.corridor = selectedCorridor;
            if (searchTime) params.departure = searchTime;
            const [busRes, corRes] = await Promise.all([
                mobilityService.listBuses(params),
                mobilityService.listCorridors(),
            ]);
            const busData = busRes.data?.bus || busRes.bus || busRes || [];
            setBuses(Array.isArray(busData) ? busData : []);
            setCorridors(corRes.corridor || corRes || []);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!addForm.route_id || !addForm.departure) {
            toast.error("Lengkapi semua field");
            return;
        }
        setAddLoading(true);
        try {
            await mobilityService.createBus(addForm);
            toast.success("Jadwal bus ditambahkan");
            setShowAdd(false);
            setAddForm({ route_id: "", departure: "" });
            fetchData();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal");
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <>
            {addLoading && (
                <div className="fixed flex z-100 inset-0 top-0 w-full h-full bg-black/50 items-center justify-center">
                    <img src={loadingAnimation}></img>
                </div>
            )}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            className="px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                            value={selectedCorridor}
                            onChange={(e) =>
                                setSelectedCorridor(e.target.value)
                            }
                        >
                            <option value="">Semua Koridor TransJakarta</option>
                            {corridors?.map((c) => (
                                <option key={c.id} value={c.kode}>
                                    [{c.kode}] : {c.halte_awal} -{" "}
                                    {c.halte_akhir}
                                </option>
                            ))}
                        </select>

                        <input
                            type="time"
                            className="px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-orange-500"
                            value={searchTime}
                            onChange={(e) => setSearchTime(e.target.value)}
                        />
                    </div>

                    {isPetugas && (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 justify-center cursor-pointer"
                        >
                            <Plus size={16} /> Tambah Jadwal Bus
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : buses?.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 text-gray-400 space-y-2">
                        <CircleQuestionMark
                            className="mx-auto text-gray-300"
                            size={40}
                        />
                        <p className="font-bold text-gray-700">
                            Tidak ada jadwal Busway ditemukan
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {buses?.map((b, i) => {
                            return (
                                <div
                                    key={b.route_id || i}
                                    className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4"
                                >
                                    <div className="flex items-center gap-3.5">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-xl shrink-0">
                                            🚌
                                        </div>
                                        <div>
                                            <h4 className="font-black text-gray-900 text-sm mb-0.5">
                                                Korridor {b.code}
                                            </h4>
                                            <p className="text-xs text-gray-500 font-medium max-w-[200px] truncate">
                                                {b.direction}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-base font-black text-orange-600 shrink-0">
                                        {b.departure}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}

                <Modal
                    isOpen={showAdd}
                    onClose={() => setShowAdd(false)}
                    title="Tambah Jadwal Bus"
                    footer={
                        <>
                            <button
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                                onClick={() => setShowAdd(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md"
                                onClick={handleAdd}
                                disabled={addLoading}
                            >
                                {addLoading ? (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Simpan"
                                )}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Koridor *
                            </label>
                            <select
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                value={addForm.route_id}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        route_id: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Pilih Koridor Bus</option>
                                {corridors?.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.kode}: {c.halte_awal} -{" "}
                                        {c.halte_akhir}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Waktu Berangkat *
                            </label>
                            <input
                                type="time"
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                value={addForm.departure}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        departure: e.target.value,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

/* ---- MRT Tab ---- */
function MRTTab({ isPetugas }) {
    const [mrts, setMrts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTime, setSearchTime] = useState("06:00");
    const [showAdd, setShowAdd] = useState(false);
    const [addForm, setAddForm] = useState({
        code: "",
        departure: "",
        destination: "",
    });
    const [addLoading, setAddLoading] = useState(false);

    useEffect(() => {
        fetchMRT();
    }, []);

    const fetchMRT = async () => {
        try {
            const res = await mobilityService.listMRT();
            setMrts(res.train || res || []);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const now = new Date();
    const currentTime =
        searchTime ||
        `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    const filtered = mrts?.filter((m) => m.departure >= currentTime);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!addForm.code || !addForm.departure || !addForm.destination) {
            toast.error("Lengkapi semua field");
            return;
        }
        setAddLoading(true);
        try {
            await mobilityService.createMRT(addForm);
            toast.success("Jadwal MRT ditambahkan");
            setShowAdd(false);
            setAddForm({ code: "", departure: "", destination: "" });
            fetchMRT();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal");
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <>
            {addLoading && (
                <div className="inset-0 top-0 w-full h-full bg-black/50 items-center justify-center">
                    <img src={loading}></img>
                </div>
            )}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-3">
                        <input
                            type="time"
                            className="px-3.5 py-2 text-xs font-semibold bg-gray-50 border border-gray-200 rounded-xl outline-none"
                            value={searchTime}
                            onChange={(e) => setSearchTime(e.target.value)}
                        />
                        <span className="text-xs font-semibold text-gray-500">
                            {filtered?.length} Jadwal MRT
                        </span>
                    </div>

                    {isPetugas && (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 justify-center cursor-pointer"
                        >
                            <Plus size={16} /> Tambah Jadwal MRT
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : filtered?.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 text-gray-400 space-y-2">
                        <p className="font-bold text-gray-700">
                            Tidak ada jadwal MRT tersedia
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {filtered?.map((m, i) => (
                            <div
                                key={m.id || i}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-xl shrink-0">
                                        🚇
                                    </div>
                                    <div>
                                        <h4 className="font-black text-gray-900 text-sm mb-0.5">
                                            {m.code}
                                        </h4>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Tujuan: {m.destination}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-base font-black text-orange-600 shrink-0">
                                    {m.departure}
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={showAdd}
                    onClose={() => setShowAdd(false)}
                    title="Tambah Jadwal MRT"
                    footer={
                        <>
                            <button
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                                onClick={() => setShowAdd(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md"
                                onClick={handleAdd}
                                disabled={addLoading}
                            >
                                {addLoading ? (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Simpan"
                                )}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Kode *
                            </label>
                            <input
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                value={addForm.code}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        code: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Waktu Berangkat (06:00 - 23:00) *
                            </label>
                            <input
                                type="time"
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                min="06:00"
                                max="23:00"
                                value={addForm.departure}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        departure: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Tujuan Stasiun *
                            </label>
                            <select
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                value={addForm.destination}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        destination: e.target.value,
                                    }))
                                }
                            >
                                <option value="">Pilih Tujuan</option>
                                <option value="lebakbulus">Lebak Bulus</option>
                                <option value="bundaranhi">Bundaran HI</option>
                            </select>
                        </div>
                    </div>
                </Modal>
            </div>
        </>
    );
}

/* ---- LRT Tab ---- */
function LRTTab({ isPetugas }) {
    const [lrts, setLrts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [lrtType, setLrtType] = useState("");
    const [showAdd, setShowAdd] = useState(false);
    const [showType, setShowType] = useState(true);
    const [addForm, setAddForm] = useState({
        code: "",
        departure: "",
        type: "",
        stasiun_awal: "",
        stasiun_akhir: "",
        destination: "",
    });
    const [addLoading, setAddLoading] = useState(false);

    const [detailLrt, setDetailLrt] = useState(null);

    useEffect(() => {
        fetchLRT();
    }, [lrtType]);

    const fetchLRT = async () => {
        setLoading(true);
        try {
            const res = await mobilityService.listLRT(lrtType || undefined);
            setLrts(res.train || res || []);
        } catch {
        } finally {
            setLoading(false);
        }
    };

    const fetchDetailLrt = async (id) => {
        try {
            const res = await mobilityService.detailLRT(id);
            setDetailLrt(res.data || res);
        } catch {
            toast.error("Gagal memuat detail");
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!addForm.code || !addForm.departure || !addForm.type) {
            toast.error("Lengkapi semua field");
            return;
        }
        setAddLoading(true);
        try {
            const err = await mobilityService.createLRT(addForm);
            toast.success("Jadwal LRT ditambahkan");
            setShowAdd(false);
            setAddForm({
                code: "",
                departure: "",
                type: "",
                stasiun_awal: "",
                stasiun_akhir: "",
                destination: "",
            });
            fetchLRT();
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal");
        } finally {
            setAddLoading(false);
        }
    };

    return (
        <>
            {lrtType === "" && setShowType && (
                <div className="fixed flex items-center z-50 justify-center w-full h-full bg-black/50 inset-0 ">
                    <div className="w-full max-w-md max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 justify-content-center items-center px-8 py-6">
                        <h3 className="text-lg font-bold text-gray-900">
                            Pilih tipe LRT
                        </h3>
                        <div className="flex gap-8 justify-between px-8 py-4">
                            <button
                                className="max-w-75 max-h-75 px-4 py-4 hover:scale-105 hover:outline hover:outline-gray-400 hover:shadow-md rounded-lg transition-all duration-300"
                                onClick={() => setLrtType("jakarta")}
                            >
                                <img
                                    src="https://iconlogovector.com/uploads/images/2024/03/lg-65e38a127729f-LRT-Jakarta.webp"
                                    alt="LRT Jakarta"
                                    className=""
                                />
                            </button>{" "}
                            <button
                                className="max-w-75 max-h-75 px-4 py-4 hover:outline hover:outline-gray-400 hover:scale-105 hover:shadow-md rounded-lg transition-all duration-300"
                                onClick={() => setLrtType("jabodebek")}
                            >
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQpKCv62IqAAWsAaa-tAVd5lzFt3KAQ2z6dmEPXpZ7A_FYIMJRaS6r4sEYd&s=10.jpg"
                                    alt="LRT Jabodebek"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-xs">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setLrtType("jabodebek")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl ${lrtType === "jabodebek" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                            Jabodebek
                        </button>
                        <button
                            onClick={() => setLrtType("jakarta")}
                            className={`px-3 py-1.5 text-xs font-bold rounded-xl ${lrtType === "jakarta" ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-600"}`}
                        >
                            Jakarta
                        </button>
                    </div>

                    {isPetugas && (
                        <button
                            onClick={() => setShowAdd(true)}
                            className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 justify-center cursor-pointer"
                        >
                            <Plus size={16} /> Tambah Jadwal LRT
                        </button>
                    )}
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-24 bg-gray-100 rounded-2xl animate-pulse"
                            />
                        ))}
                    </div>
                ) : lrts?.length === 0 ? (
                    <div className="bg-white p-12 text-center rounded-3xl border border-gray-100 text-gray-400">
                        <p className="font-bold text-gray-700">
                            Tidak ada jadwal LRT tersedia
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {(Array.isArray(lrts) ? lrts : []).map((l, i) => (
                            <div
                                key={l.id || i}
                                className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between gap-4 hover:scale-105 hover:shadow-sm transition-all duration-300 cursor-pointer"
                                onClick={() => fetchDetailLrt(l.id)}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-xl shrink-0">
                                        🚈
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-0.5">
                                            <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                                                {l.type}
                                            </span>
                                            <h4 className="font-extrabold text-gray-900 text-sm">
                                                {l.code}
                                            </h4>
                                        </div>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Tujuan: {l.destination}
                                        </p>
                                    </div>
                                </div>
                                <span className="text-base font-black text-orange-600 shrink-0 flex gap-2">
                                    {l.departure}
                                    <span className="text-gray-500">➤</span>
                                </span>
                            </div>
                        ))}
                    </div>
                )}

                <Modal
                    isOpen={!!detailLrt}
                    onClose={() => setDetailLrt(null)}
                    title="Detail Rute & Stasiun"
                >
                    {detailLrt?.train[0] && (
                        <div className="space-y-4">
                            <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
                                <h4 className="font-bold text-gray-600 text-base flex gap-2 items-center">
                                    <TrainFront size={35}></TrainFront>{" "}
                                    {detailLrt?.train[0].code}
                                </h4>
                                <p className="text-xs text-gray-600 font-medium">
                                    {detailLrt?.train[0].direction}
                                </p>
                            </div>

                            <div className="space-y-0 relative pl-4 border-l-2 border-orange-200">
                                {(detailLrt?.train[0].station || []).map(
                                    (s, i) => (
                                        <div
                                            key={i}
                                            className="relative py-4 flex items-center justify-between text-xs"
                                        >
                                            <div className="absolute -left-[22px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-orange-500 border-2 border-white" />
                                            <span className="text-lg font-semibold text-gray-800">
                                                {s.name}
                                            </span>
                                            <span className="text-lg font-mono text-gray-400 font-bold">
                                                {s.time}
                                            </span>
                                        </div>
                                    ),
                                )}
                            </div>
                        </div>
                    )}
                </Modal>

                <Modal
                    isOpen={showAdd}
                    onClose={() => setShowAdd(false)}
                    title="Tambah Jadwal LRT"
                    footer={
                        <>
                            <button
                                className="px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-200 rounded-xl"
                                onClick={() => setShowAdd(false)}
                            >
                                Batal
                            </button>
                            <button
                                className="px-5 py-2 text-xs font-bold bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-md"
                                onClick={handleAdd}
                                disabled={addLoading}
                            >
                                {addLoading ? (
                                    <Loader2
                                        size={14}
                                        className="animate-spin"
                                    />
                                ) : (
                                    "Simpan"
                                )}
                            </button>
                        </>
                    }
                >
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Kode *
                            </label>
                            <input
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                value={addForm.code}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        code: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Waktu Berangkat (06:00 - 22:00) *
                            </label>
                            <input
                                type="time"
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                min="06:00"
                                max="22:00"
                                value={addForm.departure}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        departure: e.target.value,
                                    }))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                Tipe Jalur *
                            </label>
                            <select
                                className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                value={addForm.type}
                                onChange={(e) =>
                                    setAddForm((p) => ({
                                        ...p,
                                        type: e.target.value,
                                        stasiun_awal: "",
                                        stasiun_akhir: "",
                                        destination: "",
                                    }))
                                }
                            >
                                <option value="">Pilih Tipe</option>
                                <option value="jabodebek">Jabodebek</option>
                                <option value="jakarta">Jakarta</option>
                            </select>
                        </div>
                        {addForm.type === "jabodebek" && (
                            <>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Stasiun Awal
                                    </label>
                                    <select
                                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                        value={addForm.stasiun_awal}
                                        onChange={(e) =>
                                            setAddForm((p) => ({
                                                ...p,
                                                stasiun_awal: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">Pilih</option>
                                        <option value="dukuhatas">
                                            Dukuh Atas
                                        </option>
                                        <option value="jatimulya">
                                            Jatimulya
                                        </option>
                                        <option value="harjamukti">
                                            Harjamukti
                                        </option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                        Stasiun Akhir
                                    </label>
                                    <select
                                        className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                        value={addForm.stasiun_akhir}
                                        onChange={(e) =>
                                            setAddForm((p) => ({
                                                ...p,
                                                stasiun_akhir: e.target.value,
                                            }))
                                        }
                                    >
                                        <option value="">Pilih</option>
                                        <option value="dukuhatas">
                                            Dukuh Atas
                                        </option>
                                        <option value="jatimulya">
                                            Jatimulya
                                        </option>
                                        <option value="harjamukti">
                                            Harjamukti
                                        </option>
                                    </select>
                                </div>
                            </>
                        )}
                        {addForm.type === "jakarta" && (
                            <div>
                                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                                    Tujuan Stasiun
                                </label>
                                <select
                                    className="w-full px-3.5 py-2.5 text-sm bg-white border border-gray-200 rounded-xl outline-none"
                                    value={addForm.destination}
                                    onChange={(e) =>
                                        setAddForm((p) => ({
                                            ...p,
                                            destination: e.target.value,
                                        }))
                                    }
                                >
                                    <option value="">Pilih Tujuan</option>
                                    <option value="pegangsaandua">
                                        Pegangsaan Dua
                                    </option>
                                    <option value="manggarai">Manggarai</option>
                                </select>
                            </div>
                        )}
                    </div>
                </Modal>
            </div>
        </>
    );
}
