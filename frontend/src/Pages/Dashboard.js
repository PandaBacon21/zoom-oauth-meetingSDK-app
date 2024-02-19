import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavBar from "./Utilities/NavBar";
import ZoomInfo from "./Utilities/ZoomInfo";
import "./Dashboard.css";

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
    <>
      <NavBar removeToken={removeToken} />
      <div className="dashboard-container">
        <div className="dashboard-card-container">
          <div className="dashboard-card">
            <div className="dashboard-card-row">
              <div className="dashboard-card-content">
                <h1>Dashboard</h1>
                <h2>
                  Name: {userData.first_name} {userData.last_name}
                </h2>
                <p>Email: {userData.email}</p>
                <p>
                  Has Authorized Zoom: {userData.zoom_authorized ? "Yes" : "No"}
                </p>
                {!userData.zoom_authorized ? (
                  <button
                    type="button"
                    className="btn"
                    onClick={() => (window.location.href = zoomAuthURL)}
                  >
                    Authorize Zoom Integration
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        {userData.zoom_authorized ? (
          <ZoomInfo token={token} setToken={setToken} />
        ) : null}
      </div>
    </>
  );
};

export default Dashboard;
