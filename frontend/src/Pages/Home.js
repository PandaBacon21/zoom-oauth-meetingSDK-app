import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Utilities/NavBar";
import "./Home.css";

function Home({ token, removeToken }) {
  const navigate = useNavigate();

  return (
    <>
      {token ? <NavBar removeToken={removeToken} /> : null}
      <div className="home-card-container">
        <div className="home-card">
          <div className="home-card-row">
            <div className="home-card-content">
              <h1>Welcome!</h1>
              <p>
                Please login or register below to begin using the Zoom Web SDK.
              </p>
              <button onClick={() => navigate("/login")} className="btn">
                Login
              </button>
              <button onClick={() => navigate("/register")} className="btn">
                Register
              </button>
            </div>
            <div className="home-img-container">
              <img src="zoom_logo.png" alt="Zoom Logo" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
