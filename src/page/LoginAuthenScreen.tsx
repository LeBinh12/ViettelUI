import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthInput from "../components/Authen/AuthInput";
import AuthButton from "../components/Authen/AuthButton";
import { useAuth } from "../hooks/useAuth";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom";
import { authApi } from "../api/authApi";
import { toast } from "react-toastify";
import { userApi } from "../api/userAPI";

export default function LoginAuthenScreen() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { saveToken } = useAuth();
    const setUser = useSetRecoilState(userAtom);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        authApi
            .login({ username, password })
            .then(async (res) => {
                toast.success(res.message || "Đăng nhập thành công!");
                saveToken(res.data);
                try {
                    const user = await userApi.getProfile(res.data);
                    setUser(user.data);
                } catch { }
                navigate("/home");
            })
            .catch((err) => {
                toast.error(err.response?.data?.message || "Sai tài khoản hoặc mật khẩu");
            });
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-red-50 relative overflow-hidden">

            {/* Logo Viettel góc trái */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="absolute top-6 left-6 flex items-center gap-2 z-20"
            >
                <div className="w-10 h-10 bg-[#E60000] rounded-xl flex items-center justify-center shadow-md">
                    <svg width="26" height="26" viewBox="0 0 48 48" fill="white">
                        <path d="M24 8L30.928 18.286L42 20.382L33.6 28.528L35.856 40L24 34.286L12.144 40L14.4 28.528L6 20.382L17.072 18.286L24 8Z" />
                    </svg>
                </div>
                <span className="text-xl font-extrabold text-[#E60000] tracking-wide">
                    VIETTEL
                </span>
            </motion.div>

            {/* Sóng nền mềm mại */}
            <div className="absolute bottom-0 left-0 right-0 opacity-80">
                <svg viewBox="0 0 1440 320" className="w-full h-auto">
                    <path fill="#FFE5E5" d="M0,224L1440,160L1440,320L0,320Z"></path>
                    <path fill="#FFD6D6" d="M0,160L1440,96L1440,320L0,320Z"></path>
                </svg>
            </div>

            {/* Khối form */}
            <div className="relative z-10 flex justify-center items-center min-h-screen px-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.94 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    className="w-full max-w-md"
                >
                    {/* Header đỏ */}
                    <div className="bg-gradient-to-br from-[#E60000] to-[#CC0000] text-white text-center py-7 rounded-t-3xl shadow-md">
                        <h1 className="text-2xl font-extrabold">Đăng nhập tài khoản</h1>
                        <p className="text-red-100 text-sm mt-1">
                            Trải nghiệm dịch vụ Viettel một cách dễ dàng
                        </p>
                    </div>

                    {/* Form */}
                    <div className="bg-white rounded-b-3xl shadow-xl px-8 py-10 border border-gray-100">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AuthInput
                                label="Số điện thoại hoặc tài khoản"
                                type="text"
                                placeholder="Nhập số điện thoại (10 số)"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />

                            <AuthInput
                                label="Mật khẩu"
                                type="password"
                                placeholder="Nhập mật khẩu của bạn"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />

                            {/* Nút đăng nhập */}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                                <AuthButton
                                    type="submit"
                                    className="w-full bg-[#003087] hover:bg-[#012A6C] text-white font-bold text-lg py-4 rounded-xl shadow-lg transition-all"
                                >
                                    ĐĂNG NHẬP NGAY
                                </AuthButton>
                            </motion.div>

                            <div className="text-center space-y-4 pt-2">
                                <button className="text-red-600 font-medium text-sm hover:underline">
                                    Quên mật khẩu?
                                </button>

                                <div className="border-t pt-5 text-sm text-gray-600">
                                    Chưa có tài khoản?
                                    <button
                                        type="button"
                                        onClick={() => navigate("/register")}
                                        className="text-red-600 font-bold ml-1 hover:underline"
                                    >
                                        Đăng ký miễn phí
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
