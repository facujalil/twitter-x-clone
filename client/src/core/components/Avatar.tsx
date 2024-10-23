interface Props {
  src?: string;
  size?: "large" | "medium" | "small";
  extraClasses?: string;
  hover?: boolean;
}

function Avatar({ src, size, extraClasses, hover }: Props) {
  return (
    <img
      src={src || "/img/default-avatar.jpg"}
      alt="Avatar"
      className={`object-cover bg-[#3e4144] rounded-full ${
        size === "large"
          ? "md:h-[6.5rem] md:w-[6.5rem] h-32 w-32"
          : size === "medium"
          ? "w-10 h-10"
          : "w-[2.65rem] h-[2.65rem]"
      } ${extraClasses || ""} ${hover ? "transition hover:opacity-90" : ""}`}
    />
  );
}

export default Avatar;
