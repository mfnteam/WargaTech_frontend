import { Link, Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import logo from "../../assets/logo_app.png";

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50/60">
            <Navbar />
            <main className="flex-1">
                <Outlet />
            </main>
            <footer className="bg-gray-800 border-t border-gray-800/80 py-8 mt-auto text-white">
                <div className="max-w-6xl mx-auto px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex items-end gap-[2px]">
                                    <img
                                        src={logo}
                                        className="w-15 h-15"
                                        alt=""
                                    />
                                </div>

                                <h2 className="text-xl font-bold">
                                    Warga
                                    <span className="text-orange-400">
                                        Tech
                                    </span>
                                </h2>
                            </div>

                            <p className="text-sm leading-5 text-gray-400 max-w-md">
                                Platform digital untuk akses layanan publik
                                terpadu, pantau mobilitas ramah lingkungan, dan
                                ikut serta membangun lingkungan masyarakat yang
                                lebih cerdas dan aman.
                            </p>
                        </div>

                        {/* Layanan */}
                        <div>
                            <h3 className="text-base font-bold mb-6">
                                Layanan Warga
                            </h3>

                            <ul className="space-y-3 text-sm text-gray-400">
                                <li>
                                    <Link
                                        to={"/layanan-kesehatan"}
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        Kesehatan sosial
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to={"/mobilitas"}
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        Mobilitas Kota
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to={"/stabilitas-lingkungan"}
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        Stabilitas Lingkungan
                                    </Link>
                                </li>

                                <li>
                                    <Link
                                        to={"/#report-section"}
                                        className="hover:text-white transition-colors duration-200"
                                    >
                                        Lapor Masalah Kota
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Kontak */}
                        <div>
                            <h3 className="text-base font-bold mb-6">Kontak</h3>

                            <div className="space-y-4 text-sm text-gray-400">
                                <div className="flex items-center gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.09l-4.423-.995a1.125 1.125 0 0 0-1.173.417l-.97 1.182a11.25 11.25 0 0 1-5.508-5.508l1.182-.97c.332-.272.48-.708.417-1.173l-.995-4.423A1.125 1.125 0 0 0 8.359 4.5H6.75A2.25 2.25 0 0 0 4.5 6.75v0Z"
                                        />
                                    </svg>

                                    <span>(+62) 858 9993 8897</span>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-4 h-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25H4.5a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5H4.5a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.08 1.93l-7.5 4.615a2.25 2.25 0 0 1-2.34 0l-7.5-4.615a2.25 2.25 0 0 1-1.08-1.93V6.75"
                                        />
                                    </svg>

                                    <span>support.wargatech@gmail.com</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-gray-600/60 mt-10 pt-5">
                        <p className="text-sm text-gray-500">
                            © 2026 MFN Company, All right reserved
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
