import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="/dashboard">
        <img
          src="Zoom-emblem.png"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />
        Zoom SDK Demo App
      </a>
      <button
        type="button"
        className="btn btn-primary btn-lg m-2"
        onClick={handleLogout}
      >
        Logout
      </button>
    </nav>
  );
};

export default NavBar;
