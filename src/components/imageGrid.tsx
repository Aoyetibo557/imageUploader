import React from "react";
import { Image, Skeleton, Dropdown, Menu } from "antd";
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

const ImageGrid: React.FC<ImageGridProps> = ({
  images,
  loading,
  onDeleteRequest,
  onRename,
}) => {
  const getMenuItems = (img: ImageType): MenuProps["items"] => [
    {
      key: "rename",
      label: "Rename",
      onClick: () => onRename(img),
    },
    {
      key: "delete",
      label: "Delete",
      danger: true,
      onClick: () => onDeleteRequest(img),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-4 mt-8">
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
        : images.map((img) => {
            return (
              <div key={img.id} className="flex flex-col gap-3">
                <Image
                  width={350}
                  height={200}
                  src={img.url}
                  alt={img.name}
                  style={{ objectFit: "cover", borderRadius: 8 }}
                />
                <div className="flex justify-between items-start w-[350px]">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{img.name}</span>
                    <span className="text-sm text-gray-500">
                      {formatDate(img.uploadDate)}
                    </span>
                  </div>
                  <Dropdown
                    menu={{ items: getMenuItems(img) }}
                    trigger={["click"]}>
                    <DashOutlined className="cursor-pointer text-lg" />
                  </Dropdown>
                </div>
              </div>
            );
          })}
    </div>
  );
};

export default ImageGrid;
