import { Dispatch, SetStateAction } from "react";
import { TImageUpload } from "modules/users/types/userTypes";
import { MdOutlineAddAPhoto } from "react-icons/md";

interface Props {
  preview?: string;
  setImage: Dispatch<SetStateAction<TImageUpload>>;
  name?: string;
  id?: string;
  htmlFor?: string;
  alt?: string;
}

function ImageUpload({ preview, setImage, name, id, htmlFor, alt }: Props) {
  return (
    <div className="relative flex justify-center items-center w-full p-4 border border-[#2f3336]">
      <div
        className={`relative h-16 bg-[#3e4144] ${
          alt === "Cover" ? "w-32" : "w-16"
        }`}
      >
        <input
          name={name}
          id={id}
          className="w-full h-full invisible"
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && e.target.files[0]
              ? setImage({
                  preview: URL.createObjectURL(e.target.files[0]),
                  data: e.target.files[0],
                })
              : null
          }
        />
        <label
          className="absolute z-10 inset-0 flex justify-center items-center w-full h-full bg-black/80 cursor-pointer"
          htmlFor={htmlFor}
        >
          <MdOutlineAddAPhoto className="text-base" />
        </label>
        {preview ? (
          <img
            src={preview}
            alt={alt}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
      </div>
    </div>
  );
}

export default ImageUpload;
