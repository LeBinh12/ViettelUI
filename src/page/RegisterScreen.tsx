import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthForm from "../components/Authen/AuthForm";
import AuthInput from "../components/Authen/AuthInput";
import AuthButton from "../components/Authen/AuthButton";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { authApi } from "../api/authApi";

export default function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    authApi
      .register({ username, password })
      .then((res) => {
        toast.success(res.message || "Đăng ký thành công!");
        navigation("/login");
      })
      .catch((err) => {
        if (err.response) {
          toast.error(err.response.data.message || "Đăng ký thất bại");
        } else {
          toast.error(err.message);
        }
      });
  };

  return (
    <>
      <AuthForm title="Đăng ký tài khoản" onSubmit={handleSubmit}>
        <AuthInput
          label="Tên đăng nhập"
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
        <AuthInput
          label="Xác nhận mật khẩu"
          type="password"
          placeholder="Nhập lại mật khẩu..."
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.8 }}>
          <AuthButton type="submit">Đăng ký</AuthButton>
        </motion.div>

        <div className="mt-4 text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <button
            type="button"
            className="text-blue-500 hover:underline"
            onClick={() => navigation("/login")}
          >
            Đăng nhập
          </button>
        </div>
      </AuthForm>
    </>
  );
}
