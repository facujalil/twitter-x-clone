interface Props {
  extraClasses?: string;
}

function LoadingSpinner({ extraClasses }: Props) {
  return (
    <div className={`flex justify-center items-center ${extraClasses || ""}`}>
      <div className="w-6 h-6 rounded-full bg-transparent border-[3px] border-[#061f30] border-t-[#1d9bf0] animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;
