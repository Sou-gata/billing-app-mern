import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { baseBillsUrl, formatDate, formatRupee, formatTime, parseRupee } from "../utils";
import { message } from "antd";

const ViewBill = () => {
    const { id } = useParams();
    const [bill, setBill] = useState({});
    const [query, setQuery] = useState("");
    const navigate = useNavigate();
    useEffect(() => {
        setQuery(window.location.search);
    }, []);
    useEffect(() => {
        (async () => {
            try {
                let res = await axios.get(`${baseBillsUrl}/${id}`);
                if (res.data.success) {
                    res = res.data.data;
                    setBill(res);
                }
            } catch (error) {
                message.error(
                    error.response?.data?.message || error.message || "Error fetching bill"
                );
            }
        })();
    }, [id]);
    return (
        <div className="w-full p-2">
            <div className="flex cursor-pointer">
                <button
                    onClick={() => {
                        navigate("/saved-bills" + query);
                    }}
                    className="px-4 py-1 text-white rounded-md bg-blue-500 flex items-center justify-center hover:bg-blue-700"
                >
                    Go back
                </button>
            </div>
            <div className="flex justify-around">
                <div className="flex items-center gap-2">
                    <p>
                        <b>Name: </b>
                    </p>
                    <p>{bill?.name}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>
                        <b>Mobile: </b>
                    </p>
                    <p>{bill?.mobile}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>
                        <b>Address: </b>
                    </p>
                    <p>{bill?.address}</p>
                </div>
                <div className="flex items-center gap-2">
                    <p>
                        <b>Date & Time: </b>
                    </p>
                    <p>
                        {formatDate(bill?.date)}
                        &nbsp;&nbsp;&nbsp;
                        {formatTime(bill?.date)}
                    </p>
                </div>
            </div>
            <table className="w-full mt-5">
                <thead>
                    <tr className="border-black border">
                        <th className="w-1/3 py-2 border-r border-black">Item</th>
                        <th className="py-2 border-r border-black w-[10%]">SKU No</th>
                        <th className="py-2 border-r border-black w-[6.7%]">Quantity</th>
                        <th className="py-2 border-r border-black w-[7.3%]">Unit</th>
                        <th className="py-2 border-r border-black w-[6.5%]">Price</th>
                        <th className="py-2 border-r border-black w-[6.5%]">GST</th>
                        <th className="py-2 border-r border-black w-[6.5%]">GST Rs.</th>
                        <th className="py-2 border-r border-black w-[6.5%]">Total</th>
                    </tr>
                </thead>
                <tbody className="w-full">
                    {bill?.rows?.map((row, index) => (
                        <tr
                            className="p-2 border-b border-l border-r border-black gap-2 text-center"
                            key={index + "" + Math.random()}
                        >
                            <td className="border-r py-1 border-black">{row.item}</td>
                            <td className="border-r py-1 border-black">{row.sku}</td>
                            <td className="border-r py-1 border-black">{row.quantity}</td>
                            <td className="border-r py-1 border-black">{row.unit}</td>
                            <td className="border-r py-1 border-black">{parseRupee(row.value)}</td>
                            <td className="border-r py-1 border-black">{row.gst}</td>
                            <td className="border-r py-1 border-black">{parseRupee(row.gstRs)}</td>
                            <td className="border-r py-1 border-black">{parseRupee(row.total)}</td>
                        </tr>
                    ))}
                    <tr className="text-center font-bold">
                        <td className="w-1/3 py-1 ">Sub total</td>
                        <td className="w-[10%] py-1 "></td>
                        <td className="w-[6.7%] py-1 ">{bill.subTotal?.quantity}</td>
                        <td className="w-[7.3%] py-1"></td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.subTotal?.value)}</td>
                        <td className="w-[6.5%] py-1"></td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.subTotal?.gstRs)}</td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.subTotal?.total)}</td>
                    </tr>
                    <tr className="text-center font-bold border-t border-black">
                        <td className="w-1/3 py-1">
                            Packing & Forwarding UP TO KOLKATA DELIVERY POINT
                        </td>
                        <td className="w-[6.7%] py-1"></td>
                        <td className="w-[7.3%] py-1"></td>
                        <td className="w-[10%] py-1"></td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.delivery?.value)}</td>
                        <td className="w-[6.5%] py-1">{bill.delivery?.gst}</td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.delivery?.gstRs)}</td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.delivery?.total)}</td>
                    </tr>
                    <tr className="text-center font-bold border-t border-black">
                        <td className="w-1/3 py-1">Grand Total</td>
                        <td className="w-[6.7%] py-1"></td>
                        <td className="w-[7.3%] py-1"></td>
                        <td className="w-[10%] py-1"></td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.grandTotal?.value)}</td>
                        <td className="w-[6.5%] py-1"></td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.grandTotal?.gstRs)}</td>
                        <td className="w-[6.5%] py-1">{formatRupee(bill.grandTotal?.total)}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ViewBill;
