import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./Utilities/NavBar";
import ZoomInfo from "./Utilities/ZoomInfo";

const Dashboard = ({ token, setToken, removeToken }) => {
  const navigate = useNavigate();

  const [userData, setUserData] = useState("");
  const [zoomAuthURL, setZoomAuthURL] = useState("");

  useEffect(() => {
    let ignore = false;

    function getUserData() {
      axios({
        method: "GET",
        url: "/api/dashboard",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          const res = response.data;
          res.access_token && setToken(res.access_token);
          setUserData({
            first_name: res.first_name,
            last_name: res.last_name,
            email: res.email,
            zoom_authorized: res.zoom_auth,
          });
          if ("zoom_auth_url" in res) {
            setZoomAuthURL(res.zoom_auth_url);
          }
        })
        .catch((error) => {
          if (error.response) {
            console.log(error.response);
            console.log(error.response.status);
            console.log(error.response.headers);
          }
          if (error.response.data["msg"] === "Token has expired") {
            navigate("/login");
          }
        });
    }
    if (!ignore) getUserData();
    return () => {
      ignore = true;
    };
  }, [token, setToken, navigate]);

  return (
    <div className="vh-100" style={{ backgroundColor: "#eee" }}>
      <NavBar removeToken={removeToken} />
      <div className="container h-100">
        <div className="row d-flex justify-content-center align-items-center h-50">
          <div className="col-md-8 col-md-8">
            <div className="card text-black" style={{ borderRadius: "25px" }}>
              <div className="card-body p-md-5">
                <div className="row justify-content-center">
                  <div className="col-md-10 col-lg-6 col-xl-5 order-2 order-lg-1 text-center">
                    <h1>Dashboard</h1>
                    <h2>
                      Name: {userData.first_name} {userData.last_name}
                    </h2>
                    <p>Email: {userData.email}</p>
                    <p>
                      Has Authorized Zoom:{" "}
                      {userData.zoom_authorized ? "Yes" : "No"}
                    </p>
                    {!userData.zoom_authorized ? (
                      <button
                        className="btn btn-primary btn-lg m-2"
                        onClick={() => (window.location.href = zoomAuthURL)}
                      >
                        Authorize Zoom Integration
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {userData.zoom_authorized ? (
          <ZoomInfo token={token} setToken={setToken} />
        ) : null}
      </div>
    </div>
  );
};

export default Dashboard;
