import Modal from "core/components/Modal";
import PostForm from "./PostForm";

function PostModal() {
  return (
    <Modal>
      <PostForm view="modal" autoFocus />
    </Modal>
  );
}

export default PostModal;
