import React from "react";
import { MdClose } from "react-icons/md";

const ImageModel = ({ src, handleClose }) => {
  console.log(src);
  return (
    <div
      onClick={handleClose}
      className="bg-[#000000d9] h-screen w-full fixed z-[99] backdrop-blur-lg top-0 left-0 flex flex-col items-center justify-center p-5"
    >
      <div className="absolute top-2 right-2" onClick={handleClose}>
        <MdClose className="text-2xl text-white font-bold" />
      </div>
      <img src={src} className="md:w-[40%] w-[90%] rounded-lg" loading="lazy" />
    </div>
  );
};

export default ImageModel;
