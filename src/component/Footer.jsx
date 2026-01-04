import React from "react";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#141319] text-gray-400 py-6 px-4 md:px-10 mt-10 border-t border-gray-800">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Brand */}
        <div className="text-center md:text-left">
          <h3 className="text-lg font-bold sp-text text-white">GenZ UI</h3>
          <p className="text-sm text-gray-400 mt-1">
            Building smarter UI components with AI
          </p>
        </div>

        {/* Center: Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 text-sm">
          <a href="#" className="hover:text-white transition-colors">
            About
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Contact
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Privacy Policy
          </a>
        </div>

        {/* Right: Social Icons */}
        <div className="flex items-center gap-4 text-xl text-gray-400">
          <a href="https://github.com/jaikisharma73?tab=repositories" className="hover:text-white transition-colors">
            <FaGithub />
          </a>
          <a href="https://www.linkedin.com/in/jaiki-sharma-a875a1384/" className="hover:text-white transition-colors">
            <FaLinkedin />
          </a>
        </div>
      </div>

      {/* Bottom: copyright */}
      <div className="text-center text-xs text-gray-500 mt-4">
        &copy; {new Date().getFullYear()} GenZ UI. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
