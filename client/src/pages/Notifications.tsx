import React, { useContext, useEffect, useState } from "react";
import { INotification, ILoggedInUser } from "../types";
import { Context } from "../context/Context";
import { loggedInUserId } from "../utils/localStorage";
import {
  clearNotifications,
  getUserData,
  getNotifications,
} from "../api/users.api";
import Header from "../components/Header";
import Notification from "../components/Notification";
import LoadingSpinner from "../components/LoadingSpinner";

interface IContext {
  loggedInUserData: ILoggedInUser;
  setLoggedInUserData: React.Dispatch<React.SetStateAction<ILoggedInUser>>;
}

function Notifications() {
  const { loggedInUserData, setLoggedInUserData } = useContext(
    Context
  ) as IContext;

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [notificationsLoading, setNotificationsLoading] = useState(true);

  useEffect(() => {
    document.title = "Notificaciones / Twitter X";
  }, []);

  useEffect(() => {
    getUserData(loggedInUserId);
    getNotifications(loggedInUserId)
      .then((data) => setNotifications(data))
      .then(() => setNotificationsLoading(false));
  }, []);

  useEffect(() => {
    if (loggedInUserData.unread_notifications > 0) {
      clearNotifications(loggedInUserId).then(() =>
        getUserData(loggedInUserId).then((data) => setLoggedInUserData(data))
      );
    }
  }, []);

  return (
    <div className="flex flex-col justify-center items-center w-full h-full">
      <Header title="Notificaciones" />
      {notificationsLoading ? (
        <LoadingSpinner style={{ paddingTop: "2rem" }} />
      ) : notifications.length > 0 ? (
        notifications.map((notification) => (
          <React.Fragment key={notification.notification_id}>
            <Notification notification={notification} />
          </React.Fragment>
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
