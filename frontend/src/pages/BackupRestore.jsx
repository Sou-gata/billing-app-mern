import { Alert, Modal, Select, Upload, message } from "antd";
import React, { useState } from "react";
import axios from "axios";
import { UploadOutlined } from "@ant-design/icons";
import { baseBillsUrl, baseProductsUrl } from "../utils";

const BackupRestore = () => {
    const [backup, setBackup] = useState({
        products: { method: "internal", type: "json" },
        bills: { method: "internal" },
    });
    const [restore, setRestore] = useState({
        products: { method: "internal", type: "json" },
        bills: { method: "internal" },
    });

    const [fileList, setFileList] = useState({ products: [], bills: [] });

    const props = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList((prev) => {
                return { ...prev, products: newFileList };
            });
        },
        beforeUpload: (file) => {
            setFileList((prev) => {
                return { ...prev, products: [file] };
            });
            return file;
        },
    };
    const props2 = {
        onRemove: (file) => {
            const index = fileList.indexOf(file);
            const newFileList = fileList.slice();
            newFileList.splice(index, 1);
            setFileList((prev) => {
                return { ...prev, bills: newFileList };
            });
        },
        beforeUpload: (file) => {
            setFileList((prev) => {
                return { ...prev, bills: [file] };
            });
            return file;
        },
        fileList: fileList.bills,
    };

    const [isOpen, setIsOpen] = useState(false);
    const handleBackup = async () => {
        if (backup.products.method === "internal") {
            try {
                const res = await axios.get(baseProductsUrl + "/backup");
                if (res.data.success) {
                    message.success("Backup successful");
                } else {
                    message.error("Backup failed");
                }
            } catch (error) {
                message.error(error.response?.data?.message || "Backup failed");
            }
        } else if (backup.products.method === "external") {
            if (backup.products.type === "json") {
                try {
                    axios.get(baseProductsUrl + "/backup/json").then((resData) => {
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
            } else if (backup.products.type === "excel") {
                try {
                    axios
                        .get(baseProductsUrl + "/backup/excel", {
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
            if (restore.products.method == "internal") {
                const res = await axios.get(baseProductsUrl + "/restore");
                if (res.data.success) {
                    message.success("Restore successful");
                } else {
                    message.error("Restore failed");
                }
            } else if (restore.products.method == "external") {
                if (fileList.products.length === 0) {
                    message.error("Please select a file to restore");
                    return;
                }
                const formData = new FormData();
                fileList.products.forEach((file) => {
                    formData.append("file", file);
                });
                const url =
                    restore.products.type == "json"
                        ? baseProductsUrl + "/restore/json"
                        : baseProductsUrl + "/restore/excel";
                const res = await axios.post(url, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.data.success) {
                    setFileList((prev) => {
                        return { ...prev, products: [] };
                    });
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
            const res = await axios.delete(baseProductsUrl + "/delete/all");
            if (res.data.success) {
                message.success("Database cleared successfully");
            } else {
                message.error("Database clear failed");
            }
        } catch (error) {
            message.error("Database clear failed");
        }
    };

    const handleBillBackup = async () => {
        if (backup.bills.method == "internal") {
            try {
                const res = await axios.get(baseBillsUrl + "/internal-backup");
                if (res.data.success) {
                    message.success("Backup successful");
                } else {
                    message.error("Backup failed");
                }
            } catch (error) {
                message.error(error.response?.data?.message || error.message || "Backup failed");
            }
        } else {
            try {
                axios.get(baseBillsUrl + "/external-backup").then((resData) => {
                    const downloadUrl = window.URL.createObjectURL(
                        new Blob([JSON.stringify(resData.data)])
                    );
                    const link = document.createElement("a");
                    link.href = downloadUrl;
                    link.setAttribute("download", "backup_bill.json");
                    document.body.appendChild(link);
                    link.click();
                    link.remove();
                });
            } catch (error) {
                message.error(error.response?.data?.message || error.message || "Backup failed");
            }
        }
    };
    const handleBillRestore = async () => {
        if (restore.bills.method == "internal") {
            try {
                const res = await axios.get(baseBillsUrl + "/restore-internal-backup");
                if (res.data.success) {
                    message.success("Restore successful");
                } else {
                    message.error("Restore failed");
                }
            } catch (error) {
                message.error("Restore failed");
            }
        } else {
            if (fileList.bills.length === 0) {
                message.error("Please select a file to restore");
                return;
            }
            try {
                const formData = new FormData();
                fileList.bills.forEach((file) => {
                    formData.append("file", file);
                });
                const res = await axios.post(baseBillsUrl + "/restore-external-backup", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });
                if (res.data.success) {
                    setFileList((prev) => {
                        return { ...prev, bills: [] };
                    });
                    message.success("Restore successful");
                } else {
                    message.error("Restore failed");
                }
            } catch (error) {
                message.error(error.response?.data?.message || "Restore failed");
            }
        }
    };
    const handleClearBills = async () => {
        try {
            const res = await axios.delete(baseBillsUrl + "/delete-all");
            if (res.data.success) {
                message.success("Database cleared successfully");
            } else {
                message.error("Database clear failed");
            }
        } catch (error) {
            message.error("Database clear failed");
        }
    };

    return (
        <div className="w-full p-4 flex gap-8">
            <div className="w-1/2 px-4 pb-8 pt-4 rounded-lg border-black/25 border">
                <div className="flex items-center justify-center mb-4">
                    <Alert
                        message="Products"
                        type="info"
                        className="font-bold text-xl min-w-44 text-center"
                    />
                </div>
                <Alert
                    message="Backup"
                    type="success"
                    className="text-center font-bold text-xl capitalize"
                />
                <div className="mt-4 ">
                    <div className="flex items-center w-full justify-center gap-4">
                        <p className="text-center">Select backup method: </p>
                        <Select
                            defaultValue="internal"
                            style={{
                                width: 150,
                            }}
                            onChange={(value) => {
                                setBackup((prev) => {
                                    return {
                                        ...prev,
                                        products: { ...prev.products, method: value },
                                    };
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
                        {backup.products.method === "external" && (
                            <Select
                                defaultValue="json"
                                style={{
                                    width: 125,
                                }}
                                onChange={(value) => {
                                    setBackup((prev) => {
                                        return {
                                            ...prev,
                                            products: { ...prev.products, type: value },
                                        };
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
                    message="Restore"
                    type="warning"
                    className="mt-4 text-center font-bold text-xl capitalize"
                />
                <div className="flex items-center w-full justify-center gap-4 mt-4">
                    <p>Select restore method: </p>
                    <Select
                        defaultValue="internal"
                        style={{
                            width: 110,
                        }}
                        onChange={(value) => {
                            setRestore((prev) => {
                                return { ...prev, products: { ...prev.products, method: value } };
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
                    {restore.products.method == "external" && (
                        <>
                            <Select
                                defaultValue="json"
                                style={{
                                    width: 110,
                                }}
                                onChange={(value) => {
                                    setFileList((prev) => {
                                        return { ...prev, products: [] };
                                    });
                                    setRestore((prev) => {
                                        return {
                                            ...prev,
                                            products: { ...prev.products, type: value },
                                        };
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

                            <Upload
                                {...props}
                                fileList={fileList.products || []}
                                accept={restore.products.type == "json" ? ".json" : ".xls,.xlsx"}
                            >
                                <button className="w-40 h-8 rounded-md border-gray-400 border flex items-center justify-center gap-3 hover:border-blue-500 hover:text-blue-600">
                                    <div className="text-lg">
                                        <UploadOutlined />
                                    </div>
                                    Select {restore.products.type == "json" ? "JSON" : "Excel"} File
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
                <div className="flex items-center w-full justify-center gap-1 flex-col">
                    <p className="mt-4 text-sm">
                        <span className="font-bold text-base">Warning:</span> This action can't be
                        undone
                    </p>
                    <p className="text-sm">
                        <span className="font-bold text-base">Note:</span> We recommended to take a
                        backup before clear
                    </p>
                    <button
                        onClick={() =>
                            setIsOpen((prev) => {
                                return { ...prev, products: true };
                            })
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0 mt-3 min-w-24"
                    >
                        Clear
                    </button>
                </div>
            </div>
            <div className="w-1/2 px-4 pb-8 pt-4 rounded-lg border-black/25 border">
                <div className="flex items-center justify-center mb-4">
                    <Alert
                        message="Bills"
                        type="info"
                        className="font-bold text-xl min-w-44 text-center"
                    />
                </div>
                <Alert
                    message="Backup"
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
                                    return {
                                        ...prev,
                                        bills: { ...prev.products, method: value },
                                    };
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
                        <button
                            onClick={handleBillBackup}
                            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0"
                        >
                            Backup
                        </button>
                    </div>
                </div>

                <Alert
                    message="Restore"
                    type="warning"
                    className="mt-4 text-center font-bold text-xl capitalize"
                />
                <div className="flex items-center w-full justify-center gap-4 mt-4">
                    <p>Select restore method: </p>
                    <Select
                        defaultValue="internal"
                        style={{
                            width: 120,
                        }}
                        onChange={(value) => {
                            setRestore((prev) => {
                                return {
                                    ...prev,
                                    bills: { ...prev.bills, method: value },
                                };
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
                    {restore.bills.method == "external" && (
                        <>
                            <Upload {...props2} accept=".json">
                                <button className="w-40 h-8 rounded-md border-gray-400 border flex items-center justify-center gap-3 hover:border-blue-500 hover:text-blue-600">
                                    <div className="text-lg">
                                        <UploadOutlined />
                                    </div>
                                    Select JSON File
                                </button>
                            </Upload>
                        </>
                    )}

                    <button
                        onClick={handleBillRestore}
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
                <div className="flex items-center w-full justify-center gap-1 flex-col">
                    <p className="mt-4 text-sm">
                        <span className="font-bold text-base">Warning:</span> This action can't be
                        undone
                    </p>
                    <p className="text-sm">
                        <span className="font-bold text-base">Note:</span> We recommended to take a
                        backup before clear
                    </p>
                    <button
                        onClick={() =>
                            setIsOpen((prev) => {
                                return { ...prev, bills: true };
                            })
                        }
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0 mt-3 min-w-24"
                    >
                        Clear
                    </button>
                </div>
            </div>
            <Modal
                title="Confirmation"
                onCancel={() => {
                    setIsOpen((prev) => {
                        return { ...prev, products: false };
                    });
                }}
                onOk={async () => {
                    await handleClear();
                    setIsOpen((prev) => {
                        return { ...prev, products: false };
                    });
                }}
                okType="danger"
                open={isOpen.products}
            >
                <p>Are you sure you want to continue?</p>
            </Modal>
            <Modal
                title="Confirmation"
                onCancel={() => {
                    setIsOpen((prev) => {
                        return { ...prev, bills: false };
                    });
                }}
                onOk={async () => {
                    await handleClearBills();
                    setIsOpen((prev) => {
                        return { ...prev, bills: false };
                    });
                }}
                okType="danger"
                open={isOpen.bills}
            >
                <p>Are you sure you want to continue?</p>
            </Modal>
        </div>
    );
};

export default BackupRestore;
