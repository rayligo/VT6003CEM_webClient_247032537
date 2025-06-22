import { Button, List, Tooltip, Space, Input, Modal, Flex } from "antd";
import { Comment } from "@ant-design/compatible";
import {
  DeleteOutlined,
  DeleteFilled,
  MessageOutlined,
} from "@ant-design/icons";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { getCurrentUser } from "../services/auth.service";
import { NavigateFunction, useNavigate } from "react-router-dom";

const DisplayComment = (props: any) => {
  const [article_comments, setComments] = useState<any[]>([]);
  const [isShow, setIsShow] = useState(false);
  const currentUser = getCurrentUser();
  const navigate: NavigateFunction = useNavigate();

  const isLogin = !!currentUser;
  const isAdmin = currentUser?.role === "admin";

  useEffect(() => {
    axios
      .get(props.msgLink)
      .then((res) => {
        setComments(res.data);
        console.log("Number of comments:", res.data.length);
      })
      .catch((err) => {
        console.error(`Error fetching comments: ${err}`);
      });
  }, [props.msgLink]);

  const addComment = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (event.target as HTMLInputElement).value;
    if (value) {
      const raw = { messagetxt: value };
      axios
        .post(props.msgLink, raw, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        })
        .then((response) => {
          if (response.data.message === "added") {
            alert("Comment added");
            navigate("/");
            window.location.reload();
          } else {
            alert("Check database or network problems");
          }
        })
        .catch((err) => {
          console.error(`Error posting comment: ${props.msgLink} - ${err}`);
          alert("Check network problems");
        });
    }
  };

  const removeComm = (cid: number) => {
    if (cid) {
      axios
        .delete(props.msgLink, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
          data: { cid },
        })
        .then((response) => {
          if (response.data.message === "removed") {
            alert("This comment is removed by admin");
            navigate("/");
            window.location.reload();
          }
        })
        .catch((err) => {
          console.error(`Error deleting comment: ${props.id} - ${err}`);
          alert("Check network problems");
        });
    }
  };

  const getDeleteIcon = () => (isAdmin ? DeleteFilled : DeleteOutlined);

  return (
    <>
      <Button
        icon={<MessageOutlined />}
        onClick={() => setIsShow(true)}
        aria-label="Show comments"
      />
      <Modal
        open={isShow}
        onCancel={() => setIsShow(false)}
        title="Comments Page"
        footer={[]}
      >
        <List
          className="comment-list"
          itemLayout="horizontal"
          dataSource={article_comments}
          renderItem={(item: any) => (
            <Flex gap="middle" align="center" justify="flex-start">
              <li>
                <Comment
                  actions={[
                    isLogin && (
                      <span key="comment-basic-reply-to">
                        <a href={`mailto:${item.email}`}>Reply to</a>
                      </span>
                    ),
                    isAdmin && (
                      <span key="comment-delete">
                        {React.createElement(getDeleteIcon(), {
                          onClick: () => removeComm(item.cid),
                        })}
                      </span>
                    ),
                  ].filter(Boolean)} // Remove falsy values (e.g., when isLogin is false)
                  author={item.username}
                  content={item.messagetxt}
                  datetime={item.datemodified}
                />
              </li>
            </Flex>
          )}
        />
        <Input
          placeholder={
            isLogin
              ? "Enter your comment here"
              : "Pls. login to enter your comments here"
          }
          name="input_msg"
          disabled={!isLogin}
          allowClear
          onPressEnter={addComment}
        />
      </Modal>
    </>
  );
};

export default DisplayComment;
