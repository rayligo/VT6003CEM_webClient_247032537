import React from "react";
import "antd/dist/reset.css";
import { Upload, Button, message, Alert, Typography } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { api } from "./common/http-common";
import { getCurrentUser } from "../services/auth.service";
import axios from "axios";

interface ImageUploadState {
  fileList: File[];
  uploading: boolean;
  imgPosted: any[];
  isUploadOk: boolean;
}

const currentUser = getCurrentUser();

class ImageUpload extends React.Component<{}, ImageUploadState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      fileList: [],
      uploading: false,
      imgPosted: [],
      isUploadOk: false,
    };
  }

  handleUpload = () => {
    const { fileList } = this.state;
    const formData = new FormData();
    fileList.forEach((file) => {
      formData.append("upload", file, file.name);
    });

    this.setState({ uploading: true });

    const requestOptions = {
      method: "POST",
      body: formData,
      redirect: "follow",
    };

    fetch(`${api.uri}/images`, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        message.success("Upload successful.");
        this.setState({
          isUploadOk: true,
          imgPosted: result,
        });

        // Update the user's avatarurl in the database
        if (currentUser && result.links?.path) {
          this.updateUserAvatar(result.links.path);
        }
      })
      .catch((error) => {
        message.error(`Upload failed: ${error.message}`);
        console.error("Error:", error);
      })
      .finally(() => {
        this.setState({ uploading: false });
      });
  };
  updateUserAvatar = (avatarUrl: string) => {
    const userId = currentUser?.id;
    if (!userId) {
      message.error("No user is logged in.");
      return;
    }

    const token = localStorage.getItem("aToken");
    if (!token) {
      message.error("Authentication token is missing. Please log in again.");
      return;
    }

    // Get username and email from currentUser
    const username = currentUser?.username;
    const email = currentUser?.email;
    if (!username || !email) {
      message.error("User information is incomplete. Please log in again.");
      return;
    }

    axios
      .put(
        `${api.uri}/users/${userId}`,
        {
          avatarurl: avatarUrl,
          username: username,
          email: email,
          password: "", // Send empty password to satisfy schema
        },
        {
          headers: {
            Authorization: `Basic ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("Avatar update response:", response.data);
        message.success("Profile avatar updated successfully.");
        const updatedUser = { ...currentUser, avatarurl: avatarUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.location.reload();
      })
      .catch((error) => {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Failed to update profile avatar.";
        console.error("Avatar update error:", {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
        });
        message.error(`Failed to update avatar: ${errorMessage}`);
      });
  };
  render() {
    const { Title } = Typography;
    const { uploading, fileList, isUploadOk, imgPosted } = this.state;

    const uploadProps = {
      onRemove: (file: File) => {
        this.setState((state) => ({
          fileList: state.fileList.filter((f) => f !== file),
        }));
      },
      beforeUpload: (file: File) => {
        this.setState((state) => ({
          fileList: [...state.fileList, file],
        }));
        return false;
      },
      fileList,
    };

    return (
      <>
        {currentUser?.role === "admin" ? (
          <Title level={2}>Admin Upload Image</Title>
        ) : (
          <Title level={2}>User Upload Image</Title>
        )}
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>Select File</Button>
        </Upload>
        <Button
          type="primary"
          onClick={this.handleUpload}
          disabled={fileList.length === 0}
          loading={uploading}
          style={{ marginTop: 16 }}
        >
          {uploading ? "Uploading" : "Start Upload"}
        </Button>
        {isUploadOk && (
          <Alert
            message="Image uploaded successfully:"
            description={
              <a href={imgPosted.links?.path}>{imgPosted.links?.path}</a>
            }
            type="success"
            showIcon
            style={{ marginTop: 16 }}
          />
        )}
      </>
    );
  }
}

export default ImageUpload;
