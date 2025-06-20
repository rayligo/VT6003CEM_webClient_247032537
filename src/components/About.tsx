import { Row, Col, Typography, Divider } from "antd";
import "../App.css";

const { Title, Paragraph } = Typography;

const About = () => {
  return (
    <div className="content">
      <Row justify="start" gutter={[16, 16]}>
        <Col xs={24} sm={24} md={20} lg={18}>
          <Title level={2} style={{ textAlign: "left", marginBottom: "16px" }}>
            About Wanderlust Travel's Hotels Agent
          </Title>
          <Divider style={{ borderColor: "#e8e8e8" }} />
          <Paragraph style={{ textAlign: "left", fontSize: "16px" }}>
            Welcome to Wanderlust Travel’s Hotels Agent, your premier
            destination for discovering hotel accommodations. Our Hotels Agent
            is part of a React-based Single Page Application, bringing the world
            of hotels to users everywhere.
          </Paragraph>
          <Paragraph style={{ textAlign: "left", fontSize: "16px" }}>
            With Wanderlust Travel, experience a platform connected to global
            hotel networks, offering a glimpse into real-time hotel worlds. It’s
            designed with care, reflecting a commitment to creating a welcoming
            space for all travelers.
          </Paragraph>
        </Col>
      </Row>
    </div>
  );
};

export default About;
