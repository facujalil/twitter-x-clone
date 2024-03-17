import React, { useContext, useEffect, useState } from "react";
import { ILoggedInUser, IUserProfile, TImageUpload } from "../types";
import { Context } from "../context/Context";
import { useForm } from "react-hook-form";
import { loggedInUserId } from "../utils/localStorage";
import { editProfile, getUserData } from "../api/users.api";
import Modal from "./Modal";
import ImageUpload from "./ImageUpload";
import Input from "./Input";
import UserForm from "./UserForm";

interface Props {
  userProfileData: IUserProfile;
  setModalEditOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

interface IContext {
  setLoggedInUserData: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
}

function EditProfileModal({ userProfileData, setModalEditOpen }: Props) {
  const { setLoggedInUserData } = useContext(Context) as IContext;

  useEffect(() => {
    setCoverPicture({ preview: userProfileData.cover_picture, data: null });
    setProfilePicture({
      preview:
        userProfileData.profile_picture || "/img/profile-picture-default.jpg",
      data: null,
    });
    setDisplayName(userProfileData.display_name);
    setUsername(userProfileData.username);
    setBiography(userProfileData.biography ? userProfileData.biography : "");
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const [coverPicture, setCoverPicture] = useState<TImageUpload | undefined>();
  const [profilePicture, setProfilePicture] = useState<
    TImageUpload | undefined
  >();
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [biography, setBiography] = useState("");

  const closeModalEdit = () => {
    setModalEditOpen(false);
    document.body.style.overflowY = "visible";
  };

  const handleEditProfile = async () => {
    const formData = new FormData();
    if (coverPicture && coverPicture.data) {
      formData.append(
        "previousCoverPictureFile",
        userProfileData.cover_picture
      );
      formData.append("files", coverPicture.data, "cover-picture-file");
    }
    if (profilePicture && profilePicture.data) {
      formData.append(
        "previousProfilePictureFile",
        userProfileData.profile_picture
      );
      formData.append("files", profilePicture.data, "profile-picture-file");
    }
    formData.append("displayName", displayName);
    formData.append("previousUsername", userProfileData.username);
    formData.append("username", username);
    formData.append("biography", biography);
    editProfile(loggedInUserId, formData)
      .then((data) =>
        data.message === "changes saved!"
          ? closeModalEdit()
          : data.message === "username already exists" &&
            setError("username", {
              message: "Este nombre de usuario ya está en uso",
            })
      )
      .then(() =>
        getUserData(loggedInUserId).then((data) => setLoggedInUserData(data))
      );
  };

  return (
    <Modal
      type="edit-profile"
      modalTitle="Editar perfil"
      setModalOpen={setModalEditOpen}
    >
      <UserForm
        onSubmit={handleSubmit(handleEditProfile)}
        button={{
          disabled: !displayName.trim() || !username.trim(),
          value: "Guardar",
        }}
      >
        <ImageUpload
          image={coverPicture}
          setImage={setCoverPicture}
          name="cover-picture-file"
          id="cover-picture-file"
          htmlFor="cover-picture-file"
          alt="Banner"
        />

        <ImageUpload
          image={profilePicture}
          setImage={setProfilePicture}
          name="profile-picture-file"
          id="profile-picture-file"
          htmlFor="profile-picture-file"
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
        {errors.username && (
          <div>
            <p className="text-[0.95rem] text-[#ff0000] leading-none">
              {errors.username.message && errors.username.message.toString()}
            </p>
          </div>
        )}
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
