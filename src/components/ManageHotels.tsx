import React, { useState, useEffect, useCallback } from "react";
import { getCurrentUser } from "../services/auth.service";
import { NavigateFunction, useNavigate } from "react-router-dom";
import axios from "axios";
import { api } from "./common/http-common";
import { Button, Table, Modal, Typography, Space } from "antd";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import EditForm from "./EditForm";

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

const ManageHotels: React.FC = () => {
  const currentUser = getCurrentUser();
  const navigate: NavigateFunction = useNavigate();
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isUpdateModalVisible, setIsUpdateModalVisible] = useState(false);
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null);

  useEffect(() => {
    if (currentUser?.role === "admin") {
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
      navigate("/");
      setLoading(false);
    }
  }, [currentUser?.role, navigate]);

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
  );
};

export default ManageHotels;
