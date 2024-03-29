interface Props {
  style: {
    paddingTop?: string;
    height?: string;
    minHeight?: string;
  };
}

function LoadingSpinner({ style }: Props) {
  return (
    <div className="flex justify-center items-center" style={style}>
      <div className="w-6 h-6 rounded-full bg-transparent border-[3px] border-[#061f30] border-t-[#1d9bf0] animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;
