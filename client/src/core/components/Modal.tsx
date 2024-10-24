import { ReactNode, useEffect, useRef } from "react";
import { useModalContext } from "core/context/ModalContext";
import { IoMdClose } from "react-icons/io";
import LoadingSpinner from "./LoadingSpinner";

interface Props {
  title?: string;
  loading?: boolean;
  children: ReactNode;
}

function Modal({ title, loading, children }: Props) {
  const { openModal, closeModal } = useModalContext();

  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    document.body.style.overflowY = "hidden";
  }, []);

  useEffect(() => {
    if (loading && modalRef.current) {
      modalRef.current.scrollTop = 0;
    }
  }, [loading]);

  return (
    <div
      className={`sm:py-0 z-30 fixed inset-0 flex justify-center min-h-screen w-screen py-8 bg-white/25 ${
        openModal === "post" ? "items-start" : "items-center"
      }`}
      onClick={closeModal}
    >
      <div
        ref={modalRef}
        className={`${
          loading ? "relative overflow-y-hidden" : "overflow-y-auto"
        } overflow-x-hidden flex flex-col w-11/12 max-w-[38rem] max-h-full bg-black ${
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
            className={`flex justify-center items-center ${
              openModal === "post" ? "mt-4 mr-4" : ""
            }`}
            onClick={closeModal}
          >
            <IoMdClose className="text-2xl" />
          </button>
        </div>
        {loading ? (
          <LoadingSpinner extraClasses="absolute z-20 inset-0 bg-black" />
        ) : null}
        {children}
      </div>
    </div>
  );
}

export default Modal;
