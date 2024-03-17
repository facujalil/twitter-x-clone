import React, { useContext, useEffect, useState } from "react";
import { IPost, ILoggedInUser } from "../types";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import { getPostsFromHome } from "../api/posts.api";
import Header from "../components/Header";
import PostForm from "../components/PostForm";
import Posts from "../components/Posts";

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoginModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRegisterModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function Home() {
  const { loggedInUserData, setLoginModalOpen, setRegisterModalOpen } =
    useContext(Context) as IContext;

  const [postsFromHomeLoading, setPostsFromHomeLoading] = useState(true);
  const [postsFromHome, setPostsFromHome] = useState<IPost[]>([]);

  useEffect(() => {
    document.title = "Inicio / Twitter X";
  }, []);

  useEffect(() => {
    if (loggedInUserData) {
      getPostsFromHome(loggedInUserId)
        .then((data) => setPostsFromHome(data))
        .then(() => setPostsFromHomeLoading(false));
    }
  }, [loggedInUserData]);

  return (
    <div className="w-full h-full">
      <Header title="Inicio" />

      {loggedInUserId ? (
        <PostForm />
      ) : (
        <>
          <h1 className="pt-8 px-8 mb-4 text-[1.75rem] font-bold text-center border-t border-t-[#2f3336]">
            Bienvenido a Twitter X
          </h1>
          <div className="flex justify-center items-center gap-4 px-4 pb-8 border-b border-b-[#2f3336]">
            <button
              className="p-3 font-medium rounded-full bg-[#1d9bf0] transition hover:opacity-90"
              onClick={() => setLoginModalOpen(true)}
            >
              Iniciar sesión
            </button>
            <button
              className="p-3 font-medium rounded-full text-black bg-white transition hover:opacity-90"
              onClick={() => setRegisterModalOpen(true)}
            >
              Registrarse
            </button>
          </div>
        </>
      )}

      {loggedInUserId && (
        <Posts postsLoading={postsFromHomeLoading} posts={postsFromHome} />
      )}
    </div>
  );
}

export default Home;
