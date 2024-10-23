import { ReactNode, useEffect, useRef } from "react";
import { useAppContext } from "core/context/AppContext";
import { IoMdClose } from "react-icons/io";

interface Props {
  title?: string;
  children: ReactNode;
}

function Modal({ title, children }: Props) {
  const { openModal, closeModal } = useAppContext();

  const modalRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.body.style.overflowY = "hidden";
  }, []);

  return (
    <div
      ref={modalRef}
      className={`sm:py-0 z-30 fixed inset-0 flex justify-center min-h-screen w-screen py-8 bg-white/25 ${
        openModal === "post" ? "items-start" : "items-center"
      }`}
      onClick={closeModal}
    >
      <div
        className={`overflow-y-auto overflow-x-hidden flex flex-col w-11/12 max-w-[38rem] max-h-full bg-black ${
          openModal === "post" ? "rounded-3xl" : "p-10 rounded-lg"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`w-full flex items-center ${
            openModal === "post" ? "justify-end" : "justify-between"
          }`}
        >
          {title ? (
            <h4 className="overflow-hidden text-xl font-bold text-nowrap text-ellipsis">
              {title}
            </h4>
          ) : null}
          <button
            className={`flex justify-center items-center bg-transparent border-none ${
              openModal === "post" ? "mt-4 mr-4" : ""
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
