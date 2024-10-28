import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { useDispatch } from "react-redux";
import { useModalContext } from "core/context/ModalContext";
import { setToken } from "core/store/usersSlice";
import { login } from "../api/auth.api";
import Modal from "core/components/Modal";
import UserForm from "core/components/UserForm";
import Input from "core/components/Input";

interface Props {
  setAppLoading: Dispatch<SetStateAction<boolean>>;
}

function LoginModal({ setAppLoading }: Props) {
  const dispatch = useDispatch();

  const { setOpenModal, closeModal } = useModalContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);
  const [loggingIn, setLoggingIn] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoggingIn(true);

    login(username, password)
      .then((data) => {
        setAppLoading(true);
        dispatch(setToken(data.token));
        closeModal();
      })
      .catch((error) => {
        console.error(error);
        setLoginError(true);
        setLoggingIn(false);
      });
  };

  return (
    <Modal title="Inicia sesión" loading={loggingIn}>
      <UserForm
        onSubmit={handleLogin}
        button={{
          disabled: !(username.trim() && password.trim()),
          value: "Iniciar sesión",
        }}
      >
        <Input
          name="username"
          type="name"
          value={username}
          maxLength={15}
          autoFocus
          placeholder="Nombre de usuario"
          error={loginError}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          name="password"
          type="password"
          value={password}
          maxLength={20}
          placeholder="Contraseña"
          error={loginError}
          onChange={(e) => setPassword(e.target.value)}
        />
        {loginError ? (
          <div>
            <p className="text-[0.95rem] text-[#ff0000] leading-none">
              Usuario y/o contraseña incorrectos
            </p>
          </div>
        ) : null}
      </UserForm>
      <p className="w-full mt-4 text-center text-[#71767b]">
        ¿No tienes una cuenta?{" "}
        <span
          onClick={() => setOpenModal("sign up")}
          className="text-white hover:underline hover:cursor-pointer"
        >
          Regístrate
        </span>
      </p>
    </Modal>
  );
}

export default LoginModal;
