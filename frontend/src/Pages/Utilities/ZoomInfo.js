import React, { useState } from "react";
import axios from "axios";
import ZoomMeetingInfo from "./ZoomMeetingInfo";

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
      <div className="row d-flex justify-content-center align-items-start h-25">
        <div className="col-md-2 col-lg-6">
          <div className="card text-black" style={{ borderRadius: "25px" }}>
            <div className="card-body p-md-5">
              <div className="row justify-content-center">
                <div className="col-md-10 col-lg-7 col-xl-8 order-2 order-lg-1 text-center">
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
                        className="btn btn-primary"
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
        </div>
        {zoomData.accountId !== "" ? <ZoomMeetingInfo token={token} /> : null}
      </div>
    </>
  );
}

export default ZoomInfo;
