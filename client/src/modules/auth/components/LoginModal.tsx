import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "core/context/AppContext";
import { login } from "../api/auth.api";
import Modal from "core/components/Modal";
import UserForm from "core/components/UserForm";
import Input from "core/components/Input";

function LoginModal() {
  const navigate = useNavigate();

  const { setOpenModal } = useAppContext();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState(false);

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(username, password)
      .then(() => navigate(0))
      .catch((error) => {
        console.error(error);
        setLoginError(true);
      });
  };

  return (
    <Modal title="Inicia sesión">
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
