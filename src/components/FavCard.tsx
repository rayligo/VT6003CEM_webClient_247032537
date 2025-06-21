import "antd/dist/reset.css";
import React from "react";
import { Link } from "react-router-dom";
import { Card, Col, Row, Spin, Typography } from "antd";
import { api } from "./common/http-common";
import axios from "axios";
import {
  LoadingOutlined,
  CloseSquareOutlined,
  CloseSquareFilled,
} from "@ant-design/icons";
import PostIcon from "./posticon";
import Displaycomment from "./comments";

const { Title } = Typography;

const FavCard = () => {
  const [articles, setArticles] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [theme, setTheme] = React.useState("outlined");
  const origin = JSON.parse(localStorage.getItem("a") || "[]");

  React.useEffect(() => {
    const config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `${api.uri}/articles/fav`,
      headers: {
        Authorization: `Basic ${localStorage.getItem("aToken")}`,
      },
    };

    axios
      .request(config)
      .then((results) => {
        const filterArticle = filterPosts(results.data, origin);
        setArticles(filterArticle);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching favorites:", err);
        setLoading(false);
      });
  }, []);

  function getIcon(theme: string) {
    return theme === "filled" ? CloseSquareFilled : CloseSquareOutlined;
  }

  function filterPosts(filterarray: any[], originarray: any[]) {
    const resArr = [];
    for (let i = 0; i < filterarray.length; i++) {
      for (let j = 0; j < originarray.length; j++) {
        if (filterarray[i].articleid === originarray[j].id) {
          resArr.push(originarray[j]);
          break;
        }
      }
    }
    return resArr;
  }

  const handleDelete = ({ links }) => {
    setTheme("filled");
    axios
      .delete(links.fav, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("aToken")}`,
        },
      })
      .then((results) => {
        if (results.data.message === "removed") {
          alert("This article is removed from your favorite list");
          axios
            .get(`${api.uri}/articles/fav`, {
              headers: {
                Authorization: `Basic ${localStorage.getItem("aToken")}`,
              },
            })
            .then((res) => {
              setArticles(filterPosts(res.data, origin));
            });
        }
      })
      .catch((err) => {
        console.error("Network error:", err);
        alert("Check network problems");
      });
  };

  if (loading) {
    const antIcon = (
      <LoadingOutlined style={{ fontSize: 64, color: "#4f46e5" }} spin />
    );
    return (
      <div className="flex flex-col justify-center items-center h-[50vh]">
        <Spin indicator={antIcon} />
        <p className="mt-4 text-lg text-gray-600">Loading favorites...</p>
      </div>
    );
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-[50vh] text-center">
        <Title level={3} className="text-gray-600">
          No favorite articles yet.
        </Title>
        <p className="text-gray-500">
          Add some favorites from the{" "}
          <Link to="/" className="text-indigo-600 hover:text-indigo-800">
            articles page
          </Link>
          !
        </p>
      </div>
    );
  }

  const Icon = getIcon(theme);

  return (
    <Row gutter={[32, 32]} className="animate-fade-in">
      {articles.map(({ id, title, alltext, imageurl, links }) => (
        <Col span={24} key={id}>
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
              <Icon
                onClick={() => handleDelete({ links })}
                aria-label={`Remove article ${title} from favorites`}
                className="text-red-500 hover:text-red-700"
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
                    {alltext || "No summary available."}
                  </p>
                  <div className="flex justify-center space-x-4">
                    <Link
                      className="text-indigo-600 hover:text-indigo-800 font-medium"
                      to={`/${id}`}
                      className="btn-primary inline-block font-semibold"
                      aria-label={`Read more about ${title}`}
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
  );
};

export default FavCard;
