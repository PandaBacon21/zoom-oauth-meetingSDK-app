import React, { useState } from "react";
import axios from "axios";
import ZoomMeetingInfo from "./ZoomMeetingInfo";

const ZoomInfo = (props) => {
  const [showButton, setShowButton] = useState(true);

  const [zoomData, setZoomData] = useState({
    accountId: "",
    displayName: "",
    email: "",
  });

  function getZoomInfo() {
    axios({
      method: "GET",
      url: "/api/zoom/me",
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then((response) => {
        const res = response.data;
        res.access_token && props.setToken(res.access_token);
        zoomData.accountId = res["account_id"];
        zoomData.displayName = res["display_name"];
        zoomData.email = res["email"];
        setZoomData({ ...zoomData });
        console.log("Zoom Account ID:" + zoomData.accountId);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function toggleButton() {
    setShowButton(!showButton);
  }

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
                    {showButton && (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => {
                          getZoomInfo();
                          toggleButton();
                        }}
                      >
                        Get Zoom Account Info
                      </button>
                    )}
                    {zoomData.accountId !== "" ? (
                      <ul>
                        <li>Zoom Id: {zoomData.accountId}</li>
                        <li>Zoom Display Name: {zoomData.displayName}</li>
                        <li>Zoom Email: {zoomData.email}</li>
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {zoomData.accountId !== "" ? (
          <ZoomMeetingInfo token={props.token} />
        ) : null}
      </div>
    </>
  );
};

export default ZoomInfo;

/* <div className="col-lg-12 col-xl-11"> */
