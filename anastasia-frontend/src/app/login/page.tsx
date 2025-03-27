"use client";

import { useState } from "react";
import axios from "@/lib/axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "@/store/authSlice";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();

  const handleLogin = async () => {
    try {
      const res = await axios.post("/user/login", { email, password });
      dispatch(loginSuccess(res.data.user));
      localStorage.setItem("token", res.data.user.token);
      alert("Giriş başarılı!");
    } catch (err: any) {
      alert(err.response?.data?.message || "Hata oluştu");
    }
  };

  return (
    <div>
      <h2>Giriş Yap</h2>
      <input placeholder="E-mail" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Şifre" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Giriş</button>
    </div>
  );
}
