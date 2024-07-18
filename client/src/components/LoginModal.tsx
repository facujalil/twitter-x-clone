import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../context/Context";
import Modal from "./Modal";
import Input from "./Input";
import { loginUser } from "../api/users.api";
import UserForm from "./UserForm";

interface IContext {
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function LoginModal() {
  const navigate = useNavigate();

  const { setLoginModalOpen, setRegisterModalOpen } = useContext(
    Context
  ) as IContext;

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    loginUser(username, password).then((data) =>
      data ? navigate(0) : setLoginError(true)
    );
  };

  return (
    <Modal
      type="login"
      modalTitle="Inicia sesión"
      setModalOpen={setLoginModalOpen}
    >
      <>
        <UserForm
          onSubmit={handleSubmit}
          button={{
            disabled: !username.trim() || !password.trim(),
            value: "Iniciar sesión",
          }}
        >
          <Input
            name="username"
            type="name"
            value={username}
            maxLength={15}
            autoComplete="on"
            placeholder="Nombre de usuario"
            error={loginError}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            name="password"
            type="password"
            value={password}
            maxLength={20}
            autoComplete="on"
            placeholder="Contraseña"
            error={loginError}
            onChange={(e) => setPassword(e.target.value)}
          />
          {loginError && (
            <div>
              <p className="text-[0.95rem] text-[#ff0000] leading-none">
                Usuario y/o contraseña incorrectos
              </p>
            </div>
          )}
        </UserForm>
        <p className="w-full mt-4 text-center text-[#71767b]">
          ¿No tienes una cuenta?{" "}
          <span
            onClick={() => {
              setLoginModalOpen(false);
              setRegisterModalOpen(true);
            }}
            className="text-white hover:underline hover:cursor-pointer"
          >
            Regístrate
          </span>
        </p>
      </>
    </Modal>
  );
}

export default LoginModal;
