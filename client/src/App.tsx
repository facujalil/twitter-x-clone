import { Navigate, Route, Routes } from "react-router-dom";
import { authUserId } from "core/utils/localStorage";
import AppLayout from "core/layout/AppLayout";
import Home from "pages/Home";
import PostDetail from "pages/PostDetail";
import Profile from "pages/Profile/Profile";
import Notifications from "pages/Notifications/Notifications";

function App() {
  return (
    <div className="md:gap-0 md:max-w-[100%] flex justify-center items-start gap-8 max-w-[90%] h-full min-h-screen m-auto">
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:postId" element={<PostDetail />} />
          <Route path="/users/:userId" element={<Profile />} />
          <Route
            path="/notifications"
            element={authUserId ? <Notifications /> : <Navigate to="/" />}
          />
          <Route path="/*" element={<Navigate to="/" />} />
        </Routes>
      </AppLayout>
    </div>
  );
}

export default App;
