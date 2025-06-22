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
  id: string;
  airline: string;
  price: number;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  currency: string;
  flightNumber: string;
  stops: number;
}

const FlightListApi: React.FC = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const currentUser = getCurrentUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      message.error("Please log in to view flight listings.");
      navigate("/login");
    }
  }, [currentUser, navigate]);

  const fetchFlights = async (params: any) => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${api.uri}/flights`,
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
        },
        {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        }
      );

      if (response.data.status === "success") {
        const topFlights =
          response.data.data?.data?.itineraries?.topFlights || [];
        const otherFlights =
          response.data.data?.data?.itineraries?.otherFlights || [];

        // Map API response to Flight interface
        const mappedFlights: Flight[] = [...topFlights, ...otherFlights].map(
          (flight, index) => ({
            id: `${flight.flights[0].flight_number}-${index}`, // Generate unique ID
            airline: flight.flights[0].airline,
            price: flight.price,
            departureTime: flight.departure_time,
            arrivalTime: flight.arrival_time,
            duration: flight.duration.text,
            currency: params.currency, // Use requested currency
            flightNumber: flight.flights[0].flight_number,
            stops: flight.stops,
          })
        );

        setFlights(mappedFlights);
        message.success(
          mappedFlights.length
            ? "Flights fetched successfully."
            : "No flights found for the current search."
        );
      } else {
        message.error("Failed to fetch flight data.");
        setFlights([]);
      }
    } catch (error: any) {
      console.error("Error fetching flights:", error);
      message.error(
        error.response?.data?.message ||
          "An error occurred while fetching flight data."
      );
      setFlights([]);
    } finally {
      setLoading(false);
    }
  };

  const onFinish = (values: any) => {
    fetchFlights(values);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <Title level={2}>Flight Search</Title>
      <Form
        form={form}
        onFinish={onFinish}
        layout="vertical"
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
        }}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="departure_id"
              label="Departure Airport"
              rules={[
                { required: true, message: "Please enter departure airport" },
              ]}
            >
              <Input placeholder="e.g., HKG" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="arrival_id"
              label="Arrival Airport"
              rules={[
                { required: true, message: "Please enter arrival airport" },
              ]}
            >
              <Input placeholder="e.g., HND" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="outbound_date"
              label="Departure Date"
              rules={[
                { required: true, message: "Please select departure date" },
              ]}
            >
              <Input type="date" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="return_date" label="Return Date">
              <Input type="date" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="travel_class"
              label="Travel Class"
              rules={[
                { required: true, message: "Please select travel class" },
              ]}
            >
              <Select>
                <Option value="ECONOMY">Economy</Option>
                <Option value="PREMIUM_ECONOMY">Premium Economy</Option>
                <Option value="BUSINESS">Business</Option>
                <Option value="FIRST">First</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="adults"
              label="Adults"
              rules={[
                { required: true, message: "Please enter number of adults" },
              ]}
            >
              <Input type="number" min={1} />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="currency"
              label="Currency"
              rules={[{ required: true, message: "Please select currency" }]}
            >
              <Select>
                <Option value="HKD">HKD</Option>
                <Option value="USD">USD</Option>
                <Option value="EUR">EUR</Option>
                <Option value="JPY">JPY</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="show_hidden"
              label="Show Hidden Fares"
              valuePropName="checked"
            >
              <Input type="checkbox" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="btn-primary"
            loading={loading}
          >
            Search Flights
          </Button>
        </Form.Item>
      </Form>

      {loading ? (
        <Spin indicator={<LoadingOutlined style={{ fontSize: 64 }} spin />} />
      ) : (
        <Row gutter={[32, 32]}>
          {flights.length === 0 ? (
            <Col span={24}>
              <p>No flights available for the current search.</p>
              <p style={{ color: "#555", fontStyle: "italic" }}>
                Note: Return flights may not be available in this response.
              </p>
            </Col>
          ) : (
            flights.map((flight) => (
              <Col span={12} key={flight.id}>
                <Card
                  hoverable
                  className="card"
                  title={`${flight.airline} Flight ${flight.flightNumber}`}
                >
                  <p>
                    Price: {flight.price} {flight.currency}
                  </p>
                  <p>Departure: {flight.departureTime}</p>
                  <p>Arrival: {flight.arrivalTime}</p>
                  <p>Duration: {flight.duration}</p>
                  <p>Stops: {flight.stops === 0 ? "Non-stop" : flight.stops}</p>
                </Card>
              </Col>
            ))
          )}
        </Row>
      )}
    </div>
  );
};

export default FlightListApi;
