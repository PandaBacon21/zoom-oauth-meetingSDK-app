import React, { useState } from "react";
import axios from "axios";

import { ZoomMtg } from "@zoom/meetingsdk";

const ZoomMeetingInfo = (props) => {
  const [hasMeeting, setHasMeeting] = useState(false);
  const [meetingCredentials, setMeetingCredentials] = useState({
    meetingNumber: 0,
    sdkKey: "",
    signature: "",
    passWord: "",
    role: 0,
    userName: "",
    userEmail: "",
    zakToken: "",
    leaveUrl: "http://localhost:3000/dashboard",
  });

  function handleCreateMeeting() {
    axios({
      method: "POST",
      url: "/api/zoom/create-meeting",
      headers: {
        Authorization: `Bearer ${props.token}`,
      },
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
        setMeetingCredentials((meetingCredentials) => {
          return {
            ...meetingCredentials,
            meetingTopic: res["meeting_topic"],
            meetingNumber: res["meeting_number"],
            sdkKey: res["sdkKey"],
            signature: res["signature"],
            passWord: res["password"],
            role: res["role"],
            userName: res["username"],
            userEmail: res["user_email"],
            zakToken: res["zak"],
          };
        });
        setHasMeeting(true);
        // console.log(`Created Meeting: ${meetingCredentials.meetingNumber}`);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function startMeeting(meetingCredentials) {
    console.log(meetingCredentials.meetingNumber);
    ZoomMtg.preLoadWasm();
    ZoomMtg.prepareWebSDK();

    ZoomMtg.i18n.load("en-US");

    document.getElementById("zmmtg-root").style.display = "block";

    ZoomMtg.init(
      {
        leaveUrl: meetingCredentials.leaveUrl,
        patchJsMedia: true,
        success: (success) => {
          console.log(success);
          console.log(`meetingNumber: ${meetingCredentials.meetingNumber}`);
          console.log(`sdkKey: ${meetingCredentials.sdkKey}`);
          console.log(`signature: ${meetingCredentials.signature}`);
          console.log(`passWord: ${meetingCredentials.passWord}`);
          console.log(`userName: ${meetingCredentials.userName}`);
          console.log(`userEmail: ${meetingCredentials.userEmail}`);
          console.log(`zakToken: ${meetingCredentials.zakToken}`);

          ZoomMtg.join({
            meetingNumber: meetingCredentials.meetingNumber,
            sdkKey: meetingCredentials.sdkKey,
            signature: meetingCredentials.signature,
            passWord: meetingCredentials.passWord,
            userName: meetingCredentials.userName,
            userEmail: meetingCredentials.userEmail,
            zak: meetingCredentials.zakToken,
            success: (success) => {
              console.log(success);
            },
            error: (error) => {
              console.log(error);
            },
          });
        },
        error: (error) => {
          console.log(error);
        },
      },
      [meetingCredentials]
    );
  }
  function handleStartMeeting() {
    startMeeting(meetingCredentials);
  }

  return (
    <div className="col-md-2 col-lg-6">
      <div className="card text-black" style={{ borderRadius: "25px" }}>
        <div className="card-body p-md-5">
          <div className="row justify-content-center">
            <div className="col-md-10 col-lg-7 col-xl-10 order-2 order-lg-1 text-center">
              <h1>Zoom Meeting Information</h1>
              {!hasMeeting ? (
                <button
                  type="button"
                  className="btn btn-primary btn-lg m-2"
                  onClick={handleCreateMeeting}
                >
                  Create Meeting
                </button>
              ) : (
                <ul>
                  <li>Meeting Topic {meetingCredentials.meetingTopic}</li>
                  <li>Meeting Number: {meetingCredentials.meetingNumber}</li>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg m-2"
                    onClick={handleStartMeeting}
                  >
                    Start Meeting
                  </button>
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ZoomMeetingInfo;
