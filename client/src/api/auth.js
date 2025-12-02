import API from "./api";

// Sign up
export const signUpUser = async (
  username,
  email,
  password,
  confirmPassword
) => {
  try {
    const response = await API.post("/auth/sign-up", {
      username,
      email,
      password,
      confirmPassword,
    });
    return response.data;
  } catch (err) {
    let message = "Error during sign-up";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Login
export const loginUser = async (email, password) => {
  try {
    const response = await API.post("/auth/login", { email, password });
    return response.data;
  } catch (err) {
    let message = "Error during login";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Forgot password
export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/auth/forgot-password", { email });
    return response.data; // returns { resetUrl } in dev mode
  } catch (err) {
    let message = "Error during password reset request";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Reset password
export const resetPassword = async (token, newPassword, confirmNewPassword) => {
  try {
    const response = await API.post("/auth/reset-password", {
      token,
      newPassword,
      confirmNewPassword,
    });
    return response.data;
  } catch (err) {
    let message = "Error during password reset";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};

// Change password
export const changePassword = async (
  oldPassword,
  newPassword,
  confirmNewPassword
) => {
  try {
    const res = await API.post("/auth/change-password", {
      oldPassword,
      newPassword,
      confirmNewPassword,
    });

    if (res.data.token) {
      localStorage.setItem("token", res.data.token);
    }

    return res.data;
  } catch (err) {
    let message = "Error changing password";
    if (err.response?.data?.message) message = err.response.data.message;
    throw new Error(message);
  }
};

// Update user info (Username and email)
export const updateUserInfo = async (username, email) => {
  try {
    const response = await API.put("/auth/update", { username, email });
    return response.data;
  } catch (err) {
    let message = "Error updating user information";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};
