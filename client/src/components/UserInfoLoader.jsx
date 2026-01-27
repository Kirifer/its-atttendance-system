import "../styles/UserInfoLoader.css";

function UserInfoLoader() {
  return (
    <div className="loader">
      <div className="loader-content">
        <div className="spinner"></div>
        <p className="loader-text">Loading user information… Please wait!</p>
      </div>
    </div>
  );
}

export default UserInfoLoader;
