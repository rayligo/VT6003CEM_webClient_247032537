import "antd/dist/reset.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getCurrentUser } from "../services/auth.service";
import ImageUpload from "./ImageUpload"; // Reusing the original component
import { NavigateFunction, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "./common/http-common";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Space,
  Typography,
  message,
  Card,
} from "antd";
import { Avatar } from "antd";
import { DeleteOutlined, UserOutlined } from "@ant-design/icons";
import UserT from "../types/user.type";

const { TextArea } = Input;
const { Title, Text } = Typography;

const Profile: React.FC = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [avatarUrl, setAvatarUrl] = useState<string>(
    currentUser.avatarurl || "avatarurl"
  );

  const ava = useMemo(
    () =>
      currentUser.avatarurl !== undefined && currentUser.avatarurl !== null
        ? currentUser.avatarurl
        : "avatarurl",
    [currentUser.avatarurl]
  );

  const ab = useMemo(
    () =>
      currentUser.about !== undefined && currentUser.about !== null
        ? currentUser.about
        : "about me",
    [currentUser.about]
  );

  const initialValues: UserT = {
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    avatarurl: avatarUrl,
    about: ab,
    role: currentUser.role,
    actiCode: "",
  };

  useEffect(() => {
    setAvatarUrl(currentUser.avatarurl || "avatarurl");
    form.setFieldsValue(initialValues);
    setLoading(false);
  }, [currentUser.avatarurl, form, initialValues]);

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure to delete your user account?")) {
      setLoading(true);
      axios
        .delete(`${api.uri}/users/${currentUser.id}`, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        })
        .then((results) => {
          console.log("Response:", JSON.stringify(results.data));
          if (results.data) {
            message.success(
              `All records for user with id ${currentUser.id} have been removed.`
            );
            localStorage.removeItem("user");
            navigate("/");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error("Check network problems:", err);
          message.error("Failed to delete account. Check network problems.");
        })
        .finally(() => setLoading(false));
    }
  }, [currentUser.id, navigate]);

  const handleFormSubmit = useCallback(
    async (values: UserT) => {
      setLoading(true);
      try {
        const upDateUser = {
          username: values.username,
          email: values.email,
          password: values.password,
          avatarurl: avatarUrl,
          about: values.about.replace(/[&\/\\#,+()$~%.`'":*?<>{}]/g, "_"),
        };
        await axios.put(`${api.uri}/users/${currentUser.id}`, upDateUser, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        });
        message.success("Profile updated successfully. Please log in again.");
        console.log("Updated data:", upDateUser);
        localStorage.removeItem("user");
        navigate("/");
        window.location.reload();
      } catch (err) {
        console.error("Update failed:", err);
        message.error("Failed to update profile. Check network problems.");
      } finally {
        setLoading(false);
      }
    },
    [currentUser.id, navigate, avatarUrl]
  );

  const handleImageUpload = (url: string) => {
    console.log("Uploaded URL:", url); // Debug log
    setAvatarUrl(url);
    form.setFieldsValue({ avatarurl: url });
    message.success("Avatar uploaded successfully.");
  };

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-4xl mx-auto shadow-lg">
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} md={6} className="text-center">
            <Avatar
              size={120}
              src={avatarUrl.indexOf("http") >= 0 ? avatarUrl : undefined}
              icon={<UserOutlined />}
              className="mb-4 border-2 border-gray-300"
            />
            <Title level={4} className="text-green-700">
              {currentUser.username}
            </Title>
            <Text type="secondary">{currentUser.role}</Text>
          </Col>
          <Col xs={24} md={18}>
            <Form
              form={form}
              {...{ labelCol: { span: 6 }, wrapperCol: { span: 18 } }}
              initialValues={initialValues}
              onFinish={handleFormSubmit}
              className="p-6"
            >
              <Form.Item
                name="username"
                label="Username"
                rules={[
                  { required: true, message: "Please input your username!" },
                ]}
              >
                <Input placeholder={currentUser.username} />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email"
                rules={[
                  { type: "email", message: "Please enter a valid email!" },
                  { required: true, message: "Please input your email!" },
                ]}
              >
                <Input placeholder={currentUser.email} />
              </Form.Item>
              <Form.Item
                name="password"
                label="New Password"
                rules={[
                  { required: false },
                  {
                    min: 6,
                    message: "Password must be at least 6 characters!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Enter New Password" />
              </Form.Item>
              <Form.Item
                name="confirm"
                label="Confirm Password"
                dependencies={["password"]}
                hasFeedback
                rules={[
                  { required: false },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error("Passwords do not match!")
                      );
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="Confirm Password" />
              </Form.Item>
              <Form.Item
                name="about"
                label="About Me"
                rules={[{ required: false }]}
              >
                <TextArea rows={3} placeholder={ab} />
              </Form.Item>
              <Form.Item label="Upload icon">
                <ImageUpload onUpload={handleImageUpload} />
              </Form.Item>
              <Form.Item
                name="avatarurl"
                label="Avatar URL"
                valuePropName="value"
              >
                <Input value={avatarUrl} disabled className="bg-gray-100" />
              </Form.Item>
              <Form.Item name="role" label="Role" valuePropName="value">
                <Input
                  value={currentUser.role}
                  disabled
                  className="bg-gray-100"
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  className="w-full bg-green-600 hover:bg-green-700"
                  loading={loading}
                >
                  Save Changes
                </Button>
                {currentUser.role !== "admin" && (
                  <Button
                    type="link"
                    danger
                    icon={<DeleteOutlined />}
                    size="large"
                    onClick={handleDelete}
                    className="mt-4 w-full text-red-600 hover:text-red-800"
                  >
                    Delete Account
                  </Button>
                )}
              </Form.Item>
            </Form>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Profile;
