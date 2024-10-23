import { FormEventHandler, ReactNode } from "react";

interface Props {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
  button: {
    disabled: boolean;
    value: string;
  };
}

function UserForm({ onSubmit, children, button }: Props) {
  return (
    <form
      className="flex flex-col justify-center items-center"
      onSubmit={onSubmit}
    >
      <div className="flex flex-col gap-2 w-full my-12">{children}</div>
      <button
        disabled={button.disabled}
        className="p-4 bg-white rounded-full text-black font-medium w-full transition hover:opacity-90 disabled:opacity-50"
      >
        {button.value}
      </button>
    </form>
  );
}

export default UserForm;
