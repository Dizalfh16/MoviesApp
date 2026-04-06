import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import IMAGE_BASE_URL from "../Constant";
import {
  HiPencilSquare,
  HiCheck,
  HiXMark,
  HiFilm,
  HiEye,
  HiBookmark,
  HiStar,
  HiArrowRightOnRectangle,
  HiCamera,
  HiClock,
  HiHeart,
  HiChevronRight,
} from "react-icons/hi2";

const DEFAULT_AVATAR =
  "https://i.pinimg.com/474x/db/3a/62/db3a623acc8396fb285ec899ad01cd10.jpg";

const AVATAR_OPTIONS = [
  "https://i.pinimg.com/736x/a7/91/76/a791768105db81c5bb4005e6d4e3a3a9.jpg",
  "https://i.pinimg.com/736x/10/13/8b/10138b47c12e3085d498db0c95e8f0dd.jpg",
  "https://i.pinimg.com/736x/f5/27/81/f5278114c0b106e4f0aa0ee7a1f98267.jpg",
  "https://i.pinimg.com/736x/5f/38/c8/5f38c8003dae02f85bcfa87a82ffdc96.jpg",
  "https://i.pinimg.com/736x/6a/55/2a/6a552a72c654c9801774e50f6b3cd302.jpg",
  "https://i.pinimg.com/736x/40/e6/30/40e63027eb218b5abfbf45eca9554bad.jpg",
];

function Profile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    name: "User",
    bio: "Pecinta film dan serial 🎬",
    avatar: DEFAULT_AVATAR,
    joinDate: new Date().toISOString(),
  });

  const [editForm, setEditForm] = useState({ name: "", bio: "" });
  const [watchlist, setWatchlist] = useState([]);
  const [favorites, setFavorites] = useState([]);

  const nameInputRef = useRef(null);

  // Load profile & watchlist from localStorage
  useEffect(() => {
    const savedProfile = JSON.parse(localStorage.getItem("userProfile") || "null");
    if (savedProfile) {
      setProfile(savedProfile);
    } else {
      // First time - save default
      const defaultProfile = {
        name: "User",
        bio: "Pecinta film dan serial 🎬",
        avatar: DEFAULT_AVATAR,
        joinDate: new Date().toISOString(),
      };
      localStorage.setItem("userProfile", JSON.stringify(defaultProfile));
    }

    const savedWatchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
    setWatchlist(savedWatchlist);

    const savedFavorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    setFavorites(savedFavorites);

    // Trigger entrance animation
    setTimeout(() => setAnimateIn(true), 50);
  }, []);

  // Start editing
  const startEditing = () => {
    setEditForm({ name: profile.name, bio: profile.bio });
    setIsEditing(true);
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  // Save profile
  const saveProfile = () => {
    const updatedProfile = {
      ...profile,
      name: editForm.name.trim() || "User",
      bio: editForm.bio.trim() || "Pecinta film dan serial 🎬",
    };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    setIsEditing(false);
  };

  // Change avatar
  const changeAvatar = (url) => {
    const updatedProfile = { ...profile, avatar: url };
    setProfile(updatedProfile);
    localStorage.setItem("userProfile", JSON.stringify(updatedProfile));
    setShowAvatarPicker(false);
  };

  // Format join date
  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Stats data
  const stats = [
    {
      icon: HiBookmark,
      label: "Watchlist",
      value: watchlist.length,
      color: "from-blue-500 to-cyan-400",
      onClick: () => navigate("/watchlist"),
    },
    {
      icon: HiHeart,
      label: "Favorites",
      value: favorites.length,
      color: "from-pink-500 to-rose-400",
      onClick: null,
    },
    {
      icon: HiEye,
      label: "Ditonton",
      value: Math.floor(Math.random() * 20) + watchlist.length,
      color: "from-purple-500 to-violet-400",
      onClick: null,
    },
    {
      icon: HiStar,
      label: "Reviews",
      value: 0,
      color: "from-amber-500 to-yellow-400",
      onClick: null,
    },
  ];

  // Menu items
  const menuItems = [
    { icon: HiClock, label: "Riwayat Tontonan", subtitle: "Lihat film yang sudah ditonton" },
    { icon: HiHeart, label: "Film Favorit", subtitle: "Film yang kamu sukai" },
    { icon: HiFilm, label: "Preferensi Genre", subtitle: "Atur genre favoritmu" },
  ];

  return (
    <div className="min-h-screen bg-[#040714] pb-12">
      {/* Hero / Banner Section */}
      <div className="relative h-[260px] md:h-[320px] overflow-hidden">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a1a5e] via-[#0c0c3a] to-[#040714]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#040714] via-transparent to-transparent" />

        {/* Animated circles */}
        <div className="absolute top-10 right-10 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 left-10 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-20 left-1/3 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Profile Card */}
      <div
        className={`relative -mt-32 px-5 md:px-16 transition-all duration-700 ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          {/* Avatar + Info */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-5 md:gap-8">
            {/* Avatar */}
            <div className="relative group">
              <div className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] rounded-full p-[3px] bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
                <img
                  src={profile.avatar}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-4 border-[#040714]"
                />
              </div>
              <button
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="absolute bottom-1 right-1 bg-blue-600 hover:bg-blue-500 p-2.5 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
              >
                <HiCamera className="text-white text-lg" />
              </button>
            </div>

            {/* Info */}
            <div className="text-center md:text-left flex-1">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    ref={nameInputRef}
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white text-2xl font-bold px-4 py-2 rounded-xl w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Nama kamu..."
                    maxLength={30}
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="bg-white/10 backdrop-blur-sm border border-white/20 text-gray-300 text-sm px-4 py-2 rounded-xl w-full resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Bio singkat..."
                    rows={2}
                    maxLength={100}
                  />
                  <div className="flex gap-2 justify-center md:justify-start">
                    <button
                      onClick={saveProfile}
                      className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-5 py-2 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                    >
                      <HiCheck className="text-lg" /> Simpan
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-5 py-2 rounded-xl font-medium transition-all duration-300"
                    >
                      <HiXMark className="text-lg" /> Batal
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {profile.name}
                  </h1>
                  <p className="text-gray-400 text-sm md:text-base mb-2">{profile.bio}</p>
                  <p className="text-gray-500 text-xs">
                    Bergabung sejak {formatDate(profile.joinDate)}
                  </p>
                </>
              )}
            </div>

            {/* Edit Button */}
            {!isEditing && (
              <button
                onClick={startEditing}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-xl font-medium transition-all duration-300 hover:scale-105 border border-white/10"
              >
                <HiPencilSquare className="text-lg" />
                Edit Profil
              </button>
            )}
          </div>

          {/* Avatar Picker */}
          {showAvatarPicker && (
            <div
              className="mt-6 p-5 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl animate-fadeIn"
              style={{ animation: "fadeIn 0.3s ease-out" }}
            >
              <p className="text-white font-semibold mb-3">Pilih Avatar</p>
              <div className="flex flex-wrap gap-3">
                {AVATAR_OPTIONS.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt={`Avatar ${idx + 1}`}
                    className={`w-16 h-16 rounded-full object-cover cursor-pointer border-2 transition-all duration-300 hover:scale-110 ${
                      profile.avatar === url
                        ? "border-blue-500 scale-110"
                        : "border-transparent hover:border-white/50"
                    }`}
                    onClick={() => changeAvatar(url)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div
        className={`px-5 md:px-16 mt-10 transition-all duration-700 delay-200 ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              onClick={stat.onClick}
              className={`relative overflow-hidden bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center transition-all duration-300 hover:scale-105 hover:bg-white/10 ${
                stat.onClick ? "cursor-pointer" : ""
              }`}
            >
              {/* Gradient glow */}
              <div
                className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${stat.color} rounded-full blur-2xl opacity-20`}
              />
              <stat.icon
                className={`text-3xl mx-auto mb-2 bg-gradient-to-br ${stat.color} bg-clip-text`}
                style={{ color: "transparent", backgroundClip: "text", WebkitBackgroundClip: "text" }}
              />
              {/* Fallback icon with color */}
              <div className={`text-3xl mx-auto mb-2 -mt-10`}>
                <stat.icon className="mx-auto" style={{ color: idx === 0 ? '#38bdf8' : idx === 1 ? '#f472b6' : idx === 2 ? '#a78bfa' : '#fbbf24' }} />
              </div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-gray-400 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Section */}
      <div
        className={`px-5 md:px-16 mt-8 transition-all duration-700 delay-300 ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Pengaturan</h2>
          <div className="space-y-3">
            {menuItems.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 cursor-pointer hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="p-3 bg-white/10 rounded-xl group-hover:bg-white/20 transition-all">
                  <item.icon className="text-xl text-blue-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-gray-500 text-sm">{item.subtitle}</p>
                </div>
                <HiChevronRight className="text-gray-500 text-xl group-hover:text-white group-hover:translate-x-1 transition-all" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Watchlist Preview */}
      {watchlist.length > 0 && (
        <div
          className={`px-5 md:px-16 mt-8 transition-all duration-700 delay-[400ms] ${
            animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Watchlist Saya</h2>
              <button
                onClick={() => navigate("/watchlist")}
                className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1"
              >
                Lihat Semua <HiChevronRight />
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto scrollbar-none pb-2">
              {watchlist.slice(0, 8).map((item) => (
                <div
                  key={item.id}
                  onClick={() => navigate(`/movie/${item.id}`)}
                  className="flex-shrink-0 w-[120px] cursor-pointer group"
                >
                  <img
                    src={IMAGE_BASE_URL + item.poster_path}
                    alt={item.title}
                    className="w-full h-[170px] object-cover rounded-xl border-2 border-transparent group-hover:border-blue-500 transition-all duration-300 group-hover:scale-105"
                  />
                  <p className="text-xs text-gray-400 group-hover:text-white mt-2 truncate transition-colors">
                    {item.title || item.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Logout Button */}
      <div
        className={`px-5 md:px-16 mt-10 transition-all duration-700 delay-500 ${
          animateIn ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        <div className="max-w-3xl mx-auto">
          <button className="w-full flex items-center justify-center gap-3 bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 hover:text-red-300 py-3.5 rounded-2xl font-medium transition-all duration-300">
            <HiArrowRightOnRectangle className="text-xl" />
            Keluar
          </button>
        </div>
      </div>

      {/* Inline animation keyframe */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Profile;
