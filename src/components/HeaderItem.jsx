import React from "react";

function HeaderItem({ name, Icon }) {
  return (
    <div className="text-white flex items-center gap-3 text-[15px] font-semibold cursor-pointer hover:underline hover:underline-offset-8 mb-2">
      <Icon className="text-xl" />
      <h2 className={name === "" ? "hidden" : "block"}>{name}</h2>
    </div>
  );
}

export default HeaderItem;
