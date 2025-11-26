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
export const resetPassword = async (token, password) => {
  try {
    const response = await API.post("/auth/reset-password", {
      token,
      password,
    });
    return response.data;
  } catch (err) {
    let message = "Error during password reset";
    if (err.response?.data?.message) message = err.response.data.message;
    else if (err.message) message = err.message;
    throw new Error(message);
  }
};
