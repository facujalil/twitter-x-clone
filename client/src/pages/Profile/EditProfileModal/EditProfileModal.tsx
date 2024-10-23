import { useState } from "react";
import { IUserProfile, TImageUpload } from "modules/users/types/userTypes";
import { useForm } from "react-hook-form";
import { useAppContext } from "core/context/AppContext";
import { authUserId } from "core/utils/localStorage";
import { editProfile, getAuthUser } from "modules/users/api/users.api";
import Modal from "core/components/Modal";
import UserForm from "core/components/UserForm";
import ImageUpload from "./ImageUpload";
import Input from "core/components/Input";

interface Props {
  userProfile: IUserProfile;
}

function EditProfileModal({ userProfile }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const { setAuthUser, closeModal } = useAppContext();

  const [cover, setCover] = useState<TImageUpload>({
    preview: userProfile.cover,
    data: null,
  });
  const [avatar, setAvatar] = useState<TImageUpload>({
    preview: userProfile.avatar || "/img/default-avatar.jpg",
    data: null,
  });
  const [displayName, setDisplayName] = useState(userProfile.display_name);
  const [username, setUsername] = useState(userProfile.username);
  const [biography, setBiography] = useState(userProfile.biography || "");

  const handleEditProfile = async () => {
    const form = new FormData();
    if (cover.data) {
      form.append("previousCoverFile", userProfile.cover);
      form.append("files", cover.data, "cover-file");
    }
    if (avatar.data) {
      form.append("previousAvatarFile", userProfile.avatar);
      form.append("files", avatar.data, "avatar-file");
    }
    form.append("displayName", displayName);
    form.append("previousUsername", userProfile.username);
    form.append("username", username);
    form.append("biography", biography);
    if (authUserId) {
      editProfile(authUserId, form)
        .then(() => {
          getAuthUser(authUserId!).then((data) => setAuthUser(data));
          closeModal();
        })
        .catch((error) => {
          console.error(error);
          if (error.message === "Username already exists.") {
            setError("username", {
              message: "Este nombre de usuario ya está en uso",
            });
          }
        });
    }
  };

  return (
    <Modal title="Editar perfil">
      <UserForm
        onSubmit={handleSubmit(handleEditProfile)}
        button={{
          disabled: !(displayName.trim() && username.trim()),
          value: "Guardar",
        }}
      >
        <ImageUpload
          preview={cover.preview}
          setImage={setCover}
          name="cover-file"
          id="cover-file"
          htmlFor="cover-file"
          alt="Cover"
        />

        <ImageUpload
          preview={avatar.preview}
          setImage={setAvatar}
          name="avatar-file"
          id="avatar-file"
          htmlFor="avatar-file"
          alt="Avatar"
        />
        <Input
          register={{
            ...register("displayName"),
          }}
          name="displayName"
          type="name"
          value={displayName}
          maxLength={50}
          autoComplete="off"
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
          autoComplete="off"
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
            ...register("biography"),
          }}
          name="biography"
          type="text"
          value={biography}
          maxLength={160}
          autoComplete="off"
          placeholder="Biografía"
          onChange={(e) => setBiography(e.target.value)}
        />
      </UserForm>
    </Modal>
  );
}

export default EditProfileModal;
