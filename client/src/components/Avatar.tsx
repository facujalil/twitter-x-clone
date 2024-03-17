interface Props {
  src?: string;
  size: string;
  isLargue?: boolean;
  hover?: boolean;
}

function Avatar({ src, size, isLargue, hover }: Props) {
  return (
    <img
      src={src || "/img/profile-picture-default.jpg"}
      alt="Avatar"
      className={`object-cover bg-[#3e4144] rounded-full ${size}
          ${
            isLargue
              ? "md:mt-[-3.25rem] mt-[-4rem] border-4 border-black"
              : hover && "transition hover:opacity-90"
          }`}
    />
  );
}

export default Avatar;
