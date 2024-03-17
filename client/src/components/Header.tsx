import { IoArrowBack } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

interface Props {
  title: string;
}

function Header({ title }: Props) {
  const navigate = useNavigate();
  return (
    <div
      className={`flex items-center h-16 px-4 ${
        title !== "Inicio" &&
        "flex items-center gap-2 w-full border-b border-[#2f3336]"
      }`}
    >
      {title !== "Inicio" && title !== "Notificaciones" && (
        <button
          className="h-8 w-8 flex justify-center items-center text-xl bg-transparent rounded-full transition hover:bg-[#181818]"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack />
        </button>
      )}
      <h4 className="overflow-hidden text-[1.3rem] font-bold text-ellipsis whitespace-nowrap">
        {title}
      </h4>
    </div>
  );
}

export default Header;
