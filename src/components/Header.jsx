import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HiTv,
  HiPlayCircle,
  HiStar,
  HiHome,
  HiMagnifyingGlass,
} from "react-icons/hi2";
import { HiPlus, HiDotsVertical } from "react-icons/hi";
import Disney from "../assets/images/disney-logo-1.png";
import HeaderItem from "./HeaderItem";

function Header() {
  const [toggle, setToggle] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const menu = [
    { name: "HOME", icon: HiHome, path: "/" },
    { name: "SEARCH", icon: HiMagnifyingGlass, path: "/search" },
    { name: "WATCH LIST", icon: HiPlus, path: "/watchlist" },
    { name: "ORIGINALS", icon: HiStar, path: "/originals" },
    { name: "MOVIES", icon: HiPlayCircle, path: "/movies" },
    { name: "SERIES", icon: HiTv, path: "/series" },
  ];

  return (
    <div className={`flex items-center justify-between p-4 z-[100] fixed top-0 left-0 w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-[#040714]/80 backdrop-blur-md border-b border-white/5 py-2" 
        : "bg-transparent py-4"
    }`}>
      {/* Kolom Kiri: Logo */}
      <div className="flex items-center">
        <img src={Disney} className="w-[80px] md:w-[115px] object-cover cursor-pointer hover:scale-105 transition-all" onClick={() => navigate("/")} />
      </div>
      
      {/* Kolom Tengah: Menu Desktop (Centered) */}
      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 gap-8 bg-black/10 px-8 py-2 rounded-full border border-white/5 backdrop-blur-sm">
        {menu.map((item, index) => (
          <HeaderItem
            key={index}
            name={item.name}
            Icon={item.icon}
            isActive={location.pathname === item.path}
            onClick={() => {
              navigate(item.path);
              setToggle(false);
            }}
          />
        ))}
      </div>
      
      {/* Kolom Kanan: Mobile Menu & Profile */}
      <div className="flex items-center gap-5">
        {/* Mobile Menu Icons */}
        <div className="flex md:hidden gap-5">
          {menu.map((item, index) => index < 3 && (
            <HeaderItem
              key={index}
              name={""}
              Icon={item.icon}
              isActive={location.pathname === item.path}
              onClick={() => navigate(item.path)}
            />
          ))}
          
          <div className="md:hidden relative" onClick={() => setToggle(!toggle)}>
            <HeaderItem name={""} Icon={HiDotsVertical} />
            
            {/* Dropdown Menu Mobile */}
            {toggle ? (
              <div className="absolute mt-3 bg-[#121212] border-[1px] border-gray-700 p-3 px-5 py-4 z-[100] left-[-150px] w-[200px] rounded-md shadow-lg backdrop-blur-xl">
                {menu.map((item, index) => index >= 0 && (
                  <div key={index} className="mb-2 last:mb-0">
                    <HeaderItem
                      name={item.name}
                      Icon={item.icon}
                      isActive={location.pathname === item.path}
                      onClick={() => {
                        navigate(item.path);
                        setToggle(false);
                      }}
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        {/* Profile Avatar */}
        <img
          src={JSON.parse(localStorage.getItem("userProfile") || "{}").avatar || "https://i.pinimg.com/474x/db/3a/62/db3a623acc8396fb285ec899ad01cd10.jpg"}
          className="w-[40px] h-[40px] md:w-[48px] md:h-[48px] rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all duration-300 shadow-lg"
          alt="Profile"
          onClick={() => navigate("/profile")}
        />
      </div>
    </div>
  );
}

export default Header;
