import React, { useEffect, useState } from "react";
import UserInfoLayout from "../components/UserInfoLayout";
import styles from "../styles/UserInfo.css";
import Cropper from "react-easy-crop";
import ChangePassword from "../components/ChangePassword";
import { changePassword } from "../api/auth";
import API from "../api/api";

function dataURLtoFile(dataUrl, filename) {
  const arr = dataUrl.split(",");
  const mime = arr[0].match(/:(.*?);/)[1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

const token = localStorage.getItem("token");
const authHeader = `Bearer ${token}`;

function UserInfo() {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
    profilePic: "/defaultProfile.png",
  });
  const [edit, setEdit] = useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
    confirmPassword: "",
    profilePic: "",
  });
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [originalUser, setOriginalUser] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppingImage, setCroppingImage] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [cropBox, setCropBox] = useState({
    width: 200,
    height: 200,
    x: 100,
    y: 100,
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser({
        ...storedUser,
        profilePic: storedUser.profilePic || "/defaultProfile.png",
        password: storedUser.password || "",
      });
      setEdit({
        username: storedUser.username,
        email: storedUser.email,
        profilePic: storedUser.profilePic,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });
      setOriginalUser(storedUser);
    }
  }, []);

  // Cropping
  const handleCropSave = async () => {
    if (!croppingImage || !croppedAreaPixels) return;

    const croppedImg = await getCroppedImage();
    const croppedFile = dataURLtoFile(croppedImg, "profile.jpg");

    const form = new FormData();
    form.append("profilePic", croppedFile);

    try {
      const res = await API.post("/upload-profile", form, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUser((prev) => ({ ...prev, profilePic: res.data.url }));
      setEdit((prev) => ({ ...prev, profilePic: res.data.url }));

      setTempImage(null);
      setCroppingImage(null);
      setZoom(1);
      setCrop({ x: 0, y: 0 });
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Failed to upload profile picture!");
    }
  };

  const isEdited = () => {
    if (!originalUser) return false;
    return (
      edit.username !== originalUser.username ||
      edit.email !== originalUser.email ||
      edit.profilePic !== (originalUser.profilePic || "/defaultProfile.png") ||
      edit.password ||
      edit.newPassword ||
      edit.confirmPassword
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEdit((prev) => ({ ...prev, [name]: value }));

    if (name === "username" || name === "email") {
      setUser((prev) => ({ ...prev, [name]: value }));
    }
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const getCroppedImage = async () => {
    if (!croppingImage || !croppedAreaPixels) return null;

    const image = new Image();
    image.src = croppingImage;
    await new Promise((res) => (image.onload = res));

    const canvas = document.createElement("canvas");
    canvas.width = croppedAreaPixels.width;
    canvas.height = croppedAreaPixels.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    return canvas.toDataURL("image/jpeg");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setTempImage(reader.result);
      setCroppingImage(reader.result);
    };
    reader.readAsDataURL(file);

    e.target.value = null;
  };

  const handleSave = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user")) || {};

    try {
      if (edit.profilePic instanceof File) {
        const form = new FormData();
        form.append("profilePic", edit.profilePic);

        const res = await API.post("/upload-profile", form, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        edit.profilePic = res.data.url;
      }

      if (edit.password || edit.newPassword || edit.confirmPassword) {
        if (!edit.password || !edit.newPassword || !edit.confirmPassword) {
          alert("Please fill all password fields!");
          return;
        }

        const res = await API.post(
          "/change-password",
          {
            oldPassword: edit.password,
            newPassword: edit.newPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (res.data.success) {
          alert("Password updated successfully!");
          setEdit((prev) => ({
            ...prev,
            password: "",
            newPassword: "",
            confirmPassword: "",
          }));
        } else {
          alert(res.data.message || "Failed to change password!");
          return;
        }
      }

      const updatedUser = {
        ...storedUser,
        username: edit.username,
        email: edit.email,
        profilePic: edit.profilePic,
        password: edit.newPassword || storedUser.password,
      };

      setUser(updatedUser);
      setEdit({
        username: updatedUser.username,
        email: updatedUser.email,
        profilePic: updatedUser.profilePic,
        password: "",
        newPassword: "",
        confirmPassword: "",
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      alert("Changes saved successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes!");
    }
  };

  const handleDeletePhoto = () => {
    const defaultPic = "/defaultProfile.png";

    setUser((prev) => ({ ...prev, profilePic: defaultPic }));
    setEdit((prev) => ({ ...prev, profilePic: defaultPic }));

    const storedUser = JSON.parse(localStorage.getItem("user")) || {};
    const updatedUser = { ...storedUser, profilePic: defaultPic };
    localStorage.setItem("user", JSON.stringify(updatedUser));

    alert("Profile photo has been reset to default.");
  };

  return (
    <UserInfoLayout>
      <div className="user-info-container">
        {/* Profile Picture */}
        <div className="profile-pic-section">
          <img
            src={croppingImage ? tempImage || croppingImage : user.profilePic}
            alt="Profile"
          />

          <button onClick={() => document.getElementById("picInput").click()}>
            Change Photo
          </button>

          <button
            onClick={handleDeletePhoto}
            style={{ background: "red", color: "white" }}
          >
            Remove Photo
          </button>

          <input
            id="picInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageUpload}
          />
        </div>

        {/* Username */}
        <div className="user-section">
          <label>Username:</label>
          {!isEditingUsername ? (
            <>
              <span>{user.username}</span>
              <button onClick={() => setIsEditingUsername(true)}>Edit</button>
            </>
          ) : (
            <>
              <input
                type="text"
                name="username"
                value={edit.username}
                onChange={handleChange}
              />
              <button onClick={() => setIsEditingUsername(false)}>Done</button>
              <button
                style={{ background: "gray", color: "white", marginLeft: 5 }}
                onClick={() => {
                  setEdit((prev) => ({
                    ...prev,
                    username: originalUser.username,
                  }));
                  setUser((prev) => ({
                    ...prev,
                    username: originalUser.username,
                  }));
                  setIsEditingUsername(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Email */}
        <div className="email-section">
          <label>Email:</label>
          {!isEditingEmail ? (
            <>
              <span>{user.email}</span>
              <button onClick={() => setIsEditingEmail(true)}>Edit</button>
            </>
          ) : (
            <>
              <input
                type="email"
                name="email"
                value={edit.email}
                onChange={handleChange}
              />
              <button onClick={() => setIsEditingEmail(false)}>Done</button>
              <button
                style={{ background: "gray", color: "white", marginLeft: 5 }}
                onClick={() => {
                  setEdit((prev) => ({ ...prev, email: originalUser.email }));
                  setUser((prev) => ({ ...prev, email: originalUser.email }));
                  setIsEditingEmail(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Password */}
        <div className="password-section">
          <label>Password:</label>
          {!isEditingPassword ? (
            <>
              <span>********</span>
              <button onClick={() => setIsEditingPassword(true)}>Edit</button>
            </>
          ) : (
            <>
              <ChangePassword
                password={edit.password}
                newPassword={edit.newPassword}
                confirmNewPassword={edit.confirmPassword}
                showNew={true}
                onPasswordChange={(e) =>
                  setEdit((prev) => ({ ...prev, password: e.target.value }))
                }
                onNewChange={(e) =>
                  setEdit((prev) => ({ ...prev, newPassword: e.target.value }))
                }
                onConfirmNewChange={(e) =>
                  setEdit((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                error={
                  edit.newPassword && edit.newPassword !== edit.confirmPassword
                    ? "Passwords do not match"
                    : ""
                }
              />

              <button
                onClick={async () => {
                  const passwordFilled =
                    edit.password || edit.newPassword || edit.confirmPassword;

                  if (passwordFilled) {
                    if (
                      !edit.password ||
                      !edit.newPassword ||
                      !edit.confirmPassword
                    ) {
                      alert(
                        "Please fill out all password fields to change password!"
                      );
                      return;
                    }

                    if (edit.newPassword !== edit.confirmPassword) {
                      alert("Passwords do not match!");
                      return;
                    }

                    try {
                      await changePassword(edit.password, edit.newPassword);
                      alert("Password updated successfully!");
                      setEdit((prev) => ({
                        ...prev,
                        password: "",
                        newPassword: "",
                        confirmPassword: "",
                      }));
                      setUser((prev) => ({
                        ...prev,
                        password: edit.newPassword,
                      }));
                    } catch (err) {
                      alert(err.message || "Failed to update password!");
                      return;
                    }
                  }

                  setIsEditingPassword(false);
                }}
              >
                Done
              </button>

              <button
                style={{ background: "gray", color: "white", marginLeft: 5 }}
                onClick={() => {
                  setEdit((prev) => ({
                    ...prev,
                    password: "",
                    newPassword: "",
                    confirmPassword: "",
                  }));
                  setIsEditingPassword(false);
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>

        {/* Crop */}
        {croppingImage && (
          <div className="crop-modal">
            <div
              style={{
                position: "relative",
                width: 400,
                height: 400,
                background: "#333",
              }}
            >
              <Cropper
                image={croppingImage}
                crop={crop}
                zoom={zoom}
                aspect={1}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={onCropComplete}
                cropShape="rect"
                showGrid={true}
              />

              {/* Zoom controls */}
              <div
                style={{
                  position: "absolute",
                  bottom: 10,
                  left: "50%",
                  transform: "translateX(-50%)",
                  display: "flex",
                  gap: 10,
                  background: "rgba(0,0,0,0.4)",
                  padding: "5px 10px",
                  borderRadius: 8,
                }}
              >
                <button onClick={() => setZoom((z) => Math.max(z - 0.1, 1))}>
                  ➖
                </button>
                <span style={{ color: "white" }}>
                  {(zoom * 100).toFixed(0)}%
                </span>
                <button onClick={() => setZoom((z) => Math.min(z + 0.1, 3))}>
                  ➕
                </button>
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <button
                onClick={async () => {
                  const croppedImg = await getCroppedImage();
                  if (!croppedImg) return;

                  const croppedFile = dataURLtoFile(croppedImg, "profile.jpg");

                  const form = new FormData();
                  form.append("profilePic", croppedFile);

                  const uploadRes = await API.post(
                    "http://localhost:5000/upload-profile",
                    form,
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${localStorage.getItem(
                          "token"
                        )}`,
                      },
                    }
                  );

                  setUser((prev) => ({
                    ...prev,
                    profilePic: uploadRes.data.url,
                  }));
                  setEdit((prev) => ({
                    ...prev,
                    profilePic: uploadRes.data.url,
                  }));

                  setTempImage(null);
                  setCroppingImage(null);
                  setZoom(1);
                  setCrop({ x: 0, y: 0 });
                }}
              >
                Save Crop
              </button>

              <button
                onClick={() => {
                  setTempImage(null);
                  setCroppingImage(null);
                  setZoom(1);
                  setCrop({ x: 0, y: 0 });
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Save Button */}
        <button onClick={handleSave}>Save</button>

        {/* Cancel Button */}
        {isEdited() && (
          <button
            style={{ background: "gray", color: "white" }}
            onClick={() => {
              setEdit({
                username: originalUser.username,
                email: originalUser.email,
                profilePic: originalUser.profilePic || "/defaultProfile.png",
                password: "",
                newPassword: "",
                confirmPassword: "",
              });

              setUser({
                username: originalUser.username,
                email: originalUser.email,
                profilePic: originalUser.profilePic || "/defaultProfile.png",
                password: originalUser.password,
              });

              setIsEditingUsername(false);
              setIsEditingEmail(false);
              setIsEditingPassword(false);

              setTempImage(null);
              setCroppingImage(null);
              setZoom(1);
              setCrop({ x: 0, y: 0 });
              setCropBox({ width: 200, height: 200, x: 100, y: 100 });

              document.getElementById("picInput").value = null;
            }}
          >
            Cancel all changes
          </button>
        )}
      </div>
    </UserInfoLayout>
  );
}

export default UserInfo;
