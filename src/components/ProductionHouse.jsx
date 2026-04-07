import React from "react";
import { useNavigate } from "react-router-dom";
import disneyLogo from "../assets/images/disney-logo-1.png";
import pixarLogo from "../assets/images/pixar-logo.png";
import natgeoLogo from "../assets/images/natgeo-logo.png";

function ProductionHouse() {
  const navigate = useNavigate();
  const productionHouseList = [
    {
      id: 2,
      name: "Disney",
      image: disneyLogo,
      bgGradient: "from-blue-900/60 to-blue-950/30",
    },
    {
      id: 3,
      name: "PIXAR",
      textOnly: true,
      bgGradient: "from-teal-900/50 to-emerald-950/30",
      textColor: "text-emerald-300",
    },
    {
      id: 420,
      name: "MARVEL",
      textOnly: true,
      bgGradient: "from-red-900/60 to-red-950/30",
      textColor: "text-red-500",
    },
    {
      id: 1,
      name: "STAR WARS",
      textOnly: true,
      bgGradient: "from-amber-900/50 to-yellow-950/30",
      textColor: "text-yellow-400",
    },
    {
      id: 7521,
      name: "National Geographic",
      image: natgeoLogo,
      bgGradient: "from-amber-900/50 to-yellow-950/30",
    },
  ];

  return (
    <div className="flex gap-2 md:gap-5 p-2 px-5 md:px-16 mt-4">
      {productionHouseList.map((item) => (
        <div
          key={item.id}
          onClick={() => navigate(`/studio/${item.id}`)}
          className={`relative border-[2px] border-gray-600 rounded-lg
            hover:scale-110 transition-all duration-300 ease-in-out
            cursor-pointer shadow-xl shadow-gray-800 hover:border-gray-400
            hover:shadow-2xl hover:shadow-gray-600/50
            overflow-hidden bg-gradient-to-t ${item.bgGradient} bg-[#0c111b]
            flex items-center justify-center
            min-h-[56px] md:min-h-[100px] w-full`}
        >
          {item.textOnly ? (
            <span
              className={`${item.textColor} text-[10px] md:text-[18px] font-extrabold tracking-[2px] md:tracking-[4px] text-center px-2 drop-shadow-lg`}
            >
              {item.name}
            </span>
          ) : (
            <img
              src={item.image}
              alt={item.name}
              className="w-3/4 max-h-[80%] object-contain p-1 md:p-3 opacity-90 hover:opacity-100 transition-opacity duration-500"
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductionHouse;
