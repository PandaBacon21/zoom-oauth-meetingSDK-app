import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ZoomAuth = (token, zoomAuthCode) => {
  const navigate = useNavigate();
  useEffect(() => {
    axios({
      method: "POST",
      url: "/api/zoom-token",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        auth_code: zoomAuthCode,
      },
    })
      .then((response) => {
        console.log(response.data);
        navigate("/dashboard");
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
        navigate("/dashboard");
      });
  }, [navigate, token, zoomAuthCode]);
};

export default ZoomAuth;
