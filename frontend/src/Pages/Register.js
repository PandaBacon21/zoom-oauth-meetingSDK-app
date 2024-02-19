import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register({ setToken }) {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordToCheck, setPasswordToCheck] = useState("");

  const registerUser = (event) => {
    if (firstName.length === 0) {
      alert("First Name cannot be left blank!");
    } else if (lastName.length === 0) {
      alert("Last Name cannot be left blank!");
    } else if (email.length === 0) {
      alert("Email cannot be left blank!");
    } else if (password.length === 0) {
      alert("Password cannot be left blank!");
    } else if (password !== passwordToCheck) {
      alert("Passwords must match!");
    } else {
      axios
        .post("/api/register", {
          first_name: firstName,
          last_name: lastName,
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
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setPasswordToCheck("");

      event.preventDefault();
    }
  };

  return (
    <div className="register-card-container">
      <div className="register-card">
        <div className="register-card-row">
          <div className="register-card-content">
            <h1>Register</h1>
            <form className="register-form">
              <div className="input-field">
                <input
                  type="text"
                  id="firstname"
                  value={firstName}
                  placeholder="First Name"
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="input-field">
                <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  placeholder="Last Name"
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
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

              <div className="input-field">
                <input
                  type="password"
                  id="password2"
                  value={passwordToCheck}
                  placeholder="Repeat Password"
                  onChange={(e) => setPasswordToCheck(e.target.value)}
                />
              </div>
              <button type="button" className="btn" onClick={registerUser}>
                Register
              </button>
              <div>
                <Link to="/login">Already Registered? Sign In Here!</Link>
              </div>
            </form>
          </div>
          <div className="register-img-container">
            <img src="zoom_logo.png" className="img-fluid" alt="Zoom Logo" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
