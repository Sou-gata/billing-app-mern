import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { v4 as uuid } from "uuid";
import { Input, DatePicker, message, TimePicker } from "antd";
import Row from "../components/Row";
import Bill from "./Bill";

import { usePDF } from "@react-pdf/renderer";
import axios from "axios";
import dayjs from "dayjs";
import { baseBillsUrl, numberToWord, parseRupee } from "../utils";

const Home = () => {
    const [visible, setVisible] = useState(false);

    const addRow = useRef(0);
    const saveBill = useRef(0);
    const blankData = {
        id: uuid(),
        item: "",
        specification: "",
        unit: "",
        rate: "",
        gst: "",
        quantity: "",
        value: "",
        gstRs: "",
        total: "",
        sku: "",
        dbId: "",
    };
    const nanToZero = (value) => {
        return isNaN(parseFloat(value)) ? 0 : parseFloat(value);
    };
    const [rows, setRows] = useState([blankData]);
    const [subTotal, setSubTotal] = useState({
        quantity: 0,
        value: 0,
        gstRs: 0,
        total: 0,
    });
    const [delivery, setDelivery] = useState({
        gst: 0,
        value: 0,
        gstRs: 0.0,
        total: 0.0,
    });
    const [finalTotal, setFinalTotal] = useState({
        value: 0,
        gstRs: 0,
        total: 0,
    });
    useEffect(() => {
        let quantity = 0,
            value = 0,
            gstRs = 0,
            total = 0;
        rows.forEach((row) => {
            quantity += nanToZero(row.quantity);
            value += nanToZero(row.value);
            gstRs += nanToZero(row.gstRs);
            total += nanToZero(row.total);
        });
        setSubTotal({
            quantity,
            value: value.toFixed(2),
            gstRs: gstRs.toFixed(2),
            total: total.toFixed(2),
        });
    }, [rows]);
    useEffect(() => {
        let value = nanToZero(subTotal.value) + nanToZero(delivery.value);
        let gstRs = nanToZero(subTotal.gstRs) + nanToZero(delivery.gstRs);
        let total = nanToZero(subTotal.total) + nanToZero(delivery.total);
        setFinalTotal({
            value: value.toFixed(2),
            gstRs: gstRs.toFixed(2),
            total: total.toFixed(2),
        });
        setVisible(false);
    }, [subTotal, delivery]);
    const [date, setDate] = useState(new Date());
    const [partyDetails, setPartyDetails] = useState({ name: "", mobile: "", address: "" });
    const [instance, updateInstance] = usePDF({
        document: (
            <Bill
                rows={rows}
                subTotal={subTotal}
                finalTotal={finalTotal}
                delivery={delivery}
                date={date}
                partyDetails={partyDetails}
            />
        ),
    });
    useEffect(() => {
        setVisible(false);
    }, [date, partyDetails]);
    const location = useLocation();
    const keyBoardShortcuts = (e) => {
        if (location.pathname !== "/") return;
        if (e.key === "ā" || e.key === "Ā") {
            addRow.current.click();
        } else if (e.key === "ṣ" || e.key === "Ṣ") {
            setRows((prev) => {
                if (prev.length > 1) return prev.slice(0, -1);
                else return prev;
            });
        } else if (e.key === "ś" || e.key === "Ś") {
            saveBill.current.click();
        }
        setVisible(false);
    };
    useEffect(() => {
        window.addEventListener("keypress", keyBoardShortcuts);
        return () => {
            window.removeEventListener("keypress", keyBoardShortcuts);
        };
    }, []);

    const handleSaveBill = async () => {
        try {
            if (!partyDetails.mobile) {
                message.error("Mobile number is required");
                return;
            }
            let d = new Date(date);
            const a = await axios.post(baseBillsUrl + "/add", {
                mobile: partyDetails.mobile,
                name: partyDetails.name,
                address: partyDetails.address,
                date: d,
                rows,
                subTotal,
                delivery,
                grandTotal: finalTotal,
            });
            if (a.data.success) {
                message.success("Bill saved successfully");
            }
        } catch (error) {
            message.error(error.response?.data?.message || error.message || "Error in saving bill");
        }
    };

    return (
        <div className="w-[1538px]">
            <div className="flex justify-between items-center px-5 py-3">
                <div className="flex justify-center items-center gap-5">
                    <p>Party details:</p>
                    <Input
                        style={{
                            width: 200,
                        }}
                        placeholder="Party details"
                        value={partyDetails.name}
                        onChange={(e) => {
                            setPartyDetails((prev) => {
                                return { ...prev, name: e.target.value };
                            });
                        }}
                    />
                </div>
                <div className="flex justify-center items-center gap-5">
                    <p>Mobile:</p>
                    <Input
                        style={{
                            width: 200,
                        }}
                        placeholder="Mobile number"
                        value={partyDetails.mobile}
                        type="number"
                        maxLength={10}
                        onChange={(e) => {
                            setPartyDetails((prev) => {
                                return {
                                    ...prev,
                                    mobile:
                                        e.target.value.length <= 10 ? e.target.value : prev.mobile,
                                };
                            });
                        }}
                    />
                </div>
                <div className="flex justify-center items-center gap-5">
                    <p>Address:</p>
                    <Input
                        style={{
                            width: 250,
                        }}
                        placeholder="Address"
                        value={partyDetails.address}
                        onChange={(e) => {
                            setPartyDetails((prev) => {
                                return { ...prev, address: e.target.value };
                            });
                        }}
                    />
                </div>
                <div className="flex justify-center items-center gap-5">
                    <p>Billing date & time:</p>
                    <DatePicker
                        value={dayjs(date)}
                        onChange={(e) => {
                            if (e?.$d) {
                                let oldH = date.getHours();
                                let oldM = date.getMinutes();
                                let oldS = date.getSeconds();
                                let d = new Date(e.$d);
                                d.setHours(oldH);
                                d.setMinutes(oldM);
                                d.setSeconds(oldS);
                                setDate(d);
                            }
                        }}
                    />
                    <TimePicker
                        onChange={(e) => {
                            let h = e.$H;
                            let m = e.$m;
                            let d = new Date(date);
                            d.setHours(h);
                            d.setMinutes(m);
                            setDate(d);
                        }}
                        value={dayjs(`${date.getHours()}:${date.getMinutes()}`, "HH:mm")}
                        format="h:mm a"
                        use12Hours
                    />
                </div>
            </div>
            <div className="flex justify-around my-2 font-bold text-center">
                <p className="w-12">SL</p>
                <p className="w-[300px]">Item</p>
                <p className="w-[120px]">SKU No</p>
                <p className="w-[100px]">Unit</p>
                <p className="w-[100px]">quantity</p>
                <p className="w-[100px]">Rate</p>
                <p className="w-[100px]">GST %</p>
                <p className="w-[100px]">Value</p>
                <p className="w-[100px]">GST Rs</p>
                <p className="w-[100px]">Total</p>
                <p className="w-5">Del</p>
            </div>
            {rows.map((row, index) => (
                <div key={index}>
                    <Row rowsData={rows} serial={index + 1} row={row} setRows={setRows} />
                </div>
            ))}
            <div className="flex items-center justify-center">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md mt-4"
                    ref={addRow}
                    onClick={() => {
                        setRows([...rows, { ...blankData, id: uuid() }]);
                    }}
                >
                    Add Row
                </button>
            </div>
            <div className="flex justify-around py-2 font-bold text-center border mt-2 border-gray-300">
                <p className="w-12"></p>
                <p className="w-[300px]">Sub Total</p>
                <p className="w-[120px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]">{subTotal.quantity}</p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]">{subTotal.value}</p>
                <p className="w-[100px]">{subTotal.gstRs}</p>
                <p className="w-[100px]">{subTotal.total}</p>
                <p className="w-5"></p>
            </div>
            <div className="flex justify-around items-center  font-bold text-center border mt-[-0.5px] border-gray-300 py-2">
                <p className="w-12"></p>
                <p className="w-[300px]">Packing & Forwarding Charges</p>
                <p className="w-[120px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]"></p>
                <div className="w-[100px] font-normal">
                    <Input
                        style={{
                            width: 100,
                        }}
                        placeholder="GST %"
                        value={delivery.gst}
                        onChange={(e) => {
                            let gst = nanToZero(e.target.value);
                            let value = nanToZero(delivery.value);
                            let gstRs = value * 0.01 * gst;
                            let total = value + gstRs;
                            setDelivery({
                                gst,
                                value,
                                gstRs: gstRs.toFixed(2),
                                total: total.toFixed(2),
                            });
                        }}
                        type="number"
                    />
                </div>
                <div className="w-[100px] font-normal">
                    <Input
                        style={{
                            width: 100,
                        }}
                        placeholder="Value"
                        value={delivery.value}
                        onChange={(e) => {
                            let value = nanToZero(e.target.value);
                            let gst = nanToZero(delivery.gst);
                            let gstRs = value * 0.01 * gst;
                            let total = value + gstRs;
                            setDelivery({
                                gst,
                                value,
                                gstRs: gstRs.toFixed(2),
                                total: total.toFixed(2),
                            });
                        }}
                        type="number"
                    />
                </div>
                <p className="w-[100px]">{parseRupee(delivery.gstRs)}</p>
                <p className="w-[100px]">{parseRupee(delivery.total)}</p>
                <p className="w-5"></p>
            </div>
            <div className="flex justify-around font-bold text-center border border-gray-300 mt-[-1px] py-2">
                <p className="w-12"></p>
                <p className="w-[300px]">Grand Total</p>
                <p className="w-[120px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]"></p>
                <p className="w-[100px]">{finalTotal.value}</p>
                <p className="w-[100px]">{finalTotal.gstRs}</p>
                <p className="w-[100px]">{finalTotal.total}</p>
                <p className="w-5"></p>
            </div>
            <div className="flex items-center justify-center w-full gap-10">
                <button
                    ref={saveBill}
                    onClick={handleSaveBill}
                    className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0 mt-4"
                >
                    Save Bill
                </button>
                {!visible && (
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0 mt-4"
                        onClick={() => {
                            let d = new Date(date);
                            d.setHours(date.getHours());
                            d.setMinutes(date.getMinutes());
                            setTimeout(() => {
                                updateInstance(
                                    <Bill
                                        rows={rows}
                                        subTotal={subTotal}
                                        finalTotal={finalTotal}
                                        delivery={delivery}
                                        date={d}
                                        partyDetails={partyDetails}
                                    />
                                );
                                setVisible(true);
                            }, 500);
                            updateInstance(
                                <Bill
                                    rows={rows}
                                    subTotal={subTotal}
                                    finalTotal={finalTotal}
                                    delivery={delivery}
                                    date={d}
                                    partyDetails={partyDetails}
                                />
                            );
                        }}
                    >
                        Generate
                    </button>
                )}
                {visible && (
                    <a
                        className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md m-0 mt-4"
                        href={instance.url}
                        download={uuid() + ".pdf"}
                        onClick={() => {
                            window.open(instance.url, "PRINT");
                        }}
                    >
                        Download
                    </a>
                )}
                <button
                    onClick={() => {
                        setRows([blankData]);
                        setSubTotal({
                            quantity: 0,
                            value: 0,
                            gstRs: 0,
                            total: 0,
                        });
                        setDelivery({
                            gst: 0,
                            value: 0,
                            gstRs: 0.0,
                            total: 0.0,
                        });
                        setFinalTotal({
                            value: 0,
                            gstRs: 0,
                            total: 0,
                        });
                        setDate(new Date());
                        setPartyDetails({ name: "", mobile: "" });
                    }}
                    className="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded-md m-0 mt-4"
                >
                    Clear All
                </button>
            </div>
        </div>
    );
};

export default Home;
