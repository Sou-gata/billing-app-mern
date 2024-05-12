import { Alert, Modal, Select, Upload, message } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";

const BackupRestore = () => {
    const [backup, setBackup] = useState({
        method: "internal",
        type: "json",
    });
    const [restore, setRestore] = useState({
        method: "internal",
        type: "json",
    });

    const [fileList, setFileList] = useState([]);

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList(newFileList);
        },
        beforeUpload: (file) => {
            setFileList([file]);
            return false;
        },
        fileList,
    };

    const [isOpen, setIsOpen] = useState(false);
    const handleBackup = async () => {
        if (backup.method === "internal") {
            try {
                const res = await axios.get("http://localhost:7684/api/v1/products/backup");
                if (res.data.success) {
                    message.success("Backup successful");
                } else {
                    message.error("Backup failed");
                }
            } catch (error) {
                message.error(error.response?.data?.message || "Backup failed");
            }
        } else if (backup.method === "external") {
            if (backup.type === "json") {
                try {
                    axios
                        .get("http://localhost:7684/api/v1/products/backup/json")
                        .then((resData) => {
                            const downloadUrl = window.URL.createObjectURL(
                                new Blob([JSON.stringify(resData.data)])
                            );
                            const link = document.createElement("a");
                            link.href = downloadUrl;
                            link.setAttribute("download", "backup.json");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        });
                } catch (error) {
                    message.error(error.response?.data?.message || "Backup failed");
                }
            } else if (backup.type === "excel") {
                try {
                    axios
                        .get("http://localhost:7684/api/v1/products/backup/excel", {
                            responseType: "blob",
                        })
                        .then((resData) => {
                            const downloadUrl = window.URL.createObjectURL(
                                new Blob([resData.data], {
                                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                                })
                            );
                            const link = document.createElement("a");
                            link.href = downloadUrl;
                            link.setAttribute("download", "backup.xlsx");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        })
                        .catch(() => {
                            message.error(error.response?.data?.message || "Backup failed");
                        });
                } catch (error) {
                    message.error(error.response?.data?.message || "Backup failed");
                }
            }
        }
    };
    const handleRestore = async () => {
        try {
            if (restore.method == "internal") {
                const res = await axios.get("http://localhost:7684/api/v1/products/restore");
                if (res.data.success) {
                    message.success("Restore successful");
                } else {
                    message.error("Restore failed");
                }
            } else if (restore.method == "external") {
                if (fileList.length === 0) {
                    message.error("Please select a file to restore");
                    return;
                }
                const formData = new FormData();
                fileList.forEach((file) => {
                    formData.append("file", file);
                });
                const url =
                    restore.type == "json"
                        ? "http://localhost:7684/api/v1/products/restore/json"
                        : "http://localhost:7684/api/v1/products/restore/excel";
                const res = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.data.success) {
                    setFileList([]);
                    message.success("Restore successful");
                } else {
                    message.error("Restore failed");
                }
            }
        } catch (error) {
            message.error(error.response?.data?.message || "Restore failed");
        }
    };
    const handleClear = async () => {
        try {
            const res = await axios.delete("http://localhost:7684/api/v1/products/delete/all");
            if (res.data.success) {
                message.success("Database cleared successfully");
            } else {
                message.error("Database clear failed");
            }
        } catch (error) {
            console.log(error);
            message.error("Database clear failed");
        }
    };

    return (
        <div className="w-full p-4">
            <Alert
                message="Take a backup of database"
                type="success"
                className="text-center font-bold text-xl capitalize"
            />
            <div className="mt-4 ">
                <div className="flex items-center w-full justify-center gap-4">
                    <p>Select backup method: </p>
                    <Select
                        defaultValue="internal"
                        style={{
                            width: 150,
                        }}
                        onChange={(value) => {
                            setBackup((prev) => {
                                return { ...prev, method: value };
                            });
                        }}
                        options={[
                            {
                                value: "internal",
                                label: "Internal",
                            },
                            {
                                value: "external",
                                label: "External",
                            },
                        ]}
                    />
                    {backup.method === "external" && (
                        <Select
                            defaultValue="json"
                            style={{
                                width: 150,
                            }}
                            onChange={(value) => {
                                setBackup((prev) => {
                                    return { ...prev, type: value };
                                });
                            }}
                            options={[
                                {
                                    value: "json",
                                    label: "JSON",
                                },
                                {
                                    value: "excel",
                                    label: "Excel",
                                },
                            ]}
                        />
                    )}
                    <button
                        onClick={handleBackup}
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0"
                    >
                        Backup
                    </button>
                </div>
            </div>

            <Alert
                message="Restore Backup"
                type="warning"
                className="mt-4 text-center font-bold text-xl capitalize"
            />
            <div className="flex items-center w-full justify-center gap-4 mt-4">
                <p>Select restore method: </p>
                <Select
                    defaultValue="internal"
                    style={{
                        width: 150,
                    }}
                    onChange={(value) => {
                        setRestore((prev) => {
                            return { ...prev, method: value };
                        });
                    }}
                    options={[
                        {
                            value: "internal",
                            label: "Internal",
                        },
                        {
                            value: "external",
                            label: "External",
                        },
                    ]}
                />
                {restore.method == "external" && (
                    <>
                        <Select
                            defaultValue="json"
                            style={{
                                width: 150,
                            }}
                            onChange={(value) => {
                                setFileList([]);
                                setRestore((prev) => {
                                    return { ...prev, type: value };
                                });
                            }}
                            options={[
                                {
                                    value: "json",
                                    label: "JSON",
                                },
                                {
                                    value: "excel",
                                    label: "Excel",
                                },
                            ]}
                        />

                        <Upload {...props} accept={restore.type == "json" ? ".json" : ".xls,.xlsx"}>
                            <button className="w-40 h-8 rounded-md border-gray-400 border flex items-center justify-center gap-3 hover:border-blue-500 hover:text-blue-600">
                                <div className="text-lg">
                                    <UploadOutlined />
                                </div>
                                Select {restore.type == "json" ? "JSON" : "Excel"} File
                            </button>
                        </Upload>
                    </>
                )}

                <button
                    onClick={handleRestore}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0"
                >
                    Restore
                </button>
            </div>
            <Alert
                message="Clear full database"
                type="error"
                className="mt-4 text-center font-bold text-xl capitalize"
            />
            <div className="flex items-center w-full justify-center gap-4 flex-col">
                <p className="mt-4">
                    <span className="font-bold">Warning:</span> This action cannot be undone
                </p>
                <p>
                    <span className="font-bold">Note:</span> We recommended to take a internal
                    backup before clear
                </p>
                <button
                    onClick={() => setIsOpen(true)}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0"
                >
                    Clear
                </button>
            </div>
            <Modal
                title="Confirmation"
                onCancel={() => {
                    setIsOpen(false);
                }}
                onOk={async () => {
                    await handleClear();
                    setIsOpen(false);
                }}
                okType="danger"
                open={isOpen}
            >
                <p>Are you sure you want to continue?</p>
            </Modal>
        </div>
    );
};

export default BackupRestore;
