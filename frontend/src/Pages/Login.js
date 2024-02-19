import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

function Login({ setToken }) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const logInUser = (event) => {
    if (email.length === 0) {
      alert("Email cannot be left blank!");
    } else if (password.length === 0) {
      alert("Password cannot be left blank!");
    } else {
      axios
        .post("/api/token", {
          email: email,
          password: password,
        })
        .then((response) => {
          setToken(response.data.access_token);
          if (response.status === 200) {
            navigate("/dashboard");
          }
        })
        .catch((error) => {
          if (error.response) {
            alert(error.response.data["msg"]);
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
        });

      setEmail("");
      setPassword("");

      event.preventDefault();
    }
  };

  return (
    <div className="login-card-container">
      <div className="login-card">
        <div className="login-card-row">
          <div className="login-card-content">
            <h1>Sign In</h1>
            <form className="login-form">
              <div className="input-field">
                <input
                  type="email"
                  id="email"
                  value={email}
                  placeholder="Email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-field">
                <input
                  type="password"
                  id="password"
                  value={password}
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="button" className="btn" onClick={logInUser}>
                Sign In
              </button>
              <div className="register-link">
                <Link to="/register">Not Registered? Sign Up Here!</Link>
              </div>
            </form>
          </div>
          <div className="login-img-container">
            <img src="zoom_logo.png" alt="Zoom Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
