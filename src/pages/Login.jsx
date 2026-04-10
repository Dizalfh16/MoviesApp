import React, { useState } from "react";
import { supabase } from "../Services/supabaseClient";
import { useNavigate } from "react-router-dom";
import { HiEnvelope, HiLockClosed } from "react-icons/hi2";

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();

  const FORBIDDEN_DOMAINS = [
    "yopmail", "mailinator", "tempmail", "10minutemail",
    "guerrillamail", "sharklasers", "throwawaymail", "temp-mail",
    "maildrop", "getnada", "dispostable", "trashmail"
  ];

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      if (!isLogin) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
          throw new Error("Format email yang Anda masukkan tidak valid.");
        }
        
        const domain = email.split('@')[1]?.toLowerCase() || "";
        const isDisposable = FORBIDDEN_DOMAINS.some(d => domain.includes(d));
        if (isDisposable) {
          throw new Error("Pendaftaran ditolak! Harap gunakan email resmi (seperti Gmail, Yahoo, dsb). Email sementara/palsu diblokir dari sistem kami.");
        }
      }

      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        navigate("/");
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        
        // Supabase returns a user session immediately if email confirmation is off
        if (data.session) {
          navigate("/");
        } else {
          setIsEmailSent(true);
        }
      }
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center px-4 overflow-hidden -mt-[84px] pt-[84px]">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2070&auto=format&fit=crop" 
          alt="Movies Background" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-[#040714]/80 to-transparent"></div>
        <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      </div>

      {/* Login Card - Glassmorphism */}
      <div className="relative z-10 w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl">
        
        {isEmailSent ? (
          <div className="text-center py-4">
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-400 mb-2">
              Cek Email Anda
            </h2>
            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiEnvelope className="text-4xl text-emerald-400" />
            </div>
            <p className="text-gray-300 text-sm mb-8 leading-relaxed">
              Tautan verifikasi telah dikirimkan ke <br/>
              <strong className="text-white text-base">{email}</strong><br/><br/>
              Silakan periksa kotak masuk (atau folder spam) Anda dan klik tautan tersebut untuk mengaktifkan akun!
            </p>
            <button
              onClick={() => {
                setIsEmailSent(false);
                setIsLogin(true);
              }}
              className="w-full bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 shadow-lg hover:shadow-white/10"
            >
              Kembali ke Login
            </button>
          </div>
        ) : (
          <React.Fragment>
            <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-emerald-400">
            {isLogin ? "Welcome Back" : "Create Account"}
          </h2>
          <p className="text-gray-300 mt-2 text-sm">
            {isLogin ? "Sign in to access your watchlists and favorites" : "Join to unlock premium movie features"}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-500/20 border border-red-500/50 text-red-200 p-3 rounded-lg text-sm mb-6 text-center backdrop-blur-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <HiEnvelope className="text-xl" />
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all placeholder-gray-400"
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <HiLockClosed className="text-xl" />
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full pl-10 pr-4 py-3 bg-black/20 border border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-white transition-all placeholder-gray-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white font-bold py-3 px-4 rounded-xl shadow-lg hover:shadow-blue-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider text-sm mt-4"
          >
            {loading ? "Menyambungkan..." : (isLogin ? "Sign In" : "Sign Up")}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <p className="text-gray-400 text-sm">
            {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-white hover:text-blue-400 font-semibold transition-colors underline decoration-blue-500/30 hover:decoration-blue-500 underline-offset-4"
            >
              {isLogin ? "Daftar Sekarang" : "Login Disini"}
            </button>
          </p>
        </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}

export default Login;
