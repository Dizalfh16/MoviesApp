import React from "react";
import logo from "../assets/images/disney-logo-1.png";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";

function Footer() {
  const footerLinks = [
    "Privacy Policy",
    "Subscriber Agreement",
    "Help",
    "Supported Devices",
    "About Us",
    "Interest-Based Ads",
  ];

  return (
    <footer className="w-full bg-[#040714] border-t border-gray-800 pt-10 pb-8 mt-10">
      <div className="max-w-[1200px] mx-auto px-5 flex flex-col items-center">
        {/* Logo */}
        <img src={logo} alt="Logo" className="w-[80px] md:w-[100px] mb-6 object-contain" />

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 w-full max-w-[800px]">
          {footerLinks.map((link, index) => (
            <a
              key={index}
              href="#"
              className="text-gray-400 hover:text-white text-xs md:text-sm transition-colors duration-300"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Social Icons */}
        <div className="flex gap-6 mb-8">
          <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-110">
            <FaFacebook size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-110">
            <FaTwitter size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-110">
            <FaInstagram size={20} />
          </a>
          <a href="#" className="text-gray-400 hover:text-white transition-transform hover:scale-110">
            <FaYoutube size={20} />
          </a>
        </div>

        {/* Copyright */}
        <p className="text-gray-500 text-xs text-center leading-relaxed">
          © Disney. All Rights Reserved. <br className="md:hidden" />
          Data provided by TMDB. This is a clone project not affiliated with Disney.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
