import React, { useState } from "react";
import axios from "axios";
import ZoomMeetingInfo from "./ZoomMeetingInfo";
import "./ZoomInfo.css";

function ZoomInfo({ token, setToken }) {
  const [zoomData, setZoomData] = useState({
    accountId: "",
    displayName: "",
    email: "",
  });

  const getZoomInfo = () => {
    axios({
      method: "GET",
      url: "/api/zoom/me",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        const res = response.data;
        res.access_token && setToken(res.access_token);
        setZoomData({
          ...zoomData,
          accountId: res["account_id"],
          displayName: res["display_name"],
          email: res["email"],
        });
        console.log("Zoom Account ID: " + res.account_id);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  };

  const handleGetZoomInfo = () => {
    getZoomInfo();
  };

  return (
    <>
      <div className="zoom-info-card-container">
        <div className="zoom-info-card">
          <div className="zoom-info-card-row">
            <div className="zoom-info-card-content">
              <h1>Zoom Account Information</h1>
              <div className="text-center">
                {zoomData.accountId !== "" ? (
                  <ul>
                    <li>Zoom Id: {zoomData.accountId}</li>
                    <li>Zoom Display Name: {zoomData.displayName}</li>
                    <li>Zoom Email: {zoomData.email}</li>
                  </ul>
                ) : (
                  <button
                    type="button"
                    className="btn"
                    onClick={handleGetZoomInfo}
                  >
                    Get Zoom Account Info
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {zoomData.accountId !== "" ? <ZoomMeetingInfo token={token} /> : null}
    </>
  );
}

export default ZoomInfo;
