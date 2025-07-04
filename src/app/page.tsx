"use client";
import React, { useState, useEffect, useCallback } from "react";
import SearchBar from "../components/searchbar";
import UploadModal from "../components/uploadModal";
import ImageGrid from "../components/imageGrid";
import { Image, ImageUpload } from "../types/index";
import { imageService } from "../services/api";
import { Button, Modal, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function Home() {
  const [searchVal, setSearchVal] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [images, setImages] = useState<Image[]>([]);
  const [showUpload, setShowUpload] = useState<boolean>(false);
  const [imageToDelete, setImageToDelete] = useState<Image | null>(null);

  const [messageApi, contextHolder] = message.useMessage();

  const loadImages = async () => {
    try {
      setLoading(true);
      const data = await imageService.getAllImages();
      setImages(data);
    } catch (err) {
      console.error("Error loading images", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback((term: string) => {
    setSearchVal(term);
  }, []);

  const handleDelete = async (id: number) => {
    try {
      setLoading(true);
      await imageService.deleteImage(id);
      messageApi.success("Image deleted successfully!");
      await loadImages();
    } catch (err) {
      messageApi.error("Failed to delete image.");
      console.error(err);
    } finally {
      setLoading(false);
      setImageToDelete(null);
    }
  };

  const handleRename = async (image: Image) => {
    // first open renameing modal then do this
    await imageService.renameImage(image);
  };

  const handleUploadImages = async (newImages: ImageUpload[]) => {
    for (const img of newImages) {
      await imageService.uploadImage(img);
    }
    await loadImages();
  };

  const filteredImages = images.filter((img) =>
    img.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  useEffect(() => {
    loadImages();
  }, []);

  return (
    <div className="bg-white w-full text-black min-h-screen p-8 space-y-8">
      {contextHolder}
      <div className="flex justify-between items-center w-[100%] pr-3 sticky top-0 h-15 bg-white z-50">
        <SearchBar onSearch={handleSearch} searchTerm={searchVal} />
        <Button
          icon={<UploadOutlined />}
          type="primary"
          onClick={() => setShowUpload(true)}
          className="flex items-center">
          <span className="hidden sm:inline ml-2">Upload Image</span>
        </Button>
      </div>

      {!loading && filteredImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-20 text-center space-y-4">
          <h2 className="text-lg font-semibold">No images found</h2>
          <p className="text-gray-500">
            {`You haven't uploaded any images yet. Click below to get started.`}
          </p>
          <Button
            icon={<UploadOutlined />}
            type="primary"
            onClick={() => setShowUpload(true)}>
            Upload Image
          </Button>
        </div>
      ) : (
        <ImageGrid
          images={filteredImages}
          onDeleteRequest={(img) => setImageToDelete(img)}
          onRename={handleRename}
          loading={loading}
        />
      )}

      <UploadModal
        visible={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUploadImages}
      />

      <Modal
        title="Delete Image"
        open={!!imageToDelete}
        onOk={() => imageToDelete && handleDelete(imageToDelete.id)}
        onCancel={() => setImageToDelete(null)}
        okText={loading ? "Deleting..." : "Delete"}
        okButtonProps={{ danger: true }}
        cancelText="Cancel">
        <p>Are you sure you want to delete this image?</p>
        <span className="mb-4 text-sm text-red-500">
          Warning: This action is irreversible. Deleted images cannot be
          recovered.
        </span>
      </Modal>
    </div>
  );
}
