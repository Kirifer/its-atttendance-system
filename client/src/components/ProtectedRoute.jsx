import ErrorPage from "../screens/ErrorPage.jsx";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <ErrorPage />;
    // message="SIGN IN FIRST TO ACCESS THIS PAGE!!"
  }

  return children;
}

export default ProtectedRoute;
