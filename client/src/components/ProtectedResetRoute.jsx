import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ResetErrorPage from "../screens/ResetErrorPage.jsx";
import API from "../api/api";

async function validateToken(token) {
  try {
    const response = await API.get(`/auth/validate-reset-token/${token}`);
    return response.data.isValid;
  } catch (error) {
    return false;
  }
}

function ProtectedResetRoute({ children }) {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [isValid, setIsValid] = useState(false);

  const allowedInSession = sessionStorage.getItem("reset_allowed");

  useEffect(() => {
    if (token && !allowedInSession) {
      const checkToken = async () => {
        const valid = await validateToken(token);
        setIsValid(valid);
        setLoading(false);
      };
      checkToken();
    } else if (token && allowedInSession === "true") {
      setIsValid(true);
      setLoading(false);
    } else {
      setIsValid(false);
      setLoading(false);
    }
  }, [token, allowedInSession]);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "100px" }}>Loading...</div>
    );
  }

  if (!isValid) {
    return <ResetErrorPage />;
  }

  return children;
}

export default ProtectedResetRoute;
