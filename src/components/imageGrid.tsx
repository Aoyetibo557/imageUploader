import React, { useState, useEffect } from "react";
import { Image, Skeleton, Dropdown, Pagination } from "antd";
import { DashOutlined } from "@ant-design/icons";
import { Image as ImageType } from "../types/index";
import type { MenuProps } from "antd";

interface ImageGridProps {
  images: ImageType[];
  loading: boolean;
  onDeleteRequest: (img: ImageType) => void;
  onRename: (img: ImageType) => void;
}

export const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  if (isNaN(date.getTime())) return "Invalid date";
  return date.toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const truncate = (
  str: string,
  maxLength: number = 50,
  suffix: string = "..."
): string => {
  if (!str) return "";
  if (str.length <= maxLength) return str;

  return str.substring(0, maxLength - suffix.length) + suffix;
};

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  loading,
  onDeleteRequest,
  onRename,
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 15;

  useEffect(() => {
    setCurrentPage(1);
  }, [images]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getMenuItems = (img: ImageType): MenuProps["items"] => [
    {
      key: "rename",
      label: "Rename",
      disabled: true,
      onClick: () => onRename(img),
    },
    {
      key: "delete",
      label: "Delete",
      danger: true,
      onClick: () => onDeleteRequest(img),
    },
  ];

  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return images.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(images.length / pageSize);
  const currentImages = getPaginatedData();

  return (
    <div>
      <div
        className="grid grid-cols-1 sm:grid-cols-4 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8"
        role="grid"
        aria-label={`Image gallery, showing ${currentImages.length} of ${images.length} images`}>
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
              <div key={key} className="flex flex-col gap-3">
                <Skeleton.Image
                  active={true}
                  style={{ width: 350, height: 200 }}
                />
                <Skeleton.Input
                  active={true}
                  size="small"
                  style={{ width: 150 }}
                />
                <Skeleton.Input
                  active={true}
                  size="small"
                  style={{ width: 100 }}
                />
              </div>
            ))
          : currentImages.map((img) => {
              return (
                <div key={img.id} className="flex flex-col gap-3">
                  <Image
                    width="100%"
                    height={200}
                    src={img.url}
                    alt={`${img.name} - uploaded ${formatDate(img.uploadDate)}`}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col">
                      <span
                        className="text-sm font-medium"
                        aria-label={`Image name: ${img.name}`}>
                        {truncate(img.name, 35)}
                      </span>
                      <span
                        className="text-sm text-gray-500"
                        aria-label={`Upload date: ${formatDate(
                          img.uploadDate
                        )}`}>
                        {formatDate(img.uploadDate)}
                      </span>
                    </div>
                    <Dropdown
                      menu={{ items: getMenuItems(img) }}
                      trigger={["click"]}>
                      <button
                        className="cursor-pointer text-lg border-none bg-transparent p-1 hover:bg-gray-100 rounded"
                        aria-label={`Open menu for ${img.name}`}
                        aria-expanded="false">
                        <DashOutlined />
                      </button>
                    </Dropdown>
                  </div>
                </div>
              );
            })}
      </div>
      {images && images.length > pageSize && (
        <Pagination
          current={currentPage}
          align="center"
          total={images?.length}
          responsive={true}
          onChange={handlePageChange}
          pageSize={pageSize}
          className="mt-16"
          aria-label={`Page ${currentPage} of ${totalPages}`}
        />
      )}
    </div>
  );
};

export default ImageGrid;
