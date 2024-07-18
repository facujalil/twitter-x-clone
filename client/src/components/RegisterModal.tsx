import React, { useContext, useState } from "react";
import { Context } from "../context/Context";
import { useForm } from "react-hook-form";
import Modal from "./Modal";
import Input from "./Input";
import { registerUser } from "../api/users.api";
import UserForm from "./UserForm";

interface IContext {
  setRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function RegisterModal() {
  const { setRegisterModalOpen, setLoginModalOpen } = useContext(
    Context
  ) as IContext;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const goToLogin = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  const handleRegister = () => {
    registerUser(email, displayName, username, password).then((data) =>
      data.message === "registered user!"
        ? goToLogin()
        : data.message === "email is already used"
        ? setError("email", {
            message: "Ese correo electrónico ya está siendo utilizado",
          })
        : data.message === "username already exists" &&
          setError("username", {
            message: "Este nombre de usuario ya está en uso",
          })
    );
  };

  return (
    <Modal
      type="register"
      modalTitle="Crea tu cuenta"
      setModalOpen={setRegisterModalOpen}
    >
      <>
        <UserForm
          onSubmit={handleSubmit(handleRegister)}
          button={{
            disabled:
              !email.trim() ||
              !displayName.trim() ||
              !username.trim() ||
              !password.trim(),
            value: "Registrarse",
          }}
        >
          <Input
            register={{
              ...register("email", {
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Introduce un correo electrónico válido",
                },
              }),
            }}
            name="email"
            datatype="email"
            value={email}
            maxLength={254}
            autoComplete="on"
            placeholder="Email"
            error={errors && errors.email !== undefined}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors && errors.email && (
            <div>
              <p className="text-[0.95rem] text-[#ff0000] leading-none">
                {errors.email.message && errors.email.message.toString()}
              </p>
            </div>
          )}
          <Input
            register={{
              ...register("displayName"),
            }}
            name="displayName"
            type="name"
            value={displayName}
            maxLength={50}
            autoComplete="on"
            placeholder="Nombre"
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <Input
            register={{
              ...register("username", {
                pattern: {
                  value: /^[a-zA-Z0-9_.-]*$/,
                  message:
                    "Tu nombre de usuario solo puede tener letras, números y '_'",
                },
              }),
            }}
            name="username"
            type="name"
            value={username}
            maxLength={15}
            autoComplete="on"
            placeholder="Nombre de usuario"
            error={errors.username !== undefined}
            onChange={(e) => setUsername(e.target.value)}
          />
          {errors.username && (
            <div>
              <p className="text-[0.95rem] text-[#ff0000] leading-none">
                {errors.username.message && errors.username.message.toString()}
              </p>
            </div>
          )}
          <Input
            register={{
              ...register("password"),
            }}
            name="password"
            type="password"
            value={password}
            maxLength={20}
            autoComplete="on"
            placeholder="Contraseña"
            onChange={(e) => setPassword(e.target.value)}
          />
        </UserForm>
        <p className="w-full mt-4 text-center text-[#71767b]">
          ¿Ya tienes una cuenta?{" "}
          <span
            className="text-white hover:underline hover:cursor-pointer"
            onClick={goToLogin}
          >
            Iniciar sesión
          </span>
        </p>
      </>
    </Modal>
  );
}

export default RegisterModal;
