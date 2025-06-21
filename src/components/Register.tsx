import "antd/dist/reset.css";
import React from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Form, Input, Button, Card, Typography, message } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from "@ant-design/icons";
import { register } from "../services/auth.service";
import UserT from "../types/user.type";

const { Title } = Typography;

const Register: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();

  const handleRegister = async (values: UserT) => {
    const { username, email, password, actiCode } = values;

    try {
      await register(username, email, password, actiCode);
      message.success(
        `Welcome ${username}! Please login to access your account.`
      );
      navigate("/");
      window.location.reload();
    } catch (error) {
      message.error(
        `Registration failed: Sorry ${username}, something went wrong. Please try a different username.`
      );
      console.log(error.toString());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card
        className="w-full max-w-md shadow-lg"
        style={{ borderRadius: "12px", padding: "24px" }}
      >
        <div className="text-center mb-6">
          <img
            src="/src/assets/Wanderlust_Travelsmall.png"
            alt="Wanderlust Travel"
            className="h-16 mx-auto mb-4"
          />
          <Title level={3} className="text-indigo-600">
            Join Wanderlust Travel
          </Title>
        </div>
        <Form
          name="register"
          initialValues={{ role: "user", actiCode: "" }}
          onFinish={handleRegister}
          layout="vertical"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Username"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please input your email!" },
              { type: "email", message: "Please enter a valid email!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Email"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Password"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The two passwords do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Confirm Password"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item
            name="actiCode"
            rules={[{ message: "Optional secret code for internal staff" }]}
          >
            <Input
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Staff Code (Optional)"
              size="large"
              className="rounded-md"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none rounded-md"
            >
              Register
            </Button>
          </Form.Item>

          <div className="text-center">
            <a className="text-indigo-600 hover:text-indigo-800" href="/login">
              Already have an account? Log in
            </a>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
