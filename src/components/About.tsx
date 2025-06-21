import "antd/dist/reset.css";
import { Row, Col, Typography, Divider, Card } from "antd";
import "../App.css";

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <img
            src="/src/assets/Wanderlust_Travelsmall.png"
            alt="Wanderlust Travel"
            className="h-20 mx-auto mb-4"
          />
          <Title level={1} className="text-white !mb-4">
            About Wanderlust Travel
          </Title>
          <Paragraph className="text-lg max-w-2xl mx-auto text-white">
            Your premier destination for discovering hotel accommodations
            worldwide, powered by a React-based Single Page Application.
          </Paragraph>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <Row gutter={[24, 24]} justify="center">
          <Col xs={24} md={16}>
            <Card className="shadow-lg rounded-lg" bordered={false}>
              <Title level={3} className="text-indigo-600">
                Our Mission
              </Title>
              <Paragraph className="text-gray-600">
                At Wanderlust Travel, we strive to connect travelers with the
                perfect hotel experiences. Our Hotels Agent platform is designed
                to provide seamless access to global hotel networks, offering
                real-time insights into accommodations worldwide.
              </Paragraph>
              <Divider />
              <Title level={3} className="text-indigo-600">
                Why Choose Us?
              </Title>
              <Paragraph className="text-gray-600">
                With a commitment to user-friendly design and cutting-edge
                technology, Wanderlust Travel delivers a welcoming space for all
                travelers. Whether you're planning a business trip or a
                leisurely getaway, our platform ensures you find the ideal stay
                with ease.
              </Paragraph>
            </Card>
          </Col>
        </Row>

        {/* Features Section */}
        <Row gutter={[24, 24]} className="mt-12">
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="text-center"
              bordered={false}
              style={{ borderRadius: "12px" }}
            >
              <div className="text-4xl text-indigo-600 mb-4">🌍</div>
              <Title level={4}>Global Reach</Title>
              <Paragraph className="text-gray-500">
                Access a vast network of hotels across the globe, from luxury
                resorts to cozy boutiques.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="text-center"
              bordered={false}
              style={{ borderRadius: "12px" }}
            >
              <div className="text-4xl text-indigo-600 mb-4">⚡</div>
              <Title level={4}>Real-Time Data</Title>
              <Paragraph className="text-gray-500">
                Stay updated with live hotel availability and pricing for
                informed decision-making.
              </Paragraph>
            </Card>
          </Col>
          <Col xs={24} sm={12} lg={8}>
            <Card
              hoverable
              className="text-center"
              bordered={false}
              style={{ borderRadius: "12px" }}
            >
              <div className="text-4xl text-indigo-600 mb-4">🤝</div>
              <Title level={4}>Traveler-Centric</Title>
              <Paragraph className="text-gray-500">
                Designed with travelers in mind, offering intuitive navigation
                and personalized options.
              </Paragraph>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default About;
