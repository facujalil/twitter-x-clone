import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "core/store/store";
import { INotification } from "modules/users/types/userTypes";
import {
  getNotifications,
  markNotificationsAsRead,
} from "modules/users/api/users.api";
import { resetUnreadNotifications } from "core/store/usersSlice";
import Header from "core/components/Header";
import LoadingSpinner from "core/components/LoadingSpinner";
import Notification from "./Notification";

function Notifications() {
  const dispatch = useDispatch();

  const { authUserId, authUser } = useSelector(
    (state: RootState) => state.users
  );

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    if (authUserId)
      getNotifications(authUserId)
        .then((data) => setNotifications(data))
        .catch((error) => console.error(error))
        .finally(() => setNotificationsLoading(false));
  }, [authUserId]);

  useEffect(() => {
    document.title = "Notificaciones / Twitter X";
    if (authUserId && authUser && authUser.unread_notifications > 0) {
      markNotificationsAsRead(authUserId)
        .then(() => dispatch(resetUnreadNotifications()))
        .catch((error) => console.error(error));
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Header title="Notificaciones" />
      {notificationsLoading ? (
        <LoadingSpinner extraClasses="pt-8" />
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <Notification
            key={notification.notification_id}
            notification={notification}
          />
        ))
      ) : (
        <p className="w-full p-6 text-wrap text-center text-[#71767b]">
          No tienes notificaciones
        </p>
      )}
    </div>
  );
}

export default Notifications;
