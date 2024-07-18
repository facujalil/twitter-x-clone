import React, { PropsWithChildren, useEffect, useRef } from "react";
import { IoMdClose } from "react-icons/io";

interface Props extends PropsWithChildren {
  type: string;
  modalTitle?: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Modal({ type, modalTitle, setModalOpen, children }: Props) {
  const modalRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    document.body.style.overflowY = "hidden";
  }, []);

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflowY = "visible";
  };

  return (
    <div
      ref={modalRef}
      className={`sm:py-0 z-30 fixed inset-0 flex justify-center min-h-screen w-screen py-8 bg-white/25 ${
        type === "post" ? "items-start" : "items-center"
      }`}
      onClick={closeModal}
    >
      <div
        className={`overflow-y-auto overflow-x-hidden flex flex-col w-11/12 max-w-[38rem] max-h-full min-h-fit bg-black ${
          type === "post" ? "rounded-3xl" : "p-10 rounded-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-full flex items-center ${
            type === "post" ? "justify-end" : "justify-between"
          }`}
        >
          {modalTitle && (
            <h4 className="overflow-hidden text-xl font-bold text-ellipsis whitespace-nowrap">
              {modalTitle}
            </h4>
          )}
          <button
            className={`flex justify-center items-center bg-transparent border-none ${
              type === "post" && "mt-4 mr-4"
            }`}
            onClick={closeModal}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default Modal;
