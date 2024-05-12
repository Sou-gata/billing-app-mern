import React, { useContext, useEffect, useState } from "react";
import { Context } from "../data/Context";
import { Input, Modal } from "antd";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const AllData = () => {
    const { data, setData } = useContext(Context);
    const [searchData, setSearchData] = useState([]);
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState({ state: false, id: "" });
    const location = useLocation();
    useEffect(() => {
        if (search) {
            const timer = setTimeout(() => {
                let tempData = data.filter((d) => {
                    if (d.value) {
                        return (
                            d.value.toUpperCase()?.indexOf(search?.toUpperCase()) !== -1 ||
                            d.sku.toUpperCase()?.indexOf(search?.toUpperCase()) !== -1
                        );
                    } else false;
                });
                setSearchData(tempData);
            }, 500);
            return () => {
                return clearTimeout(timer);
            };
        } else {
            setSearchData([]);
        }
    }, [search, data]);
    useEffect(() => {
        let query = new URLSearchParams(location.search);
        query = query.get("search");
        if (query) {
            setSearch(query);
        }
    }, []);
    return (
        <div className="w-full p-2 pt-0">
            <div className="sticky top-[64px] bg-gray-50 pt-2">
                <div className="h-12">
                    <Input
                        style={{
                            width: "100%",
                        }}
                        placeholder="Search products here"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                </div>
                {searchData.length > 0 && (
                    <div className="border-b border-b-black font-bold flex py-2">
                        <p className="w-[45px] border-r text-center">SL</p>
                        <p className="w-[550px] border-r text-center cursor-pointer hover:text-blue-700">
                            ITEM
                        </p>
                        <p className="w-[60px] border-r text-center">GST</p>
                        <p className="w-[100px] border-r text-center">CP</p>
                        <p className="w-[100px] border-r text-center">AMOUNT</p>
                        <p className="w-[100px] border-r text-center">QUANTITY</p>
                        <p className="w-[100px] border-r text-center">GROUP</p>
                        <p className="w-[100px] border-r text-center">HSN</p>
                        <p className="w-[100px] border-r text-center">BRAND</p>
                        <p className="w-[100px] border-r text-center">SKU</p>
                        <div className="flex items-center justify-center gap-5 w-32">
                            <p>ACTION</p>
                        </div>
                    </div>
                )}
                {searchData.length === 0 && search && (
                    <div className="py-2">
                        <p className="text-center text-2xl">No data found</p>
                    </div>
                )}
                {searchData.length === 0 && !search && (
                    <div className="py-2">
                        <p className="text-center text-2xl">
                            Type the <strong>Item Name</strong> or <strong>SKU no</strong> in the
                            search box to find the product
                        </p>
                    </div>
                )}
            </div>
            {searchData.map((d, i) => {
                return (
                    <div key={i} className="border-b py-2 flex">
                        <p className="w-[45px] border-r text-center">{i + 1}</p>
                        <Link
                            to={"/product/" + d._id + "?search=" + search}
                            className="w-[550px] border-r text-center cursor-pointer hover:text-blue-700"
                        >
                            {d.value}
                        </Link>
                        <p className="w-[60px] border-r text-center">{d.gst}</p>
                        <p className="w-[100px] border-r text-center">{d.cp}</p>
                        <p className="w-[100px] border-r text-center">{d.amount}</p>
                        <p className="w-[100px] border-r text-center">{d.quantity}</p>
                        <p className="w-[100px] border-r text-center">{d.group}</p>
                        <p className="w-[100px] border-r text-center">{d.hsn}</p>
                        <p className="w-[100px] border-r text-center">{d.brand}</p>
                        <p className="w-[100px] border-r text-center">{d.sku}</p>
                        <div className="flex items-center justify-center gap-5 w-32">
                            <Link
                                className="cursor-pointer"
                                to={"/product/" + d._id + "?search=" + search}
                            >
                                <img src="/eye.svg" className="w-5 h-5" alt="view" />
                            </Link>
                            <Link
                                className="cursor-pointer"
                                to={"/edit/" + d._id + "?search=" + search}
                            >
                                <img src="/edit.svg" className="w-5 h-5" alt="edit" />
                            </Link>
                            <button
                                className="cursor-pointer"
                                onClick={() => {
                                    setIsOpen({ state: true, id: d._id });
                                }}
                            >
                                <img src="/trash.svg" className="w-5 h-5" alt="delete" />
                            </button>
                        </div>
                    </div>
                );
            })}
            <Modal
                title="Confirmation"
                onCancel={() => {
                    setIsOpen({ state: false, id: "" });
                }}
                onOk={async () => {
                    try {
                        let res = await axios.delete(
                            `http://localhost:7684/api/v1/products/delete/${isOpen.id}`
                        );
                        if (res.data.success) {
                            setIsOpen({ state: false, id: "" });
                            let temp = await axios.get("http://localhost:7684/api/v1/products/all");
                            let tempData = temp.data;
                            if (tempData.success) {
                                setData(tempData.data);
                            }
                        }
                    } catch (error) {}
                }}
                okType="danger"
                open={isOpen.state}
            >
                <p>Are you sure you want to delete?</p>
            </Modal>
        </div>
    );
};

export default AllData;