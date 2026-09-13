import { useEffect, useState } from "react";
import { Button, Input, List, message, Modal, Spin, Upload } from "antd";
import {
  InboxOutlined,
  DownloadOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import axios from "axios";
import * as graphql from "./graphql";
import { Card, Container, Scroll, Text } from "./Components";

const { Dragger } = Upload;

interface FileShareProps {
  room: graphql.GetJoinedRoomsQuery["user_room"][0]["room"] | undefined;
  handleClose: () => void;
}

const fetchFileList = async (roomUUID: string) => {
  try {
    const response = await axios.get("/file/list?room=" + roomUUID);
    return response.data.fileList;
  } catch (error) {
    console.error(error);
    message.error("获取文件列表失败！");
    return [];
  }
};

const downloadFile = async (roomUUID: string, filename: string) => {
  try {
    message.info("正在请求下载...");
    const response = await axios.get(
      "/file/download?room=" + roomUUID + "&filename=" + filename
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    message.success("开始下载文件！");
  } catch (error) {
    console.error(error);
    message.error("下载文件失败！");
  }
};

const deleteFile = async (roomUUID: string, filename: string) => {
  await axios.post("/file/delete", { room: roomUUID, filename });
};

const FileShare: React.FC<FileShareProps> = ({ room, handleClose }) => {
  const [fileList, setFileList] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (room) {
      fetchFileList(room.uuid).then(setFileList);
    }
  }, [room]);

  const uploadFile = async (file: File, onSuccess: any, onError: any) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("/file/upload/" + room?.uuid, formData);
      await fetchFileList(room?.uuid).then(setFileList);
      message.success("上传文件成功！");
      onSuccess?.();
    } catch (error) {
      console.error(error);
      message.error("上传文件失败！");
      onError?.(error as Error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    if (room) {
      fetchFileList(room.uuid).then(setFileList);
    }
    setTimeout(() => setRefreshing(false), 1000);
  };

  const Refresh = () => (
    <Button
      type="link"
      style={{
        width: "40px",
        height: "40px",
        fontSize: "16px",
        position: "absolute",
        left: 0,
        top: 0,
      }}
      className="need-interaction"
      onClick={handleRefresh}
    >
      <ReloadOutlined spin={refreshing} />
    </Button>
  );

  const Close = () => (
    <Button
      type="link"
      style={{
        width: "40px",
        height: "40px",
        fontSize: "12px",
        position: "absolute",
        right: 0,
        top: 0,
      }}
      className="need-interaction"
      onClick={handleClose}
    >
      ❌
    </Button>
  );

  if (!room) {
    return null;
  }
  const visibleFiles = fileList.filter((filename) =>
    filename.toLocaleLowerCase().includes(searchTerm.toLocaleLowerCase())
  );
  return (
    <Card style={{ width: "300px", height: "500px" }}>
      <Refresh />
      <Close />
      <Container style={{ margin: "6px" }}>
        <Text>
          <strong>{room.name}</strong>
        </Text>
        <Text size="small" style={{ marginTop: "6px", marginBottom: "6px" }}>
          文件共享空间
        </Text>
      </Container>
      <Input
        className="need-interaction"
        placeholder="搜索文件名"
        allowClear
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        style={{ marginBottom: "8px" }}
      />
      <Text size="small" style={{ display: "block", marginBottom: "4px" }}>
        显示 {visibleFiles.length} / {fileList.length} 个文件
      </Text>
      <FileList
        roomUUID={room.uuid}
        filelist={visibleFiles}
        onDeleted={(filename) => setFileList((current) => current.filter((item) => item !== filename))}
      />
      <div
        className="need-interaction"
        style={{ marginTop: "12px", width: "100%" }}
      >
        <Dragger
          customRequest={({ file, onSuccess, onError }) => {
            uploadFile(file as File, onSuccess, onError);
          }}
          showUploadList={false}
          disabled={loading}
        >
          <p className="ant-upload-drag-icon">
            {loading ? <Spin size="large" /> : <InboxOutlined />}
          </p>
          <p className="ant-upload-text">拖拽或点击上传文件</p>
        </Dragger>
      </div>
    </Card>
  );
};

interface FileListProps {
  roomUUID: string;
  filelist: string[];
  onDeleted: (filename: string) => void;
}

const FileList: React.FC<FileListProps> = ({ roomUUID, filelist, onDeleted }) => {
  const Download = (filename: string) => (
    <Button
      type="link"
      style={{ fontSize: "18px", width: "18px", height: "18px", padding: 0 }}
      onClick={async () => await downloadFile(roomUUID, filename)}
    >
      <DownloadOutlined />
    </Button>
  );
  const Delete = (filename: string) => (
    <Button
      type="link"
      danger
      style={{ fontSize: "18px", width: "18px", height: "18px", padding: 0 }}
      onClick={() => {
        Modal.confirm({
          title: "删除文件",
          content: `确定删除“${filename}”吗？`,
          okText: "删除",
          okType: "danger",
          cancelText: "取消",
          onOk: async () => {
            try {
              await deleteFile(roomUUID, filename);
              onDeleted(filename);
              message.success("文件已删除");
            } catch (error) {
              console.error(error);
              message.error("删除文件失败");
            }
          },
        });
      }}
    >
      <DeleteOutlined />
    </Button>
  );
  return (
    <Scroll>
      {filelist.length === 0 ? (
        <Text size="small">没有匹配的文件</Text>
      ) : (
        <List
          size="small"
          dataSource={filelist}
          renderItem={(filename) => (
            <List.Item style={{ padding: "8px" }} actions={[Download(filename), Delete(filename)]}>
              <Text style={{ wordBreak: "break-all" }}>{filename}</Text>
            </List.Item>
          )}
        />
      )}
    </Scroll>
  );
};

export default FileShare;
