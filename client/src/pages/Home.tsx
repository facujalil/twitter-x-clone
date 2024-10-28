import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { useModalContext } from "core/context/ModalContext";
import { getHomePosts } from "modules/posts/api/posts.api";
import { setPosts } from "core/store/postsSlice";
import Header from "core/components/Header";
import PostForm from "modules/posts/components/PostForm";
import Posts from "modules/posts/components/Posts";

function Home() {
  const dispatch = useDispatch();

  const authUser = useSelector((state: RootState) => state.users.authUser);
  const posts = useSelector((state: RootState) => state.posts.posts);

  const { setOpenModal } = useModalContext();

  const [homePostsLoading, setHomePostsLoading] = useState(true);

  useEffect(() => {
    document.title = "Inicio / Twitter X";
  }, []);

  useEffect(() => {
    if (authUser) {
      getHomePosts(authUser.user_id)
        .then((data) => dispatch(setPosts(data)))
        .catch((error) => console.error(error))
        .finally(() => setHomePostsLoading(false));
    }
  }, [authUser?.following]);

  return (
    <div className="w-full h-full">
      <Header title="Inicio" />
      {authUser ? (
        <>
          <PostForm view="post" />
          <Posts postsLoading={homePostsLoading} posts={posts} />
        </>
      ) : (
        <>
          <h1 className="pt-8 px-8 mb-4 text-[1.75rem] font-bold text-center border-t border-t-[#2f3336]">
            Bienvenido a Twitter X
          </h1>
          <div className="flex justify-center items-center gap-4 px-4 pb-8 border-b border-b-[#2f3336]">
            <button
              className="p-3 font-medium rounded-full bg-[#1d9bf0] transition hover:opacity-90"
              onClick={() => setOpenModal("login")}
            >
              Iniciar sesión
            </button>
            <button
              className="p-3 font-medium rounded-full text-black bg-white transition hover:opacity-90"
              onClick={() => setOpenModal("sign up")}
            >
              Registrarse
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
