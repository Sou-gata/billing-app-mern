import { DatePicker, Input, Modal, Select, Space, message } from "antd";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import { v4 as uuid } from "uuid";
import { baseBillsUrl, formatDate, formatRupee, formatTime, parseRupee } from "../utils";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { usePDF } from "@react-pdf/renderer";
import Bill from "./Bill";

const SavedBills = () => {
    const navigate = useNavigate();
    const d = new Date();
    d.setDate(d.getDate() - 7);
    const [billDates, setBillDates] = useState([dayjs(d), dayjs()]);
    const [searchType, setSearchType] = useState("date-range");
    const [bills, setBills] = useState([]);
    const [info, setInfo] = useState({
        name: "",
        mobile: "",
    });
    const [query, setQuery] = useState("");
    const [isOpen, setIsOpen] = useState({ state: false, id: "" });
    const [isClicked, setIsClicked] = useState(false);
    const [call, setCall] = useState(false);

    const searchBills = async (type, bDate, inf) => {
        if (!type) type = searchType;
        if (!bDate) bDate = billDates;
        if (!inf) inf = info;
        if (type == "date-range") {
            try {
                let res = await axios.post(baseBillsUrl + "/search-date", {
                    date: [bDate[0].$d, bDate[1].$d],
                });
                if (res.data.success) {
                    res = res.data.data;
                    setBills(res);
                }
            } catch (error) {
                console.error(error);
            }
        } else if (type == "date") {
            try {
                let res = await axios.post(baseBillsUrl + "/search-date", {
                    date: [bDate[0].$d, bDate[1].$d],
                });
                if (res.data.success) {
                    res = res.data.data;
                    setBills(res);
                }
            } catch (error) {
                console.error(error);
            }
        } else if (type == "mobile") {
            try {
                let res = await axios.post(baseBillsUrl + "/search-mobile", {
                    mobile: inf.mobile,
                });
                if (res.data.success) {
                    res = res.data.data;
                    setBills(res);
                }
            } catch (error) {
                console.error(error);
            }
        } else if (type == "name") {
            try {
                let res = await axios.post(baseBillsUrl + "/search-name", {
                    name: inf.name.toLowerCase(),
                });
                if (res.data.success) {
                    res = res.data.data;
                    setBills(res);
                }
            } catch (error) {
                console.error(error);
            }
        }
    };
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get("type");
        const name = urlParams.get("name");
        const mobile = urlParams.get("mobile");
        const start = urlParams.get("start");
        const end = urlParams.get("end");
        if (type) {
            setSearchType(type);
        }
        if (type == "date-range" || type == "date") {
            if (!start && !end) return;
            setBillDates((prev) => {
                if (!isNaN(dayjs(start).$M) && !isNaN(dayjs(end).$M)) {
                    return [dayjs(start), dayjs(end)];
                } else {
                    return prev;
                }
            });
        } else if (type == "mobile") {
            if (!mobile) return;
            setInfo((prev) => {
                return { ...prev, mobile: mobile };
            });
        } else if (type == "name") {
            if (!name) return;
            setInfo((prev) => {
                return { ...prev, name: name };
            });
        } else {
            searchBills();
            return;
        }
        setCall(true);
    }, []);
    useEffect(() => {
        let str = "?type=" + searchType;
        if (searchType == "date-range" || searchType == "date") {
            str += "&start=" + formatDate(billDates[0].$d) + "&end=" + formatDate(billDates[1].$d);
        } else if (searchType == "mobile") {
            str += "&mobile=" + info.mobile;
        } else if (searchType == "name") {
            str += "&name=" + info.name;
        }
        setQuery(str);
    }, [billDates, searchType, info]);
    useEffect(() => {
        searchBills();
    }, [call]);

    const [instance, updateInstance] = usePDF({
        document: (
            <Bill
                rows={[]}
                subTotal={{ value: 0, qty: 0, total: 0, gstRs: 0 }}
                finalTotal={{ total: 0, value: 0, gstRs: 0 }}
                delivery={{ gst: 0, value: 0, total: 0, gstRs: 0 }}
                date={new Date()}
                partyDetails={""}
            />
        ),
    });

    useEffect(() => {
        if (!isClicked) return;
        const a = setTimeout(() => {
            const a = document.createElement("a");
            a.href = instance.url;
            a.download = `bill-${uuid()}.pdf`;
            a.click();
            a.remove();
            window.open(instance.url, "download");
            setIsClicked(false);
        }, 1500);
        return () => {
            clearTimeout(a);
        };
    }, [instance]);

    return (
        <div className="w-full p-2">
            <div className="flex gap-4 items-center justify-center">
                <p>Select search type: </p>
                <Select
                    defaultValue="date-range"
                    value={searchType}
                    options={[
                        { value: "date-range", label: "Date Range" },
                        { value: "date", label: "Date" },
                        { value: "mobile", label: "Mobile" },
                        { value: "name", label: "Name" },
                    ]}
                    onChange={(e) => {
                        setSearchType(e);
                    }}
                    style={{
                        width: 125,
                    }}
                />
                {searchType == "date-range" && (
                    <DatePicker.RangePicker
                        onChange={(e) => {
                            setBillDates(e);
                        }}
                        value={billDates}
                    />
                )}
                {searchType == "date" && (
                    <DatePicker
                        onChange={(e) => {
                            setBillDates([e, e]);
                        }}
                        value={billDates[1]}
                    />
                )}
                {searchType == "name" && (
                    <Space.Compact>
                        <Input
                            addonBefore="Name"
                            placeholder="Name"
                            allowClear
                            value={info.name}
                            onChange={(e) => {
                                setInfo((prev) => {
                                    return { ...prev, name: e.target.value };
                                });
                            }}
                        />
                    </Space.Compact>
                )}
                {searchType == "mobile" && (
                    <Space.Compact>
                        <Input
                            addonBefore="Mobile"
                            placeholder="Mobile no"
                            type="number"
                            maxLength={10}
                            allowClear
                            value={info.mobile}
                            onChange={(e) => {
                                setInfo((prev) => {
                                    return { ...prev, mobile: e.target.value };
                                });
                            }}
                        />
                    </Space.Compact>
                )}
                <button
                    onClick={() => {
                        navigate("/saved-bills" + query);
                        searchBills();
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-4 rounded-md m-0"
                >
                    Search
                </button>
            </div>
            <div>
                <table className="w-full mt-2">
                    <thead className="text-center font-bold w-full">
                        <tr>
                            <th className="border-r border-b border-black border-t w-[30%] py-1">
                                Name
                            </th>
                            <th className="border-r border-b border-black border-t w-[15%] py-1">
                                Mobile
                            </th>
                            <th className="border-r border-b border-black border-t py-1 w-[10%]">
                                Grand Total
                            </th>
                            <th className="border-r border-b border-black border-t py-1 w-[10%]">
                                Date
                            </th>
                            <th className="border-r border-b border-black border-t py-1 w-[10%]">
                                Time
                            </th>
                            <th className=" border-b border-black border-t py-1">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bills.map((bill, index) => (
                            <tr key={index} className="text-center">
                                <td className="border-r border-b px-2 py-1 border-t w-[30%] border-gray-300">
                                    {bill.name}
                                </td>
                                <td className="border-r border-b px-2 py-1 border-t w-[15%] border-gray-300">
                                    {bill.mobile}
                                </td>
                                <td className="border-r border-b px-2 py-1 border-t w-[10%] border-gray-300">
                                    {formatRupee(bill.grandTotal.total)}
                                </td>
                                <td className="border-r border-b px-2 py-1 border-t border-gray-300 w-[10%]">
                                    {formatDate(bill.date)}
                                </td>
                                <td className="border-r border-b px-2 py-1 border-t border-gray-300 w-[10%]">
                                    {formatTime(bill.date)}
                                </td>
                                <td className="border-b px-2 py-1 border-t border-gray-300 w-1/5">
                                    <div className="flex items-center justify-center gap-3">
                                        <Link
                                            to={`/bill/${bill._id + query}`}
                                            className="bg-blue-500 p-1 rounded-md cursor-pointer hover:bg-blue-700"
                                        >
                                            <img
                                                className="w-4 h-4"
                                                src="/eye-solid.svg"
                                                alt="print"
                                            />
                                        </Link>
                                        <button
                                            onClick={() => {
                                                setTimeout(() => {
                                                    let d = new Date(bill.date);
                                                    bill.subTotal.quantity = bill.subTotal.qty;
                                                    let partyDetails = {
                                                        name: bill.name,
                                                        mobile: bill.mobile,
                                                        address: bill.address,
                                                    };
                                                    updateInstance(
                                                        <Bill
                                                            rows={bill.rows}
                                                            subTotal={bill.subTotal}
                                                            finalTotal={bill.grandTotal}
                                                            delivery={bill.delivery}
                                                            date={d}
                                                            partyDetails={partyDetails}
                                                        />
                                                    );
                                                    setIsClicked(true);
                                                }, 500);
                                            }}
                                            className="bg-blue-500 p-1 rounded-md cursor-pointer hover:bg-blue-700"
                                        >
                                            <img
                                                className="w-4 h-4"
                                                src="/download.svg"
                                                alt="print"
                                            />
                                        </button>
                                        <button
                                            onClick={() => {
                                                navigate("/edit-bill" + query, {
                                                    state: { bill: bill },
                                                });
                                            }}
                                            className="bg-yellow-500 p-1 rounded-md cursor-pointer hover:bg-yellow-700"
                                        >
                                            <img className="w-4 h-4" src="/file.svg" alt="print" />
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsOpen({ state: true, id: bill._id });
                                            }}
                                            className="bg-red-500 p-1 rounded-md cursor-pointer hover:bg-red-700"
                                        >
                                            <img
                                                className="w-4 h-4"
                                                src="/trash-solid.svg"
                                                alt="print"
                                            />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Modal
                title="Confirmation"
                onCancel={() => {
                    setIsOpen({ state: false, id: "" });
                }}
                onOk={async () => {
                    try {
                        setIsOpen({ state: false, id: "" });
                        let res = await axios.delete(`${baseBillsUrl}/delete/${isOpen.id}`);
                        if (res.data.success) {
                            searchBills();
                            message.success("Bill deleted successfully");
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

export default SavedBills;
