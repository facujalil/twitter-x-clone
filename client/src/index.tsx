import ReactDOM from "react-dom/client";
import "index.css";
import { Provider } from "react-redux";
import store from "core/store/store";
import { BrowserRouter } from "react-router-dom";
import { ModalProvider } from "core/context/ModalContext";
import App from "App";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <ModalProvider>
        <App />
      </ModalProvider>
    </BrowserRouter>
  </Provider>
);
