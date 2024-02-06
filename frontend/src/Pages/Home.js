import React from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "./Utilities/NavBar";

function Home({ token, removeToken }) {
  const navigate = useNavigate();

  return (
    <div className="vh-100" style={{ backgroundColor: "#eee" }}>
      {token ? <NavBar removeToken={removeToken} /> : null}
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col-lg-12 col-xl-11">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1">
                    <h1 className="text-center h1 fw-bold mb-5 mx-1 mx-md-4 mt-4">
                      Welcome!
                    </h1>
                    <p>
                      Please login or register below to begin using the Zoom Web
                      SDK.
                    </p>
                    <br />
                    <br />
                    <div className="d-flex justify-content-center mx-4 mb-3 mb-lg-4">
                      <button
                        onClick={() => navigate("/login")}
                        className="btn btn-primary m-2"
                      >
                        Login
                      </button>
                      <button
                        onClick={() => navigate("/register")}
                        className="btn btn-primary m-2"
                      >
                        Register
                      </button>
                    </div>
                  </div>
                  <div className="col-md-10 col-lg-6 col-xl-7 d-flex align-items-center order-1 order-lg-2">
                    <img src="zoom_logo.png" className="img-fluid" alt="..." />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
