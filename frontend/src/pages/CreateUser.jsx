import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Context } from "../data/Context";
import { Button, Input, message, Select, Space } from "antd";
import { baseUserUrl } from "../utils";

const CreateUser = () => {
    const { setUsers } = useContext(Context);
    const [user, setUser] = useState({
        name: "",
        mobile: "",
        role: "worker",
        isActive: true,
    });
    const navigate = useNavigate();

    async function editUser() {
        if (!user.name || !user.mobile) {
            message.error("Please fill all the fields");
            return;
        }
        try {
            const res = await axios.post(
                `${baseUserUrl}/signup`,
                {
                    name: user.name,
                    mobile: user.mobile,
                    role: user.role,
                    isActive: user.isActive,
                },
                {
                    withCredentials: true,
                }
            );
            if (res.data.success) {
                setUsers([]);
                navigate("/show-users");
                message.success("User added successfully");
            }
        } catch (error) {
            console.log(error.response?.data);
            message.error(error.response?.data?.message || "Something went wrong");
        }
    }

    return (
        <div className="flex flex-col gap-5 p-5 mt-5 rounded-lg border border-gray-400">
            <h1 className="font-bold text-3xl text-center text-gray-800">Create User</h1>
            <table>
                <tbody>
                    <tr>
                        <td className="p-2">
                            <p className="font-bold">Name</p>
                        </td>
                        <td className="p-2">
                            <Input
                                placeholder="name"
                                value={user.name}
                                onChange={(e) => {
                                    setUser((prev) => {
                                        return { ...prev, name: e.target.value };
                                    });
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2">
                            <p className="font-bold">Mobile</p>
                        </td>
                        <td className="p-2">
                            <Input
                                placeholder="mobile"
                                value={user.mobile}
                                type="number"
                                onChange={(e) => {
                                    setUser((prev) => {
                                        return { ...prev, mobile: e.target.value };
                                    });
                                }}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2">
                            <p className="font-bold">Status</p>
                        </td>
                        <td className="p-2">
                            <Select
                                className="w-full"
                                value={user.isActive ? "active" : "deactive"}
                                onChange={(e) => {
                                    setUser({ ...user, isActive: e == "active" });
                                }}
                                options={[
                                    { value: "active", label: "Active" },
                                    { value: "deactive", label: "Deactive" },
                                ]}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td className="p-2">
                            <p className="font-bold">Role</p>
                        </td>
                        <td className="p-2">
                            <Select
                                className="w-full"
                                value={user.role == "admin" ? "admin" : "worker"}
                                onChange={(e) => {
                                    setUser({ ...user, role: e });
                                }}
                                options={[
                                    { value: "worker", label: "Worker" },
                                    { value: "admin", label: "Admin" },
                                ]}
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="w-full flex items-center justify-evenly">
                <Button
                    type="primary"
                    danger
                    className="self-center"
                    onClick={() => navigate("/show-users")}
                >
                    Cancel
                </Button>
                <Button type="primary" className="self-center" onClick={editUser}>
                    Save
                </Button>
            </div>
        </div>
    );
};

export default CreateUser;
