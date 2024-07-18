import React from "react";
import { TImageUpload } from "../types";
import { MdOutlineAddAPhoto } from "react-icons/md";

interface Props {
  image?: TImageUpload;
  setImage: React.Dispatch<React.SetStateAction<TImageUpload | undefined>>;
  name: string;
  id: string;
  htmlFor: string;
  alt: string;
}

function ImageUpload({ image, setImage, name, id, htmlFor, alt }: Props) {
  return (
    <div className="relative flex justify-center items-center w-full p-4 border border-[#2f3336]">
      <div
        className={`relative h-16 bg-[#3e4144] ${
          name === "cover-picture-file" ? "w-32" : "w-16"
        }`}
      >
        <input
          name={name}
          id={id}
          className="w-full h-full invisible"
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files &&
            e.target.files[0] &&
            setImage({
              preview: URL.createObjectURL(e.target.files[0]),
              data: e.target.files[0],
            })
          }
        />
        <label
          className="absolute z-10 inset-0 flex justify-center items-center w-full h-full bg-black/80 cursor-pointer"
          htmlFor={htmlFor}
        >
          <MdOutlineAddAPhoto className="text-base" />
        </label>
        {image && image.preview && (
          <img
            src={image.preview}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
      </div>
    </div>
  );
}

export default ImageUpload;
