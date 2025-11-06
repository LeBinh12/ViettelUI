import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom";

export default function HomeLayout() {
  const [user, setUser] = useRecoilState(userAtom);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#2665b1] to-blue-400 rounded-full flex items-center justify-center text-white font-bold">
              C
            </div>
            <h1 className="text-xl font-bold text-gray-800">Chattrix</h1>
          </div>

          {/* User info + logout */}
          <div className="flex items-center space-x-4">
            {user && (
              <div className="text-gray-700 font-medium">{user.username}</div>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Đăng xuất
            </button>
          </div>
        </nav>
      </header>

      {/* Nội dung chính */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
