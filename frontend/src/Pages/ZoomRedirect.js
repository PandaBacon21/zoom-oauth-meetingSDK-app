import { useSearchParams } from "react-router-dom";
import ZoomAuth from "./Utilities/ZoomAuth";

const ZoomRedirect = (props) => {
  const [searchParams] = useSearchParams();
  let zoomAuthCode = searchParams.get("code");
  ZoomAuth(props.token, zoomAuthCode);
};

export default ZoomRedirect;
