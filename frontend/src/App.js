import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import useToken from "./Pages/Utilities/UseToken";
import ZoomRedirect from "./Pages/ZoomRedirect";

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login setToken={setToken} />} />
      <Route path="/register" element={<Register setToken={setToken} />} />
      <Route
        path="/dashboard"
        element={
          <Dashboard
            token={token}
            setToken={setToken}
            removeToken={removeToken}
          />
        }
      />
      <Route
        path="/dashboard/zoom-redirect"
        element={<ZoomRedirect token={token} />}
      />
    </Routes>
  );
}

export default App;
