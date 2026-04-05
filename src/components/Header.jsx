import React, { useState } from "react";
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
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    { name: "HOME", icon: HiHome, path: "/" },
    { name: "SEARCH", icon: HiMagnifyingGlass, path: "/search" },
    { name: "WATCH LIST", icon: HiPlus, path: "/watchlist" },
    { name: "ORIGINALS", icon: HiStar, path: "/originals" },
    { name: "MOVIES", icon: HiPlayCircle, path: "/movies" },
    { name: "SERIES", icon: HiTv, path: "/series" },
  ];

  return (
    <div className="bg-black flex items-center justify-between gap-8 p-4 z-[10] sticky top-0">
      <div className="flex items-center gap-8">
        <img src={Disney} className="w-[80px] md:w-[115px] object-cover cursor-pointer" onClick={() => navigate("/")} />
        
        {/* Menu Desktop */}
        <div className="hidden md:flex gap-8">
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
        
        {/* Menu Mobile */}
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
              <div className="absolute mt-3 bg-[#121212] border-[1px] border-gray-700 p-3 px-5 py-4 z-[100] left-[-30px] rounded-md shadow-lg">
                {menu.map((item, index) => index >= 3 && (
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
            ) : null}
          </div>
        </div>
      </div>
      <img
        src="https://i.pinimg.com/474x/db/3a/62/db3a623acc8396fb285ec899ad01cd10.jpg"
        className="w-[40px] h-[40px] md:w-[50px] md:h-[50px] rounded-full object-cover cursor-pointer"
        alt="Profile"
      />
    </div>
  );
}

export default Header;
