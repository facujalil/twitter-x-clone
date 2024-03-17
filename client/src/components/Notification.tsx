import { INotification } from "../types";
import { NavLink } from "react-router-dom";

interface Props {
  notification: INotification;
}

function Notification({ notification }: Props) {
  return (
    <NavLink
      to={
        notification.type === "follow"
          ? `/users/${notification.from_user_id}`
          : `/posts/${notification.post_id}`
      }
      className="flex justify-center w-full p-6 border-b border-[#2f3336] transition cursor-pointer hover:bg-[#080808]"
    >
      {notification.type === "follow"
        ? `El usuario @${notification.from_username} te siguió`
        : notification.type === "like"
        ? `El usuario @${notification.from_username} indicó que le gusta tu post`
        : notification.type === "comment" &&
          `El usuario @${notification.from_username} comentó tu post`}
    </NavLink>
  );
}

export default Notification;
