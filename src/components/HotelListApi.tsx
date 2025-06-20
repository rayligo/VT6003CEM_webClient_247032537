import React, { useEffect, useState } from "react";
import { Card, Col, Row, Spin, message, Typography, Input } from "antd";
import axios from "axios";
import { api } from "./common/http-common";
import { getCurrentUser } from "../services/auth.service";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;
const { Search } = Input;

interface HotelLocation {
  id: string;
  cityName: string;
  fullName: string;
  hotelsCount: string;
  countryName: string;
  countryCode: string;
  location: {
    lat: string;
    lon: string;
  };
  iata: string[];
  _score: number;
}

const HotelListApi: React.FC = () => {
  const [hotels, setHotels] = useState<HotelLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Current User:", currentUser);
    console.log("Token:", localStorage.getItem("aToken"));

    if (!currentUser) {
      message.error("Please log in to view hotel listings.");
      navigate("/login");
      return;
    }
  }, [currentUser]);

  useEffect(() => {
    console.log("call fetchHotels()");
    fetchHotels(searchQuery);
  }, [searchQuery]);

  const fetchHotels = async (query: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${api.uri}/hotel`,
        { hotelName: query },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        }
      );
      console.log("API Response:", response.data);

      if (response.data.status === "success") {
        const locations = response.data.data.results?.locations || [];
        console.log("Locations:", locations);
        setHotels(locations);
      } else {
        setError("Failed to fetch hotel data.");
        message.error("Failed to fetch hotel data.");
      }
    } catch (error: any) {
      console.error("Error fetching hotels:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "An error occurred while fetching hotel data.";
      setError(errorMessage);
      message.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value.trim());
  };

  if (loading) {
    return (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Title level={2}>Hotel Locations</Title>
      <Search
        placeholder="Search hotels by city or name"
        onSearch={handleSearch}
        style={{ marginBottom: 16, width: 300 }}
        enterButton
      />
      {hotels.length === 0 ? (
        <div>No hotels available for the current search.</div>
      ) : (
        <Row gutter={16}>
          {hotels.map((hotel) => (
            <Col span={8} key={hotel.id}>
              <Card title={hotel.cityName || "Unknown City"} hoverable>
                <p>Full Name: {hotel.fullName || "N/A"}</p>
                <p>Hotels Available: {hotel.hotelsCount || "N/A"}</p>
                <p>Country: {hotel.countryName || "N/A"}</p>
                <p>
                  Coordinates: ({hotel.location?.lat || "N/A"},{" "}
                  {hotel.location?.lon || "N/A"})
                </p>
                <p>IATA Codes: {hotel.iata?.join(", ") || "N/A"}</p>
                <p>Score: {hotel._score || "N/A"}</p>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HotelListApi;
