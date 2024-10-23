import ReactDOM from "react-dom/client";
import "index.css";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "core/context/AppContext";
import App from "App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <BrowserRouter>
    <AppProvider>
      <App />
    </AppProvider>
  </BrowserRouter>
);
