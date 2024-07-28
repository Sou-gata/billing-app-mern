import { useState } from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload, Select, Modal } from "antd";
import axios from "axios";
import { baseProductsUrl, pad } from "../utils";

const ImportExcel = () => {
    const [uploading, setUploading] = useState(false);
    const [selected, setSelected] = useState("add");
    const [fileList, setFileList] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [backup, setBackup] = useState({
        date: "",
        found: false,
    });

    const deleteAll = async () => {
        try {
            const res = await axios.delete(baseProductsUrl + "/delete/all", {
                withCredentials: true,
            });
            return res.data;
        } catch (error) {}
    };
    const addData = async () => {
        const formData = new FormData();
        fileList.forEach((file) => {
            formData.append("file", file);
        });
        try {
            const res = await axios.post(baseProductsUrl + "/add/excel", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            });
            if (res.data?.success) {
                setFileList([]);
                message.success("upload successfully.");
            } else {
                message.error(res.data?.message);
            }
        } catch (error) {
            message.error(error.response?.data?.errors?.errorResponse?.message || "upload failed.");
        } finally {
            setUploading(false);
        }
    };

    const handleUpload = async () => {
        if (fileList.length === 0) {
            message.error("Please select a file to upload.");
            return;
        }
        setUploading(true);

        if (selected === "add") {
            await addData();
        } else if (selected === "over") {
            try {
                let res = await axios.get(baseProductsUrl + "/backup-present", {
                    withCredentials: true,
                });
                if (res.data.success && res.data.message !== "Backup not present") {
                    let date = new Date(res.data.data.mtime);
                    let day = date.getDate();
                    let month = date.getMonth() + 1;
                    let year = date.getFullYear();
                    let h = date.getHours();
                    let m = date.getMinutes();
                    let s = date.getSeconds();

                    date = `${pad(day)}-${pad(month)}-${year} ${pad(h)}:${pad(m)}:${pad(s)}`;
                    setBackup({ date, found: true });
                } else {
                    setBackup({ date: "", found: false });
                }
                setIsOpen(true);
            } catch (error) {
                message.error(
                    error.response.data?.errors?.errorResponse?.message || "upload failed."
                );
            } finally {
                setUploading(false);
            }
        }
    };
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

    const handleChange = (value) => setSelected(value);

    return (
        <div className="p-3 w-full">
            <div className="w-full flex flex-col justify-center items-center gap-4 pt-6">
                <div className="flex items-center gap-4">
                    <p>Choose data addition method</p>
                    <Select
                        defaultValue="add"
                        style={{
                            width: 200,
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: "add",
                                label: "Add to existing data",
                            },
                            {
                                value: "over",
                                label: "Clear and overwrite",
                            },
                        ]}
                    />
                </div>
                <div className="flex flex-col justify-center items-center mt-6">
                    <Upload {...props} accept=".xls,.xlsx">
                        <button className="w-52 h-10 rounded-md border-gray-400 border flex items-center justify-center gap-3 hover:border-blue-500 hover:text-blue-600">
                            <div className="text-lg">
                                <UploadOutlined />
                            </div>
                            Select Excel File
                        </button>
                    </Upload>
                    <Button
                        type="primary"
                        onClick={handleUpload}
                        disabled={fileList.length === 0}
                        loading={uploading}
                        style={{
                            marginTop: 16,
                        }}
                    >
                        {uploading ? "Uploading" : "Start Upload"}
                    </Button>
                </div>
                <Modal
                    title="Overwrite Warning"
                    open={isOpen}
                    onOk={async () => {
                        setIsOpen(false);
                        if (selected === "over") {
                            const data = await deleteAll();
                            if (data.success) {
                                await addData();
                            } else {
                                message.error(data.message);
                            }
                        }
                    }}
                    onCancel={() => {
                        setIsOpen(false);
                    }}
                >
                    {selected == "over" && (
                        <>
                            {backup.found ? (
                                <p>Backup found on {backup.date}</p>
                            ) : (
                                <p>No backup found</p>
                            )}
                            <p>Do you want to continue?</p>
                        </>
                    )}
                </Modal>
            </div>
        </div>
    );
};

export default ImportExcel;
