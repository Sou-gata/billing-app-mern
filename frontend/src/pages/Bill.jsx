import React, { useEffect, useState } from "react";
import { Page, Text, View, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { approxRupee, formatDate, formatTime, parseRupee, rupeeToWord } from "../utils";

// Create styles
const styles = StyleSheet.create({
    page: {
        flexDirection: "column",
        backgroundColor: "#ffffff",
        padding: 5,
    },
    imgBg: {
        justifyContent: "center",
        alignItems: "center",
        // width: 75,
        // height: 75,
    },
    boxes: {
        borderRightWidth: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    products: {
        borderRightWidth: 1,
        alignItems: "center",
        justifyContent: "center",
        padding: 2,
    },
    products2: {
        borderRightWidth: 1,
        alignItems: "flex-end",
        justifyContent: "center",
        padding: 2,
    },
    totalBoxs: {
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 3,
    },
    totalBoxs2: {
        alignItems: "flex-end",
        justifyContent: "center",
        paddingVertical: 3,
        borderRightWidth: 1,
        paddingRight: 2,
    },
});
// Create Document Component
const MyDocument = ({ rows, subTotal, finalTotal, delivery, date, partyDetails }) => {
    const [data, setData] = useState({ rows, subTotal, finalTotal, delivery, date, partyDetails });
    const [isSameUnit, setIsSameUnit] = useState(true);

    useEffect(() => {
        setData({ rows, subTotal, finalTotal, delivery, date, partyDetails });
        let a = true;
        for (let i = 0; i < rows.length - 1; i++) {
            a = a && rows[i].unit?.toUpperCase() === rows[i + 1].unit?.toUpperCase();
        }
        setIsSameUnit(a);
    }, [rows, subTotal, finalTotal, delivery, date, partyDetails]);
    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#C5D9F1",
                        padding: 5,
                        gap: 10,
                        borderWidth: 1,
                        borderBottomColor: "black",
                    }}
                >
                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            width: "100%",
                        }}
                    >
                        <View style={styles.imgBg}>
                            <Image src={"/logo.png"} style={{ width: 75, height: 75 }} />
                        </View>
                        <View style={{ alignItems: "center", gap: 5 }}>
                            <Text style={{ fontSize: 30 }}>MAHARAJA</Text>
                            <Text style={{ fontSize: 9 }}>GST NO. :- 19AAHFM4601J1Z8</Text>
                            <Text style={{ fontSize: 9 }}>
                                58/ D , NETAJI SUBHAS ROAD , GROUND FLOOR, ROOM NO. - 61 , KOLKATA -
                                700001
                            </Text>
                            <Text style={{ fontSize: 9 }}>
                                BRANCH: 2, BRABOURNE ROAD, GROUND FLOOR, KOLKATA- 700001
                            </Text>
                            <Text style={{ fontSize: 9 }}>
                                ENQUIRY - BANKIM KHARA : 9830147439 / 6291601846
                            </Text>
                        </View>
                        <View style={styles.imgBg}>
                            <Image src={"/logo2.png"} style={{ width: 75, height: 75 }} />
                        </View>
                    </View>
                    <Text style={{ fontSize: 15, fontWeight: "bold", textDecoration: "underline" }}>
                        QUOTATION
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        borderWidth: 1,
                        borderColor: "black",
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                    }}
                >
                    <Text style={{ fontSize: 11 }}>PARTY DETAILS</Text>
                    <Text style={{ fontSize: 11 }}>
                        {formatDate(date)} &nbsp; {formatTime(date)}
                    </Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        paddingHorizontal: 20,
                        paddingVertical: 5,
                        borderTopWidth: 0,
                        maxHeight: 60,
                        gap: 2,
                    }}
                >
                    <Text style={{ fontSize: 11 }}>{partyDetails.name || ""}</Text>
                    <Text style={{ fontSize: 11 }}>Mobile: {partyDetails.mobile || ""}</Text>
                    <Text style={{ fontSize: 11 }}>Address: {partyDetails.address || ""}</Text>
                </View>
                <View
                    style={{
                        borderWidth: 1,
                        borderColor: "black",
                        borderTopWidth: 0,
                        backgroundColor: "#C5D9F1",
                        flexDirection: "row",
                    }}
                >
                    <View style={[styles.boxes, { width: 25 }]}>
                        <Text style={{ fontSize: 10 }}>SL NO</Text>
                    </View>
                    <View style={[styles.boxes, { width: 179 }]}>
                        <Text style={{ fontSize: 10 }}>Item</Text>
                    </View>
                    <View style={[styles.boxes, { width: 50 }]}>
                        <Text style={{ fontSize: 10 }}>SKU</Text>
                    </View>
                    <View style={[styles.boxes, { width: 35 }]}>
                        <Text style={{ fontSize: 10 }}>Unit</Text>
                    </View>
                    <View style={[styles.boxes, { width: 30 }]}>
                        <Text style={{ fontSize: 10 }}>Qty</Text>
                    </View>
                    <View style={[styles.boxes, { width: 47 }]}>
                        <Text style={{ fontSize: 10 }}>Rate</Text>
                    </View>
                    <View style={[styles.boxes, { width: 31 }]}>
                        <Text style={{ fontSize: 10 }}>Gst %</Text>
                    </View>
                    <View style={[styles.boxes, { width: 64 }]}>
                        <Text style={{ fontSize: 10 }}>Value</Text>
                    </View>
                    <View style={[styles.boxes, { width: 59 }]}>
                        <Text style={{ fontSize: 10 }}>GST Rs.</Text>
                    </View>
                    <View style={[styles.boxes, { width: 64, borderRightWidth: 0 }]}>
                        <Text style={{ fontSize: 10 }}>Total</Text>
                    </View>
                </View>
                <View
                    style={{ width: "100%", borderWidth: 1, borderBottomWidth: 0, marginTop: -1 }}
                >
                    {data.rows?.map((row, index) => (
                        <View
                            key={index}
                            style={{
                                borderBottomWidth: 1,
                                borderColor: "black",
                                flexDirection: "row",
                                marginTop: -1,
                            }}
                        >
                            <View style={[styles.products, { width: 25, borderLeftWidth: 0 }]}>
                                <Text style={{ fontSize: 10 }}>{index + 1}</Text>
                            </View>
                            <View
                                style={[styles.products, { width: 179, alignItems: "flex-start" }]}
                            >
                                <Text style={{ fontSize: 10 }}>{row.item || ""}</Text>
                            </View>
                            <View style={[styles.products, { width: 50 }]}>
                                <Text style={{ fontSize: 10 }}>{row?.sku || ""}</Text>
                            </View>
                            <View style={[styles.products, { width: 35 }]}>
                                <Text style={{ fontSize: 10 }}>{row?.unit || ""}</Text>
                            </View>
                            <View style={[styles.products, { width: 30 }]}>
                                <Text style={{ fontSize: 10 }}>{row?.quantity || ""}</Text>
                            </View>
                            <View style={[styles.products, { width: 47 }]}>
                                <Text style={{ fontSize: 10 }}>{row?.rate || ""}</Text>
                            </View>
                            <View style={[styles.products, { width: 31 }]}>
                                <Text style={{ fontSize: 10 }}>{row.gst || 0}</Text>
                            </View>
                            <View style={[styles.products2, { width: 64 }]}>
                                <Text style={{ fontSize: 10 }}>{parseRupee(row.value) || 0}</Text>
                            </View>
                            <View style={[styles.products2, { width: 59 }]}>
                                <Text style={{ fontSize: 10 }}>{parseRupee(row.gstRs) || 0}</Text>
                            </View>
                            <View style={[styles.products2, { width: 64, borderRightWidth: 0 }]}>
                                <Text style={{ fontSize: 10 }}>{parseRupee(row.total) || 0}</Text>
                            </View>
                        </View>
                    ))}
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderTopWidth: 0,
                        marginTop: -1,
                    }}
                >
                    <View style={[styles.totalBoxs, { width: 205 }]}>
                        <Text style={{ fontSize: 11 }}>SUBTOTAL</Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 50 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 35 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 30 }]}>
                        <Text style={{ fontSize: 10 }}>
                            {isSameUnit ? data.subTotal.quantity : ""}
                        </Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 47 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 31 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 64 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.subTotal.value)}</Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 59 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.subTotal.gstRs)}</Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 64, borderRightWidth: 0 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.subTotal.total)}</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderTopWidth: 0,
                        marginTop: -1,
                    }}
                >
                    <View style={[styles.totalBoxs, { width: 205 }]}>
                        <Text style={{ fontSize: 11 }}>Packing & Forwarding Charges</Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 50 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 35 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 30 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 47 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 31 }]}>
                        <Text style={{ fontSize: 10 }}>{data.delivery.gst}</Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 64 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.delivery.value)}</Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 59 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.delivery.gstRs)}</Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 64, borderRight: 0 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.delivery.total)}</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        borderWidth: 1,
                        borderTopWidth: 0,
                        marginTop: -1,
                    }}
                >
                    <View style={[styles.totalBoxs, { width: 205 }]}>
                        <Text style={{ fontSize: 11 }}>GRAND TOTAL</Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 50 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 35 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 30 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 47 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 31 }]}>
                        <Text style={{ fontSize: 10 }}></Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 64 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.finalTotal.value)}</Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 59 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.finalTotal.gstRs)}</Text>
                    </View>
                    <View style={[styles.totalBoxs2, { width: 64, borderRightWidth: 0 }]}>
                        <Text style={{ fontSize: 10 }}>{parseRupee(data.finalTotal.total)}</Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                        borderWidth: 1,
                        borderTopWidth: 0,
                        marginTop: -1,
                    }}
                >
                    <View
                        style={[
                            styles.totalBoxs,
                            { width: 205, alignItems: "center", textTransform: "uppercase" },
                        ]}
                    >
                        <Text style={{ fontSize: 11 }}>Payble amount</Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 380, alignItems: "flex-end" }]}>
                        <Text style={{ fontSize: 10 }}>
                            {approxRupee(data.finalTotal?.total || 0)}
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingHorizontal: 5,
                        paddingVertical: 3,
                        borderWidth: 1,
                        borderTopWidth: 0,
                        marginTop: -1,
                    }}
                >
                    <View
                        style={[
                            styles.totalBoxs,
                            { width: 205, alignItems: "center", textTransform: "uppercase" },
                        ]}
                    >
                        <Text style={{ fontSize: 11 }}>Payble amount in word</Text>
                    </View>
                    <View style={[styles.totalBoxs, { width: 380, alignItems: "flex-end" }]}>
                        <Text style={{ fontSize: 10 }}>
                            {rupeeToWord(approxRupee(data.finalTotal?.total || 0))} only
                        </Text>
                    </View>
                </View>
                <View
                    style={{
                        padding: 10,
                        borderWidth: 1,
                        marginTop: -1,
                        backgroundColor: "#D8E4BC",
                    }}
                >
                    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
                        <Image src="/star.png" style={{ width: 14, height: 14 }} />
                        <Text style={{ fontSize: 14 }}>TERMS & CONDITIONS</Text>
                    </View>
                    <View style={{ marginLeft: 15, marginTop: 5, gap: 5 }}>
                        <Text style={{ fontSize: 8 }}>Delivery within 20 working days.</Text>
                        <Text style={{ fontSize: 8 }}>
                            Payment 100 % as advance along with purchase order.
                        </Text>
                        <Text style={{ fontSize: 8 }}>
                            The above Prices are nett rate after giving all discounts.
                        </Text>
                        <Text style={{ fontSize: 8 }}>
                            We pack with atmost care .Transport damage will not be entertained or
                            accepted in any form.
                        </Text>
                        <Text style={{ fontSize: 8 }}>
                            Transport damage will not be fall under our juries driection.
                        </Text>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                            marginTop: 5,
                        }}
                    >
                        <Image src="/star.png" style={{ width: 14, height: 14 }} />
                        <Text style={{ fontSize: 14 }}>BANK DETAILS</Text>
                    </View>
                    <View style={{ marginLeft: 15, marginTop: 5, gap: 5 }}>
                        <Text style={{ fontSize: 8 }}>
                            BANK NAME : KOTAK MAHINDRA BANK , A/c No. : 0512025874, BRANCH :
                            BRABOURNE ROAD, IFSC CODE : KKBK0000323
                        </Text>
                    </View>
                </View>
            </Page>
        </Document>
    );
};
export default MyDocument;
