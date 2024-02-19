import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import useToken from "./Pages/Utilities/UseToken";
import ZoomRedirect from "./Pages/ZoomRedirect";
import PrivateRoutes from "./Pages/Utilities/PrivateRoutes";
import "./App.css";

function App() {
  const { token, removeToken, setToken } = useToken();

  return (
    <div className="App">
      <Routes>
        <Route
          path="/"
          element={<Home token={token} removeToken={removeToken} />}
        />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/register" element={<Register setToken={setToken} />} />
        {/* Protected Routes. Must be Authenticated */}
        <Route element={<PrivateRoutes token={token} />}>
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
        </Route>
      </Routes>
    </div>
  );
}

export default App;
