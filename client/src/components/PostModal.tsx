import React from "react";
import Modal from "./Modal";
import PostForm from "./PostForm";

interface Props {
  postModalOpen: boolean;
  setPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

function PostModal({ postModalOpen, setPostModalOpen }: Props) {
  return (
    <Modal type="post" setModalOpen={setPostModalOpen}>
      <PostForm
        postModalOpen={postModalOpen}
        setPostModalOpen={setPostModalOpen}
      />
    </Modal>
  );
}

export default PostModal;
