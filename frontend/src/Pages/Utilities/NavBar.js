import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./NavBar.css";

const NavBar = (props) => {
  const navigate = useNavigate();

  function handleLogout() {
    props.removeToken();
    axios
      .post("/api/logout")
      .then((response) => {
        console.log(response.data);
        navigate("/");
      })
      .catch((error) => {
        console.log(error.response);
        console.log(error.response.status);
        console.log(error.response.headers);
      });
  }

  return (
    <nav className="nav-bar">
      <a href="/dashboard">
        <img src="Zoom-emblem.png" alt="Zoom Camera" />
      </a>
      <button type="button" className="btn" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
