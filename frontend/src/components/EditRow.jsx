import { useContext, useState } from "react";
import { AutoComplete, Input } from "antd";
import { Context } from "../data/Context";

const Row = ({ row, rowsData, serial, setRows }) => {
    const { data } = useContext(Context);
    const parseNumber = (value) => {
        return parseFloat(parseFloat(value).toFixed(2));
    };

    return (
        <div className="flex justify-around my-2">
            <p className="w-12 text-center">{serial}</p>
            <AutoComplete
                style={{
                    width: 300,
                }}
                placeholder="Product name"
                options={data}
                filterOption={(inputValue, d) => {
                    if (d.value) {
                        return (
                            d.value?.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1 ||
                            d.sku.toUpperCase()?.indexOf(inputValue?.toUpperCase()) !== -1
                        );
                    } else return false;
                }}
                value={row.item}
                onChange={(e) => {
                    let rows = [...rowsData];
                    for (let i = 0; i < rows.length; i++) {
                        if (rows[i]._id == row._id) {
                            rows[i].item = e;
                            break;
                        }
                    }
                    setRows(rows);
                }}
                onSelect={(_, option) => {
                    let value = option?.cp || 0;
                    let gstRs = option?.gst * 0.01 * value;
                    let total = value + gstRs;
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        console.log(temp[i]._id, row._id);
                        if (temp[i]._id === row._id) {
                            temp[i] = {
                                ...rowsData[i],
                                item: option["value"],
                                unit: option?.unit || "",
                                rate: option?.cp || 0,
                                gst: option.gst || 0,
                                quantity: 1,
                                value: parseNumber(value),
                                gstRs: parseNumber(gstRs),
                                total: parseNumber(total),
                                sku: option.sku,
                                dbId: option._id,
                                _id: option._id,
                            };
                            break;
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 120,
                }}
                placeholder="SKU"
                value={row?.sku}
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            temp[i] = {
                                ...temp[i],
                                sku: e.target.value,
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 100,
                }}
                placeholder="Unit"
                value={row?.unit}
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            temp[i] = {
                                ...temp[i],
                                unit: e.target.value,
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 100,
                }}
                placeholder="quantity"
                value={row?.quantity}
                type="number"
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            let quantity = e.target.value;
                            let value = row.rate * parseFloat(quantity);
                            let gstRs = row.gst * 0.01 * value;
                            let total = value + gstRs;
                            temp[i] = {
                                ...temp[i],
                                quantity,
                                value: parseNumber(value),
                                gstRs: parseNumber(gstRs),
                                total: parseNumber(total),
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 100,
                }}
                placeholder="Rate"
                type="number"
                value={row?.rate}
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            let rate = e.target.value;
                            let value = rate * row.quantity;
                            let gstRs = row.gst * 0.01 * value;
                            let total = value + gstRs;
                            temp[i] = {
                                ...temp[i],
                                rate: parseNumber(rate),
                                value: parseNumber(value),
                                gstRs: parseNumber(gstRs),
                                total: parseNumber(total),
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 100,
                }}
                placeholder="GST %"
                value={row?.gst}
                type="number"
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            let gst = e.target.value;
                            let value = row.rate * row.quantity;
                            let gstRs = gst * 0.01 * value;
                            let total = value + gstRs;
                            temp[i] = {
                                ...temp[i],
                                gst: parseNumber(gst),
                                value: parseNumber(value),
                                gstRs: parseNumber(gstRs),
                                total: parseNumber(total),
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 100,
                }}
                type="number"
                placeholder="Value"
                value={row.value}
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            let value = e.target.value;
                            let gstRs = row.gst * 0.01 * value;
                            let total = value + gstRs;
                            temp[i] = {
                                ...temp[i],
                                value: parseNumber(value),
                                gstRs: parseNumber(gstRs),
                                total: parseNumber(total),
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 100,
                }}
                placeholder="GST Rs."
                type="number"
                value={row.gstRs}
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            let gstRs = e.target.value;
                            let total = row.value + gstRs;
                            temp[i] = {
                                ...temp[i],
                                gstRs: parseNumber(gstRs),
                                total: parseNumber(total),
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <Input
                style={{
                    width: 100,
                }}
                placeholder="Total"
                value={row.total}
                type="number"
                onChange={(e) => {
                    let temp = [...rowsData];
                    for (let i = 0; i < temp.length; i++) {
                        if (temp[i]._id === row._id) {
                            temp[i] = {
                                ...temp[i],
                                total: parseNumber(e.target.value),
                            };
                        }
                    }
                    setRows(temp);
                }}
            />
            <button
                className="w-5 cursor-pointer"
                onClick={() => {
                    if (rowsData.length === 1) return;
                    let temp = [...rowsData];
                    temp = temp.filter((r) => r._id !== row._id);
                    setRows(temp);
                }}
            >
                <img src="/trash.svg" alt="delete" width="15" />
            </button>
        </div>
    );
};

export default Row;
