import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAppContext } from "core/context/AppContext";
import { signUp } from "../api/auth.api";
import Modal from "core/components/Modal";
import UserForm from "core/components/UserForm";
import Input from "core/components/Input";

function SignUpModal() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { setOpenModal } = useAppContext();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSignUp = () => {
    signUp(email, displayName, username, password)
      .then(() => setOpenModal("login"))
      .catch((error) => {
        console.error(error);
        if (error.message === "Email is already used.") {
          setError("email", {
            message: "Ese correo electrónico ya está siendo utilizado",
          });
        } else if (error.message === "Username already exists.") {
          setError("username", {
            message: "Este nombre de usuario ya está en uso",
          });
        }
      });
  };

  return (
    <Modal title="Crea tu cuenta">
      <UserForm
        onSubmit={handleSubmit(handleSignUp)}
        button={{
          disabled: !(
            email.trim() &&
            displayName.trim() &&
            username.trim() &&
            password.trim()
          ),
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
          autoFocus
          placeholder="Email"
          error={errors.email !== undefined}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email?.message ? (
          <div>
            <p className="text-[0.95rem] text-[#ff0000] leading-none">
              {errors.email.message.toString()}
            </p>
          </div>
        ) : null}
        <Input
          register={{
            ...register("displayName"),
          }}
          name="displayName"
          type="name"
          value={displayName}
          maxLength={50}
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
          placeholder="Nombre de usuario"
          error={errors.username !== undefined}
          onChange={(e) => setUsername(e.target.value)}
        />
        {errors.username?.message ? (
          <div>
            <p className="text-[0.95rem] text-[#ff0000] leading-none">
              {errors.username.message.toString()}
            </p>
          </div>
        ) : null}
        <Input
          register={{
            ...register("password"),
          }}
          name="password"
          type="password"
          value={password}
          maxLength={20}
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
        />
      </UserForm>
      <p className="w-full mt-4 text-center text-[#71767b]">
        ¿Ya tienes una cuenta?{" "}
        <span
          className="text-white hover:underline hover:cursor-pointer"
          onClick={() => setOpenModal("login")}
        >
          Iniciar sesión
        </span>
      </p>
    </Modal>
  );
}

export default SignUpModal;
