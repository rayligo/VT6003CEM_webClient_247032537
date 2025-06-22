import React, { useState, useEffect } from "react";
import {
  Card,
  Col,
  Row,
  Spin,
  message,
  Typography,
  Form,
  Input,
  Button,
  Select,
} from "antd";
import axios from "axios";
import { api } from "./common/http-common";
import { getCurrentUser } from "../services/auth.service";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import "../App.css";

const { Title } = Typography;
const { Option } = Select;

interface Flight {
  departure_time: string;
  arrival_time: string;
  duration: { raw: number; text: string };
  flights: {
    departure_airport: {
      airport_name: string;
      airport_code: string;
      time: string;
    };
    arrival_airport: {
      airport_name: string;
      airport_code: string;
      time: string;
    };
    airline: string;
    airline_logo: string;
    flight_number: string;
    aircraft: string;
    legroom: string;
    extensions: string[];
  }[];
  price: number;
  carbon_emissions: { CO2e: number; difference_percent: number };
  airline_logo: string;
}

interface Hotel {
  id: string;
  location: { lat: number; lon: number };
  locationName: string;
  fullName: string;
  label: string;
  price: number;
}

interface TravelPackage {
  flight: Flight;
  hotel: Hotel;
}

const PackageList: React.FC = () => {
  const [packages, setPackages] = useState<TravelPackage[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      message.error("Please log in to view travel packages.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const fetchPackages = async (params: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${api.uri}/flightPackage`,
        {
          departure_id: params.departure_id,
          arrival_id: params.arrival_id,
          outbound_date: params.outbound_date,
          return_date: params.return_date,
          travel_class: params.travel_class,
          adults: params.adults,
          show_hidden: params.show_hidden ? 1 : 0,
          currency: params.currency,
          language_code: params.language_code,
          country_code: params.country_code,
          hotelName: params.hotelName,
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        }
      );

      if (response.data.status === "success") {
        setPackages(response.data.data);
        message.success(
          response.data.data.length
            ? "Packages fetched successfully."
            : "No packages found for the current search."
        );
      } else {
        message.error("Failed to fetch package data.");
        setPackages([]);
      }
    } catch (error: any) {
      console.error("Error fetching packages:", error);
      message.error(
        error.response?.data?.message ||
          "An error occurred while fetching package data."
      );
      setPackages([]);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    fetchPackages(values);
  };

  const FlightCard = ({ flight }: { flight: Flight }) => {
    const flightDetails = flight.flights[0];
    return (
      <Card className="card">
        <div className="flex items-center mb-2">
          <img
            src={flight.airline_logo}
            alt={flightDetails.airline}
            className="w-8 h-8 mr-2"
          />
          <h3 className="text-lg font-semibold">
            {flightDetails.airline} {flightDetails.flight_number}
          </h3>
        </div>
        <p>
          <strong>From:</strong> {flightDetails.departure_airport.airport_name}{" "}
          ({flightDetails.departure_airport.airport_code})
        </p>
        <p>
          <strong>To:</strong> {flightDetails.arrival_airport.airport_name} (
          {flightDetails.arrival_airport.airport_code})
        </p>
        <p>
          <strong>Depart:</strong> {flight.departure_time}
        </p>
        <p>
          <strong>Arrive:</strong> {flight.arrival_time}
        </p>
        <p>
          <strong>Duration:</strong> {flight.duration.text}
        </p>
        <p>
          <strong>Aircraft:</strong> {flightDetails.aircraft}
        </p>
        <p>
          <strong>Legroom:</strong> {flightDetails.legroom}
        </p>
        <p>
          <strong>Price:</strong> {flight.price} {values.currency || "HKD"}
        </p>
        <p>
          <strong>Emissions:</strong> {flight.carbon_emissions.CO2e / 1000} kg
          CO2e ({flight.carbon_emissions.difference_percent}% vs typical)
        </p>
        <p className="text-sm text-gray-600 mt-2">
          <strong>Amenities:</strong> {flightDetails.extensions.join(", ")}
        </p>
      </Card>
    );
  };

  const HotelCard = ({ hotel }: { hotel: Hotel }) => (
    <Card className="card">
      <h3 className="text-lg font-semibold">{hotel.label}</h3>
      <p>
        <strong>Location:</strong> {hotel.fullName}
      </p>
      <p>
        <strong>Price:</strong> {hotel.price} {values.currency || "HKD"}
      </p>
      <p>
        <strong>Coordinates:</strong> Lat {hotel.location.lat}, Lon{" "}
        {hotel.location.lon}
      </p>
    </Card>
  );

  const PackageCard = ({ pkg }: { pkg: TravelPackage }) => (
    <Card className="card mb-6 animate-fade-in">
      <h2 className="text-xl font-bold mb-4">Travel Package</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <FlightCard flight={pkg.flight} />
        </Col>
        <Col xs={24} md={12}>
          <HotelCard hotel={pkg.hotel} />
        </Col>
      </Row>
      <p className="text-lg font-semibold mt-4">
        Total Price: {pkg.flight.price + pkg.hotel.price}{" "}
        {values.currency || "HKD"}
      </p>
    </Card>
  );

  const values = form.getFieldsValue();

  return (
    <div className="container mx-auto px-4 py-8">
      <Title level={2} className="text-center mb-8">
        Hotel and Flight Packages
      </Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          departure_id: "HKG",
          arrival_id: "HND",
          outbound_date: "2025-07-22",
          return_date: "2025-07-29",
          travel_class: "ECONOMY",
          adults: 1,
          show_hidden: true,
          currency: "HKD",
          language_code: "en-US",
          country_code: "HK",
          hotelName: "Japan",
        }}
        className="mb-8 max-w-2xl mx-auto"
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12}>
            <Form.Item name="departure_id" label="Departure Airport">
              <Input placeholder="e.g., HKG" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="arrival_id" label="Arrival Airport">
              <Input placeholder="e.g., HND" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="outbound_date" label="Outbound Date">
              <Input type="date" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="return_date" label="Return Date">
              <Input type="date" size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="travel_class" label="Travel Class">
              <Select size="large">
                <Option value="ECONOMY">Economy</Option>
                <Option value="PREMIUM_ECONOMY">Premium Economy</Option>
                <Option value="BUSINESS">Business</Option>
                <Option value="FIRST">First</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="adults" label="Adults">
              <Input type="number" min={1} size="large" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="currency" label="Currency">
              <Select size="large">
                <Option value="HKD">HKD</Option>
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="JPY">JPY</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={24} sm={12}>
            <Form.Item name="hotelName" label="Hotel Location">
              <Input placeholder="e.g., Japan" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            size="large"
            className="btn-primary w-full"
          >
            Search Packages
          </Button>
        </Form.Item>
      </Form>

      {loading ? (
        <div className="text-center">
          <Spin indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />} />
        </div>
      ) : (
        <Row gutter={[16, 16]}>
          {packages.length === 0 ? (
            <Col span={24}>
              <Card className="card">
                <p>No packages available for the current search.</p>
                <p className="text-sm text-gray-600">
                  Note: Try adjusting your search parameters.
                </p>
              </Card>
            </Col>
          ) : (
            packages.map((pkg, index) => (
              <Col span={24} key={index}>
                <PackageCard pkg={pkg} />
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default PackageList;
