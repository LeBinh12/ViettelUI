import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Authen/AuthForm";
import AuthInput from "../components/Authen/AuthInput";
import { motion } from "framer-motion";
import AuthButton from "../components/Authen/AuthButton";
import { useAuth } from "../hooks/useAuth";
import { useSetRecoilState } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom";
import { authApi } from "../api/authApi";
import { toast } from "react-toastify";
import { userApi } from "../api/userAPI";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigation = useNavigate();

  const { saveToken } = useAuth();
  const setUser = useSetRecoilState(userAtom);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    authApi
      .login({ username, password })
      .then(async (res) => {
        toast.success(res.message);
        saveToken(res.data);
        console.log(res.data);
        try {
          const user = await userApi.getProfile(res.data);
          setUser(user.data); // Lưu vào Recoil
        } catch {
          toast.error("Không thể lấy profile sau đăng nhập");
          console.warn("Không thể lấy profile sau đăng nhập");
        }

        navigation("/home");
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message || "Đăng nhập thất bại");
          console.log(err.response.data);
        } else {
          toast.error(err.message);
          console.log(err.message);
        }
      });
  };

  return (
    <>
      <AuthForm title="Đăng nhập" onSubmit={handleSubmit}>
        <AuthInput
          label="Username"
          type="text"
          placeholder="Nhập tài khoản..."
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <AuthInput
          label="Mật khẩu"
          type="password"
          placeholder="Nhập mật khẩu..."
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
          <AuthButton type="submit">Đăng nhập</AuthButton>
        </motion.div>
        <div className="mt-4 text-center text-sm text-gray-500">
          Chưa có tài khoản?{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => navigation("/register")}
          >
            Đăng ký ngay
          </button>
        </div>
      </AuthForm>
    </>
  );
}
