import { Tooltip } from "antd";
import React from "react";
import { Link, NavLink } from "react-router-dom";
const Header = () => {
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
            </div>
        </div>
    );
};

export default Header;
