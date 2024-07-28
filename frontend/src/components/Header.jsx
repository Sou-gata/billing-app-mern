import { Avatar, Dropdown, Tooltip } from "antd";
import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { baseUserUrl, nameToInitials } from "../utils";
import { Context } from "../data/Context";
import axios from "axios";
const Header = () => {
    const { user, setUser } = useContext(Context);
    const navigate = useNavigate();
    return (
        <div className="w-full h-16 bg-blue-500 sticky top-0 left-0 right-0 z-10 flex items-center justify-between text-white px-3">
            <Link to="/" className="text-3xl font-bold">
                Maharaja Invoice
            </Link>
            <div className="flex gap-5">
                <Tooltip
                    className="cursor-pointer"
                    title="ctrl + alt + a → Add new row&emsp;&emsp;&emsp;&emsp;ctrl + alt + x → Delete last row&emsp;&emsp;&emsp;ctrl + alt + s → Save bill"
                >
                    <img src="/info.svg" alt="" width={20} height={20} />
                </Tooltip>
                <NavLink
                    to="/saved-bills"
                    className={({ isActive }) =>
                        isActive
                            ? "relative after:w-full after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0"
                            : ""
                    }
                >
                    Saved Bills
                </NavLink>
                <NavLink
                    to="/all-products"
                    className={({ isActive }) =>
                        isActive
                            ? "relative after:w-full after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0"
                            : ""
                    }
                >
                    Search Products
                </NavLink>
                {Boolean(user) && (
                    <NavLink
                        to="/import-excel"
                        className={({ isActive }) =>
                            isActive
                                ? "relative after:w-full after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0"
                                : ""
                        }
                    >
                        Import excel sheet
                    </NavLink>
                )}
                {Boolean(user) && (
                    <NavLink
                        to="/backup-restore"
                        className={({ isActive }) =>
                            isActive
                                ? "relative after:w-full after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0"
                                : ""
                        }
                    >
                        Backup
                    </NavLink>
                )}
                {Boolean(user) && (
                    <NavLink
                        to="/add-product"
                        className={({ isActive }) =>
                            isActive
                                ? "relative after:w-full after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0"
                                : ""
                        }
                    >
                        Add Product
                    </NavLink>
                )}

                {Boolean(user) && (
                    <Dropdown
                        trigger={["click"]}
                        menu={{
                            items: [
                                {
                                    key: "1",
                                    label: "Create User",
                                    onClick: () => {
                                        navigate("/create-user");
                                    },
                                },
                                {
                                    key: "2",
                                    label: "Show Users",
                                    onClick: () => {
                                        navigate("/show-users");
                                    },
                                },
                                {
                                    key: "3",
                                    label: "Change Password",
                                    onClick: () => {
                                        navigate("/change-password");
                                    },
                                },
                                {
                                    key: "4",
                                    label: "Logout",
                                    onClick: async () => {
                                        try {
                                            await axios.get(baseUserUrl + "/logout", {
                                                withCredentials: true,
                                            });
                                        } catch (error) {
                                        } finally {
                                            localStorage.removeItem("user");
                                            setUser(null);
                                        }
                                    },
                                },
                            ],
                        }}
                    >
                        <a onClick={(e) => e.preventDefault()}>
                            <Avatar
                                style={{
                                    backgroundColor: "#fff",
                                    color: "#3b83f6",
                                    fontWeight: "bold",
                                    cursor: "pointer",
                                }}
                            >
                                {nameToInitials(user?.name)}
                            </Avatar>
                        </a>
                    </Dropdown>
                )}
                {!Boolean(user) && (
                    <>
                        <NavLink
                            to="/login"
                            className={({ isActive }) =>
                                isActive
                                    ? "relative after:w-full after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0"
                                    : ""
                            }
                        >
                            Login
                        </NavLink>
                        <NavLink
                            to="/create-super-user"
                            className={({ isActive }) =>
                                isActive
                                    ? "relative after:w-full after:h-[1px] after:bg-white after:absolute after:bottom-0 after:left-0"
                                    : ""
                            }
                        >
                            Create Super User
                        </NavLink>
                    </>
                )}
            </div>
        </div>
    );
};

export default Header;
