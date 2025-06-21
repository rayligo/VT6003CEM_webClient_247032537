import "antd/dist/reset.css";
import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row, Spin, Typography } from "antd";
import { api } from "./common/http-common";
import axios from "axios";
import { LoadingOutlined } from "@ant-design/icons";
import PostIcon from "./posticon";
import Displaycomment from "./comments";
import { useDebounce } from "use-debounce";
import { Input } from "antd";

const { Search } = Input;
const { Title } = Typography;

const Article = () => {
  const [articles, setArticles] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch] = useDebounce(searchQuery, 300);

  React.useEffect(() => {
    axios
      .get(`${api.uri}/articles`)
      .then((res) => {
        setArticles(res.data);
        localStorage.setItem("a", JSON.stringify(res.data));
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching articles:", err);
        setLoading(false);
      });
  }, []);

  const filteredArticles = React.useMemo(() => {
    if (!debouncedSearch) return articles;

    const searchLower = debouncedSearch.toLowerCase();
    return articles.filter((article) =>
      Object.values(article).some((value) =>
        String(value).toLowerCase().includes(searchLower)
      )
    );
  }, [articles, debouncedSearch]);

  if (loading) {
    const antIcon = (
      <LoadingOutlined style={{ fontSize: 64, color: "#4f46e5" }} spin />
    );
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Spin indicator={antIcon} />
        <p className="mt-4 text-lg text-gray-600">Loading articles...</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <Title level={3} className="text-gray-600">
          No articles available at the moment.
        </Title>
        <p className="text-gray-500">
          Try{" "}
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            refreshing
          </Link>{" "}
          or check back later!
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-gradient-to-r from-indigo-500 to-purple-600 shadow-lg py-8 rounded-b-xl">
        <div className="container mx-auto px-4 flex justify-center">
          <Search
            placeholder="Search for articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            enterButton={<span className="font-semibold">Search</span>}
            size="large"
            className="w-full max-w-2xl bg-white rounded-lg shadow-md transition-all duration-300 hover:shadow-lg"
            aria-label="Search articles"
          />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12">
        <Row gutter={[32, 32]} className="animate-fade-in">
          {filteredArticles.map(({ id, title, imageurl, summary, links }) => (
            <Col span={12} key={id}>
              <Card
                hoverable
                className="card border-none overflow-hidden transform transition-transform duration-300 hover:scale-105"
                cover={
                  <img
                    alt={title}
                    src={imageurl}
                    className="h-56 w-full object-cover rounded-t-lg"
                  />
                }
                actions={[
                  <PostIcon
                    type="like"
                    countLink={links.likes}
                    id={id}
                    aria-label={`Like article ${title}`}
                  />,
                  <Displaycomment
                    msgLink={links.msg}
                    id={id}
                    aria-label={`Comment on article ${title}`}
                  />,
                  <PostIcon
                    type="heart"
                    FavLink={links.fav}
                    id={id}
                    aria-label={`Add article ${title} to favorites`}
                  />,
                ]}
              >
                <Card.Meta
                  title={
                    <span className="text-xl font-bold text-gray-800 line-clamp-2">
                      {title}
                    </span>
                  }
                  description={
                    <div>
                      <p className="text-gray-600 line-clamp-3 mb-4">
                        {summary || "No summary available."}
                      </p>
                      <div className="flex justify-center">
                        <Link
                          to={`/${id}`}
                          className="btn-primary inline-block font-semibold"
                          aria-label={`View details for ${title}`}
                        >
                          Read More
                        </Link>
                      </div>
                    </div>
                  }
                />
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default Article;
