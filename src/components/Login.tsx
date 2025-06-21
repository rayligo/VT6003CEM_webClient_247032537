import "antd/dist/reset.css";
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Typography, message } from "antd";
import { LoginOutlined, UserOutlined, LockOutlined } from "@ant-design/icons";
import { login } from "../services/auth.service";

const { Title } = Typography;

const Login: React.FC = () => {
  const navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    const { username, password, remember } = values;

    setLoading(true);
    try {
      await login(username, password);
      if (localStorage.getItem("user")) {
        if (remember) {
          // Store credentials for "Remember me" functionality
          localStorage.setItem(
            "rememberedUser",
            JSON.stringify({ username, password })
          );
        } else {
          localStorage.removeItem("rememberedUser");
        }
        message.success("Login successful!");
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      const resMessage =
        error.response?.data?.message || error.message || "An error occurred";
      message.error(`Login failed: ${resMessage}`);
      setLoading(false);
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
            Welcome to Wanderlust Travel
          </Title>
        </div>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
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

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox className="text-gray-600">Remember me</Checkbox>
            </Form.Item>

            <a
              className="text-indigo-600 hover:text-indigo-800 float-right"
              href="/register"
            >
              Register now!
            </a>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              size="large"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 border-none rounded-md"
            >
              <LoginOutlined /> Log in
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
