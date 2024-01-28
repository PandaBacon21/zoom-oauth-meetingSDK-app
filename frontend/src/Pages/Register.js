import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = (props) => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordToCheck, setPasswordToCheck] = useState("");

  function registerUser(event) {
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
          props.setToken(response.data.access_token);
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
  }

  return (
    <div className="vh-100" style={{ backgroundColor: "#eee" }}>
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <p className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Register
                    </p>

                    <form className="mx-1 mx-md-4">
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="firstname"
                            className="form-control"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                          <label className="form-label" htmlFor="firstname">
                            First Name
                          </label>
                        </div>
                      </div>
                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-user fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="text"
                            id="lastname"
                            className="form-control"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                          <label className="form-label" htmlFor="lastname">
                            Last Name
                          </label>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-envelope fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="email"
                            id="email"
                            className="form-control"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                          />
                          <label className="form-label" htmlFor="email">
                            Your Email
                          </label>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-lock fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                          />
                          <label className="form-label" htmlFor="password">
                            Password
                          </label>
                        </div>
                      </div>

                      <div className="d-flex flex-row align-items-center mb-4">
                        <i className="fas fa-key fa-lg me-3 fa-fw"></i>
                        <div className="form-outline flex-fill mb-0">
                          <input
                            type="password"
                            id="password2"
                            className="form-control"
                            value={passwordToCheck}
                            onChange={(e) => setPasswordToCheck(e.target.value)}
                          />
                          <label className="form-label" htmlFor="password2">
                            Repeat password
                          </label>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                        <button
                          type="button"
                          className="btn btn-primary btn-lg"
                          onClick={registerUser}
                        >
                          Register
                        </button>
                      </div>
                      <div>
                        <Link to="/login">
                          Already Registered? Sign In Here!
                        </Link>
                      </div>
                    </form>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="logo512.png" className="img-fluid" alt="..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
