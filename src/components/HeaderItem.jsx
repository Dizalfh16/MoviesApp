import React from "react";

function HeaderItem({ name, Icon, onClick, isActive }) {
  return (
    <div
      onClick={onClick}
      className={`text-white flex items-center gap-3 text-[15px] font-semibold cursor-pointer
        hover:underline hover:underline-offset-8 mb-2 transition-all duration-200
        ${isActive ? "underline underline-offset-8 text-white" : "text-gray-300 hover:text-white"}`}
    >
      <Icon className={`text-xl ${isActive ? "text-white" : ""}`} />
      <h2 className={name === "" ? "hidden" : "block"}>{name}</h2>
    </div>
  );
}

export default HeaderItem;

