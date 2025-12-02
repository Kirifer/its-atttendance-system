const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9-]{2,}(\.[a-zA-Z]{2,6})+$/;
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

// Sign up
export const validateSignUp = (req, res, next) => {
  const { username, email, password, confirmPassword } = req.body;

  if (!username || username.length < 3)
    return res.status(400).json({
      message: "Username must be at least 3 characters long.",
    });

  if (!email || !emailRegex.test(email))
    return res.status(400).json({
      message:
        "Invalid email format. Must be at least 3 characters and have a valid domain.",
    });

  if (!password || !passwordRegex.test(password))
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include uppercase, lowercase, a number, and a special character.",
    });

  if (!confirmPassword)
    return res.status(400).json({ message: "Confirm password is required." });

  if (password !== confirmPassword)
    return res.status(400).json({ message: "Passwords do not match." });

  next();
};

// Login
export const validateLogin = (req, res, next) => {
  const { email, password, confirmPassword } = req.body;

  if (!email || !emailRegex.test(email))
    return res.status(400).json({
      message:
        "Invalid email format. Must be at least 3 characters and have a valid domain.",
    });

  if (!password)
    return res.status(400).json({ message: "Password is required." });

  next();
};

// Update User Information
export const validateUpdateUserInfo = (req, res, next) => {
  const { username, email } = req.body;

  if (username && username.length < 3)
    return res
      .status(400)
      .json({ message: "Username must be at least 3 characters long." });

  if (email && !emailRegex.test(email))
    return res.status(400).json({
      message:
        "Invalid email format. Must be at least 3 characters and have a valid domain.",
    });

  next();
};

// Change Password
export const validateChangePassword = (req, res, next) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;

  if (!oldPassword)
    return res.status(400).json({ message: "Old password is required." });

  if (!newPassword || !passwordRegex.test(newPassword))
    return res.status(400).json({
      message:
        "New password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.",
    });

  if (!confirmNewPassword)
    return res.status(400).json({ message: "Confirm password is required." });

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: "Passwords do not match." });

  next();
};

// Reset Password
export const validateResetPassword = (req, res, next) => {
  const { token, newPassword, confirmNewPassword } = req.body;

  console.log("RAW newPassword:", JSON.stringify(newPassword));
  console.log("Length:", newPassword.length);
  console.log("Regex test:", passwordRegex.test(newPassword));

  if (!token) return res.status(400).json({ message: "Token is required." });

  if (!newPassword || !passwordRegex.test(newPassword))
    return res.status(400).json({
      message:
        "Password must be at least 8 characters long, include uppercase and lowercase letters, a number, and a special character.",
    });

  if (!confirmNewPassword)
    return res.status(400).json({ message: "Confirm password is required." });

  if (newPassword !== confirmNewPassword)
    return res.status(400).json({ message: "Passwords do not match." });

  next();
};
