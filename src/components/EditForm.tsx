import "antd/dist/reset.css";
import React, { useState } from "react";
import { NavigateFunction, useNavigate } from "react-router-dom";
import { Form, Input, Button, Modal, Typography, Upload, message } from "antd";
import { EditOutlined, EditFilled, UploadOutlined } from "@ant-design/icons";
import axios from "axios";
import { api } from "./common/http-common";
import { getCurrentUser } from "../services/auth.service";

const { Title } = Typography;
const { TextArea } = Input;

const EditForm: React.FC = (props: any) => {
  const navigate: NavigateFunction = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [fileList, setFileList] = useState<any[]>([]);
  const [imageUrl, setImageUrl] = useState<string>(
    props.isNew
      ? ""
      : JSON.parse(localStorage.getItem("e") || "{}")?.imageurl || ""
  );
  const [form] = Form.useForm();
  const currentUser = getCurrentUser();

  const contentRules = [{ required: true, message: "Please input something" }];

  const handleUpload = async () => {
    if (!fileList.length) {
      message.error("Please select an image to upload.");
      return null;
    }

    const formData = new FormData();
    formData.append("upload", fileList[0].originFileObj);

    setLoading(true);

    try {
      const response = await axios.post(`${api.uri}/images`, formData, {
        headers: {
          Authorization: `Basic ${localStorage.getItem("aToken")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setLoading(false);

      if (response.data.links?.path) {
        message.success("Image uploaded successfully.");
        setImageUrl(response.data.links.path);
        form.setFieldsValue({ imageurl: response.data.links.path });
        return response.data.links.path;
      } else {
        message.error("Image upload failed: No URL returned.");
        console.error("Upload response:", response.data);
        return null;
      }
    } catch (error: any) {
      setLoading(false);
      message.error(`Image upload failed: ${error.message}`);
      console.error("Error uploading image:", error.response?.data || error);
      return null;
    }
  };

  const handleFormSubmit = async (values: any) => {
    if (!currentUser) {
      message.error("Please log in to proceed.");
      navigate("/login");
      return;
    }

    let u = imageUrl;

    if (fileList.length > 0) {
      const uploadedUrl = await handleUpload();
      if (!uploadedUrl) {
        message.error("Failed to upload image. Aborting form submission.");
        return;
      }
      u = uploadedUrl;
    }

    if (!u && props.isNew) {
      message.error("Please upload an image for the new hotel.");
      return;
    }

    const postArticle = {
      title: values.title,
      alltext: values.alltext,
      summary: values.summary || "",
      description: values.description || "",
      imageurl: u,
      authorid: currentUser.id,
      published: false,
    };

    setLoading(true);

    try {
      if (!props.isNew) {
        console.log(`Updating article at: ${api.uri}/articles/${props.aid}`);
        await axios.put(`${api.uri}/articles/${props.aid}`, postArticle, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        });
        message.success("Article updated successfully.");
        localStorage.removeItem("e");
      } else {
        console.log(`Creating article at: ${api.uri}/articles`);
        await axios.post(`${api.uri}/articles`, postArticle, {
          headers: {
            Authorization: `Basic ${localStorage.getItem("aToken")}`,
          },
        });
        message.success("New hotel created successfully.");
      }
      navigate("/");
      window.location.reload();
    } catch (err: any) {
      message.error(
        `Failed to save article: ${err.response?.data?.message || err.message}`
      );
      console.error("Error saving article:", err.response?.data || err);
    } finally {
      setLoading(false);
    }
  };

  const uploadProps = {
    onRemove: () => {
      setFileList([]);
    },
    beforeUpload: (file: File) => {
      const isImage = file.type.startsWith("image/");
      if (!isImage) {
        message.error("You can only upload image files!");
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error("Image must be smaller than 2MB!");
        return Upload.LIST_IGNORE;
      }
      setFileList([{ ...file, originFileObj: file }]);
      return false;
    },
    fileList,
  };

  return (
    <>
      <Button
        type="primary"
        icon={props.isNew ? <EditOutlined /> : <EditFilled />}
        onClick={() => setIsShow(true)}
      >
        {props.isNew ? "Create New Hotel" : "Edit Hotel"}
      </Button>
      <Modal
        open={isShow}
        onCancel={() => {
          setIsShow(false);
          setFileList([]);
          form.resetFields();
        }}
        title="Hotel Agent Admin Page"
        footer={[]}
      >
        <Form
          form={form}
          name="hotel_form"
          layout="vertical"
          initialValues={
            props.isNew ? {} : JSON.parse(localStorage.getItem("e") || "{}")
          }
          onFinish={handleFormSubmit}
        >
          <Title level={5}>
            {props.isNew ? "Create New Hotel" : "Edit Hotel"}
          </Title>

          <Form.Item
            name="title"
            label="Hotel Name"
            rules={[{ required: true, message: "Please enter the hotel name" }]}
          >
            <Input placeholder="Enter hotel name" />
          </Form.Item>

          <Form.Item
            label="Upload Hotel Image"
            extra={
              props.isNew
                ? "Upload an image to set the Image URL automatically."
                : ""
            }
            rules={
              props.isNew
                ? [{ required: true, message: "Please upload an image" }]
                : []
            }
          >
            <Upload {...uploadProps} listType="picture-card">
              {fileList.length === 0 && (
                <Button type="primary" icon={<UploadOutlined />}>
                  Upload Image
                </Button>
              )}
            </Upload>
            <Button
              type="primary"
              onClick={handleUpload}
              disabled={!fileList.length || loading}
              loading={loading}
              style={{ marginTop: 8 }}
            >
              Start Upload
            </Button>
          </Form.Item>

          <Form.Item
            name="imageurl"
            label="Image URL"
            rules={[{ required: true, message: "Image URL is required" }]}
          >
            <Input
              placeholder="Image URL will be set automatically after upload"
              disabled={imageUrl || props.isNew}
            />
          </Form.Item>

          <Form.Item
            name="alltext"
            label="Hotel Details"
            rules={[{ required: true, message: "Please enter hotel details" }]}
          >
            <TextArea rows={4} placeholder="Enter hotel details" />
          </Form.Item>

          <Form.Item
            name="summary"
            label="Summary"
            rules={[{ required: false }]}
          >
            <TextArea rows={2} placeholder="Enter summary (optional)" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: false }]}
          >
            <TextArea rows={4} placeholder="Enter description (optional)" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default EditForm;
