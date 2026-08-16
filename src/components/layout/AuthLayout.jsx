export default function AuthLayout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#fbf9f8] text-gray-900 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 selection:bg-orange-500 selection:text-white">
      {children}
    </div>
  );
}
