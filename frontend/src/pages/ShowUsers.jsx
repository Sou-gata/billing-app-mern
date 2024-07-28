import { useState, useContext, useEffect } from "react";
import axios from "axios";
import { message, Button, Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { Context } from "../data/Context";
import { baseUserUrl, formatDateTime } from "../utils";

const ShowUsers = () => {
    const { users, setUsers } = useContext(Context);
    const [isOpen, setIsOpen] = useState({ state: false, id: "" });
    const navigate = useNavigate();
    useEffect(() => {
        async function getData() {
            try {
                const res = await axios.get(`${baseUserUrl}/all`, {
                    withCredentials: true,
                });
                if (res.data.success) {
                    setUsers(res.data.data);
                }
            } catch (error) {
                console.log(error);
            }
        }
        getData();
    }, [users.length]);
    return (
        <div className="p-4">
            <table className="border text-center">
                <tr className="font-bold">
                    <td className="capitalize border p-2">Name</td>
                    <td className="border p-2">Mobile</td>
                    <td className="capitalize border p-2">Role</td>
                    <td className="border p-2">Status</td>
                    <td className="border p-2">Created By</td>
                    <td className="border p-2">Updated By</td>
                    <td className="border p-2">Created At</td>
                    <td className="border p-2">Updated At</td>
                    <td className="border p-2">Edit</td>
                    <td className="border p-2">Delete</td>
                </tr>
                {users.map((user) => (
                    <tr key={user._id}>
                        <td className="capitalize border p-2">{user.name}</td>
                        <td className="border p-2">{user.mobile}</td>
                        <td className="capitalize border p-2">{user.role}</td>
                        <td className="border p-2">{user.isActive ? "Active" : "Deactive"}</td>
                        <td className="border p-2">
                            {user.createdBy?.name
                                ? `${user.createdBy?.name} (${user.createdBy?.mobile})`
                                : "Unknown"}
                        </td>
                        <td className="border p-2">
                            {user.updatedBy?.name
                                ? `${user.updatedBy?.name} (${user.updatedBy?.mobile})`
                                : "Unknown"}
                        </td>
                        <td className="border p-2">{formatDateTime(user?.createdAt)}</td>
                        <td className="border p-2">{formatDateTime(user?.updatedAt)}</td>
                        <td className="border p-2">
                            <Button
                                type="primary"
                                onClick={() => {
                                    navigate(`/user/edit/${user._id}`);
                                }}
                            >
                                Edit
                            </Button>
                        </td>
                        <td className="border p-2">
                            <Button
                                type="primary"
                                danger
                                onClick={() => {
                                    setIsOpen({ state: true, id: user._id });
                                }}
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                ))}
            </table>
            <Modal
                title="Confirmation"
                onCancel={() => {
                    setIsOpen({ state: false, id: "" });
                }}
                okButtonProps={{ type: "primary", danger: true }}
                cancelButtonProps={{ type: "primary" }}
                okText="Delete"
                onOk={async () => {
                    try {
                        setIsOpen({ state: false, id: "" });
                        let res = await axios.delete(`${baseUserUrl}/delete/${isOpen.id}`, {
                            withCredentials: true,
                        });
                        if (res.data.success) {
                            setUsers([]);
                            message.success("User deleted successfully");
                        }
                    } catch (error) {
                        message.error(error.response?.data?.message || "Failed to delete user");
                    }
                }}
                okType="danger"
                open={isOpen.state}
            >
                <p>Are you sure you want to delete?</p>
            </Modal>
        </div>
    );
};

export default ShowUsers;
