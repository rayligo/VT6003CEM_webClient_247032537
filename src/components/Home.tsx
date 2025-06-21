import "antd/dist/reset.css";
import "../App.css";
import Article from "./Articles";
import { Typography, Row, Col } from "antd";

const { Title } = Typography;

const Home = () => {
  return (
    <div className="py-8">
      <Row justify="center">
        <Col xs={24} md={16}>
          <Title level={2} className="text-center text-indigo-700 mb-8">
            Discover Your Next Adventure with Wanderlust Travel
          </Title>
          <Article />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
