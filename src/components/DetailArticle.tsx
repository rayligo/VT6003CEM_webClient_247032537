import "antd/dist/reset.css";
import React from "react";
import EditForm from "./EditForm";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Spin, Col, Card } from "antd";
import { api } from "./common/http-common";
import axios from "axios";
import {
  RollbackOutlined,
  LoadingOutlined,
  CloseSquareOutlined,
  CloseSquareFilled,
  EditFilled,
} from "@ant-design/icons";
import { getCurrentUser } from "../services/auth.service";

const DetailArticle = () => {
  const currentUser = getCurrentUser();
  const { aid } = useParams();
  const [article, setArticle] = React.useState({
    id: 0,
    title: "",
    alltext: "",
    summary: "",
    imageurl: "",
    authorid: 0,
    description: "",
  });
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(true);
  const [theme, setTheme] = React.useState("outlined");

  React.useEffect(() => {
    console.log(`path: ${api.uri}/articles/${aid}`);
    axios
      .get(`${api.uri}/articles/${aid}`)
      .then((res) => {
        //  console.log('article' ,article)
        setArticle(res.data);
        localStorage.setItem("e", JSON.stringify(res.data));
        setLoading(false);
      })
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log("Error fetching article details ");
        // console.error('Error fetching article details:', error);
      });
  }, [aid]);

  function getIcon(theme: string) {
    let Icon;

    if (theme === "filled") Icon = CloseSquareFilled;
    else Icon = CloseSquareOutlined;
    return Icon;
  }

  const handleDelete = () => {
    setTheme("filled");
    // console.log('fav link arr ', fav.links.fav)
    // console.log('fav link ', fav)
    axios
      .delete(`${api.uri}/articles/${aid}`, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("aToken")}`,
        },
      })
      .then((results) => {
        console.log("respone ", JSON.stringify(results.data.message));
        if (results.data.message === "removed") {
          alert("This article is removed from the blog list");
          navigate("/");
          window.location.reload();
        }
      })
      .catch((err) => {
        console.log(`Check network problems pls. `);
        alert("Check network problems");
      });
  };

  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 48 }} spin />;
    return <Spin indicator={antIcon} />;
  } else {
    const Icon = getIcon(theme);
    return (
      <>
        <Col span={24}>
          <Card
            title={article.title}
            hoverable
            actions={[
              currentUser &&
                currentUser.role === "admin" &&
                currentUser.id === article.authorid && (
                  <EditForm isNew={false} aid={aid} />
                ),
              currentUser &&
                currentUser.role === "admin" &&
                currentUser.id === article.authorid && (
                  <Icon
                    style={{ fontSize: "32px" }}
                    onClick={() => handleDelete()}
                  />
                ),
            ]}
          >
            <div>
              {" "}
              <p>Hotel Details:</p>
              <p>{article.alltext}</p>
              <p>Summary:</p>
              <p>{article.summary}</p>
              <p>Description:</p>
              <p>{article.description}</p>
              <Button
                type="primary"
                icon={<RollbackOutlined />}
                onClick={() => navigate("/")}
              />
            </div>
          </Card>
        </Col>
      </>
    );
  }
};

export default DetailArticle;
