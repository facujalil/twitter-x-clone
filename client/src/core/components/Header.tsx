import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";

interface Props {
  title: string;
  showBackButton?: boolean;
}

function Header({ title, showBackButton }: Props) {
  const navigate = useNavigate();

  return (
    <div
      className={`flex items-center w-full h-16 px-4 ${
        title !== "Inicio" ? "gap-2 border-b border-[#2f3336]" : ""
      }`}
    >
      {showBackButton ? (
        <button
          className="h-8 w-8 flex justify-center items-center text-xl rounded-full transition hover:bg-[#181818]"
          onClick={() => navigate(-1)}
        >
          <IoArrowBack />
        </button>
      ) : null}
      <h4 className="overflow-hidden text-[1.3rem] font-bold text-nowrap text-ellipsis">
        {title}
      </h4>
    </div>
  );
}

export default Header;
