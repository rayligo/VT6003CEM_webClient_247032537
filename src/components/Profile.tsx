import "antd/dist/reset.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { getCurrentUser } from "../services/auth.service";
import SearchUser from "./userSearch";
import ImageUpload from "./ImageUpload";
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
  Table,
  Modal,
  Typography,
} from "antd";
import { Avatar } from "antd";
import {
  DeleteOutlined,
  UserOutlined,
  EditOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import EditForm from "./EditForm";
import UserT from "../types/user.type";

const { TextArea } = Input;
const { Title } = Typography;

interface Hotel {
  id: number;
  title: string;
  alltext: string;
  summary: string;
  imageurl: string;
  authorid: number;
  description: string;
}

const Profile: React.FC = () => {
  const currentUser = useMemo(() => getCurrentUser(), []);
  const navigate: NavigateFunction = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  const formItemLayout = {
    labelCol: { xs: { span: 24 }, sm: { span: 8 } },
    wrapperCol: { xs: { span: 24 }, sm: { span: 16 } },
  };

  const ava = useMemo(
    () =>
      currentUser.avatarurl !== undefined && currentUser.avatarurl !== null
        ? currentUser.avatarurl
        : " avatarurl ",
    [currentUser.avatarurl]
  );

  const ab = useMemo(
    () =>
      currentUser.about !== undefined && currentUser.about !== null
        ? currentUser.about
        : " about me ",
    [currentUser.about]
  );

  const initialValues: UserT = {
    username: currentUser.username,
    email: currentUser.email,
    password: "",
    avatarurl: ava,
    about: ab,
    role: currentUser.role,
    actiCode: "",
  };

  useEffect(() => {
    if (currentUser.role === "admin") {
      axios
        .get(`${api.uri}/articles`, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        })
        .then((res) => {
          setHotels(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching hotels:", err);
          alert("Check network problems");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [currentUser.role]);

  const handleDelete = useCallback(() => {
    if (window.confirm("Are you sure to delete your user account? ")) {
      axios
        .delete(`${api.uri}/users/${currentUser.id}`, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        })
        .then((results) => {
          alert(
            `All records for user with id ${currentUser.id} are removed from the Hotel Agent`
          );
          localStorage.removeItem("user");
          navigate("/", { replace: true });
        })
        .catch((err) => {
          console.error("Check network problems pls.", err);
          alert("Check network problems");
        });
    }
  }, [currentUser.id, navigate]);

  const handleHotelDelete = useCallback((id: number) => {
    if (window.confirm("Are you sure to delete this hotel entry?")) {
      axios
        .delete(`${api.uri}/articles/${id}`, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        })
        .then((results) => {
          if (results.data.message === "removed") {
            alert("Hotel entry removed successfully");
            setHotels((prev) => prev.filter((hotel) => hotel.id !== id));
          }
        })
        .catch((err) => {
          console.error("Check network problems pls.", err);
          alert("Check network problems");
        });
    }
  }, []);

  const handleHotelUpdate = useCallback((hotel: Hotel) => {
    setSelectedHotel(hotel);
    setIsUpdateModalVisible(true);
  }, []);

  const handleCreateHotel = useCallback(() => {
    setIsCreateModalVisible(true);
  }, []);

  const handleFormSubmit = useCallback(
    (values: UserT) => {
      const upDateUser = {
        username: values.username,
        email: values.email,
        password: values.password,
        avatarurl: values.avatarurl,
        about: values.about.replace(/[&\/\\#,+()$~%.`'":*?<>{}]/g, "_"),
      };
      axios
        .put(`${api.uri}/users/${currentUser.id}`, upDateUser, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        })
        .then((res) => {
          alert("Successfully updated the date");
        });
    },
    [currentUser.id, navigate]
  );

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Hotel Name", dataIndex: "title", key: "title" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Action",
      key: "action",
      render: (_: any, record: Hotel) => (
        <Space size="middle">
          <Button
            icon={<EditOutlined />}
            onClick={() => handleHotelUpdate(record)}
          >
            Edit
          </Button>
          <Button
            icon={<DeleteOutlined />}
            danger
            onClick={() => handleHotelDelete(record.id)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <div style={{ marginRight: "15px", marginBottom: "15px" }}>
        <h2 style={{ color: "#135200" }}>
          <strong>{currentUser.username}</strong> Profile
        </h2>
        <Form
          {...formItemLayout}
          style={{ maxWidth: 720 }}
          initialValues={initialValues}
          onFinish={handleFormSubmit}
        >
          {/* Form fields remain unchanged */}
          <Form.Item name="username" label="Username">
            <Input placeholder={currentUser.username} />
          </Form.Item>
          <Form.Item
            name="email"
            label="email"
            rules={[
              { type: "email", message: "The input is not valid E-mail!" },
              { required: false, message: "Please input your E-mail!" },
            ]}
          >
            <Input placeholder={currentUser.email} />
          </Form.Item>
          <Form.Item
            name="password"
            label="New password"
            rules={[
              { required: false, message: "Please input your new password!" },
            ]}
            hasFeedback
          >
            <Input.Password placeholder="Enter New Password" />
          </Form.Item>
          <Form.Item
            name="confirm"
            label="Confirm new password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              { required: false, message: "Please confirm your password!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("The new password that you entered do not match!")
                  );
                },
              }),
            ]}
          >
            <Input.Password placeholder="Confirm Password" />
          </Form.Item>
          <Form.Item name="about" label="About me">
            <TextArea rows={2} placeholder={ab} />
          </Form.Item>
          <Form.Item name="avatarurl" label="Avatarurl">
            <TextArea rows={2} placeholder={ava} />
          </Form.Item>
          <Form.Item name="avatar" label="Avatar">
            <Space
              style={{ display: "flex", justifyContent: "flex-center" }}
              size={16}
              wrap
            >
              {ava.indexOf("http") >= 0 ? (
                <Avatar src={ava} />
              ) : (
                <Avatar icon={<UserOutlined />} />
              )}
            </Space>
          </Form.Item>
          <Form.Item name="role" label="Role">
            <Input disabled placeholder={currentUser.role} />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 5, span: 10 }}>
            <Button type="primary" htmlType="submit">
              Submit Changes
            </Button>
            {currentUser.role !== "admin" && (
              <DeleteOutlined
                style={{ fontSize: "32px", color: "red" }}
                onClick={handleDelete}
              />
            )}
          </Form.Item>
        </Form>
      </div>
      {currentUser.role === "admin" && (
        <Row>
          <Col span={18}>
            <div style={{ marginLeft: "15px", marginBottom: "15px" }}>
              <Title level={3}>Manage Hotel Vacancy Details</Title>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleCreateHotel}
                style={{ marginBottom: "16px" }}
              >
                Add New Hotel
              </Button>
              <Table
                columns={columns}
                dataSource={hotels}
                rowKey="id"
                loading={loading}
                pagination={{ pageSize: 5 }}
              />
            </div>
          </Col>
        </Row>
      )}
      <Row>
        <Col span={18}>
          <div style={{ marginLeft: "15px", marginBottom: "15px" }}>
            {currentUser.role === "admin" && (
              <SearchUser authbasic={`${localStorage.getItem("aToken")}`} />
            )}
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={18}>
          <div style={{ marginLeft: "15px", marginBottom: "15px" }}>
            <ImageUpload />
          </div>
        </Col>
      </Row>
      {currentUser.role === "admin" && (
        <>
          <Modal
            title="Create New Hotel"
            visible={isCreateModalVisible}
            onCancel={() => setIsCreateModalVisible(false)}
            footer={null}
          >
            <EditForm isNew={true} />
          </Modal>
          <Modal
            title="Update Hotel Info"
            visible={isUpdateModalVisible}
            onCancel={() => setIsUpdateModalVisible(false)}
            footer={null}
          >
            {selectedHotel && <EditForm isNew={false} aid={selectedHotel.id} />}
          </Modal>
        </>
      )}
    </>
  );
};

export default Profile;
