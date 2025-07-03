import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Modal, Upload, message, Button, Image } from "antd";
import { UploadOutlined, InboxOutlined } from "@ant-design/icons";
import type { UploadFile, UploadProps } from "antd";

const { Dragger } = Upload;

type FileType = File;

interface UploadModalProps {
  visible: boolean;
  onClose: () => void;
  onUpload: (images: { name: string; url: string }[]) => Promise<void>;
}

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadModal: React.FC<UploadModalProps> = ({
  visible,
  onClose,
  onUpload,
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleUpload = async () => {
    if (fileList.length === 0) return;

    setIsUploading(true);
    messageApi.loading("Uploading images...", 0);

    try {
      const base64Images = await Promise.all(
        fileList.map(async (file) => {
          const base64 = await getBase64(file.originFileObj as File);
          return {
            id: uuidv4(),
            name: file.name,
            url: base64,
            uploadDate: new Date().toISOString(),
          };
        })
      );

      const res = await onUpload(base64Images);
      messageApi.destroy();
      messageApi.success("Images uploaded successfully.");
      setFileList([]);
      onClose();
    } catch (err) {
      messageApi.destroy();
      messageApi.error("Upload failed.");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    name: "file",
    multiple: true,
    accept: "image/*",
    fileList,
    beforeUpload: (file) => false, // prevent auto-upload
    onChange: async (info) => {
      const filesWithPreview = await Promise.all(
        info.fileList.map(async (file) => {
          if (!file.url && !file.preview && file.originFileObj) {
            file.preview = await getBase64(file.originFileObj as File);
          }
          return file;
        })
      );
      setFileList(filesWithPreview);
    },
    onDrop: (e) => {
      console.log("Dropped files", e.dataTransfer.files);
    },
    listType: "picture-card",
  };

  // cleanup to avoid memory leaks on delete
  useEffect(() => {
    return () => {
      fileList.forEach((file) => {
        if (file.originFileObj) {
          URL.revokeObjectURL(URL.createObjectURL(file.originFileObj));
        }
      });
    };
  }, [fileList]);

  return (
    <>
      {contextHolder}
      <Modal
        title="Upload Images"
        open={visible}
        onOk={handleUpload}
        onCancel={onClose}
        width={600}
        okText={isUploading ? "Uploading..." : "Upload"}
        okButtonProps={{ disabled: fileList.length === 0 || isUploading }}
        cancelText="Cancel">
        <p className="mb-4">Select one or multiple images to upload:</p>
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Click or drag images to this area to upload
          </p>
          <p className="ant-upload-hint">
            Support for bulk upload. Only image files.
          </p>
        </Dragger>
      </Modal>
    </>
  );
};

export default UploadModal;
