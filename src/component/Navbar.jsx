import React from "react";
import { HiSun } from "react-icons/hi";
import { FaUser } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";

const Navbar = () => {
  return (
    <div
      className="nav w-full
 flex items-center justify-between px-[40px] h-[90px] border-b border-gray-800"
    >
      <div className="logo">
        <h3 className="text-[25px] font-bold sp-text">GenZ UI</h3>
      </div>
      <div className="icons flex items-center gap-[15px]">
        <div className="icon ">
          <HiSun />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
