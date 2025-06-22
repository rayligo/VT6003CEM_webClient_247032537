import "antd/dist/reset.css";
import { useState, useCallback } from "react";
import {
  Input,
  message,
  Typography,
  Card,
  Button,
  Space,
  Table,
  Select,
  Col,
  Popconfirm,
} from "antd";
import { api } from "./common/http-common";
import axios from "axios";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { DeleteOutlined, ReloadOutlined } from "@ant-design/icons";

const { Search } = Input;
const { Title } = Typography;
const { Option } = Select;

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
}

const SearchUser: React.FC<{ authbasic: string }> = ({ authbasic }) => {
  const navigate: NavigateFunction = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [usersData, setUsersData] = useState<User[]>([]);
  const [isSearchOK, setSearchOK] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchField, setSearchField] = useState("all");

  const onSearch = useCallback(
    async (value: string) => {
      setLoading(true);
      try {
        let urlPath = `${api.uri}/users`;
        if (searchField === "email" || searchField === "username") {
          urlPath += `/?fields=${searchField}&q=${value}`;
        } else if (searchField === "username&fields=email" && value === "") {
          urlPath += `/?fields=${searchField}`;
        }

        const response = await axios.get(urlPath, {
          headers: { Authorization: `Basic ${authbasic}` },
        });

        if (!response.data.length) {
          message.warning("No users found");
          setUsersData([]);
          setSearchOK(false);
          return;
        }

        setUsersData(response.data);
        setSearchOK(true);
        setSearchTerm("");
      } catch (err) {
        message.error("Failed to fetch users. Please check your network.");
        console.error("Error fetching users", err);
      } finally {
        setLoading(false);
      }
    },
    [searchField, authbasic, navigate]
  );

  const handleDelete = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        await axios.delete(`${api.uri}/users/${id}`, {
          headers: { Authorization: `Basic ${authbasic}` },
        });
        setUsersData(usersData.filter((user) => user.id !== id));
        message.success("User deleted successfully");
      } catch (err) {
        message.error("Failed to delete user. Please try again.");
        console.error("Delete error", err);
      } finally {
        setLoading(false);
      }
    },
    [usersData, authbasic]
  );

  const handleReset = () => {
    setSearchTerm("");
    setSearchField("all");
    setUsersData([]);
    setSearchOK(false);
    onSearch("");
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      sorter: (a: User, b: User) => a.id - b.id,
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Action",
      key: "action",
      render: (_: string, record: User) => (
        <Popconfirm
          title="Are you sure you want to delete this user?"
          onConfirm={() => handleDelete(record.id)}
          okText="Yes"
          cancelText="No"
        >
          {record.role !== "admin" && (
            <DeleteOutlined className="text-red-500 text-lg hover:text-red-700" />
          )}
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card className="shadow-sm">
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <Title level={3} className="!text-blue-600">
            Hotel Agents Management
          </Title>
          <Typography.Text type="secondary">
            Search and manage user accounts
          </Typography.Text>
        </div>
        <Space wrap>
          <Search
            placeholder="Search users by username or email"
            allowClear
            enterButton="Search"
            size="large"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onSearch={onSearch}
            style={{ width: 300 }}
            loading={loading}
          />
          <Select
            value={searchField}
            size="large"
            onChange={setSearchField}
            style={{ width: 250 }}
          >
            <Option value="username">Username</Option>
            <Option value="email">Email</Option>
            <Option value="username&fields=email">Username & Email</Option>
            <Option value="all">All Users</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={handleReset}
            size="large"
            type="default"
          >
            Reset
          </Button>
        </Space>
        {isSearchOK && (
          <Table
            dataSource={usersData}
            columns={columns}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
            className="mt-4"
          />
        )}
      </Space>
    </Card>
  );
};

export default SearchUser;
