const baseUrl = "http://localhost:7684";
const baseApiUrl = baseUrl + "/api/v1";
export const baseProductsUrl = baseApiUrl + "/products";
export const baseBillsUrl = baseApiUrl + "/bills";

export const pad = (num) => {
    return (num < 10 ? "0" : "") + num;
};

export const formatDate = (date) => {
    const d = new Date(date);
    return pad(d?.getDate()) + "-" + pad(d?.getMonth() + 1) + "-" + d?.getFullYear();
};

export const formatTime = (date) => {
    const d = new Date(date);
    let h = d?.getHours();
    let m = d?.getMinutes();
    let miridian = "AM";
    if (h >= 12) miridian = "PM";
    h = h % 12;
    if (h === 0) h = 12;
    return pad(h) + ":" + pad(m) + " " + miridian;
};

export const parseRupee = (num = 0) => {
    let val = isNaN(parseFloat(num + "")) ? "0.00" : parseFloat(num + "").toFixed(2);
    return val;
};

export const formatRupee = (num = 0) => {
    let val = isNaN(parseFloat(num)) ? 0 : parseFloat(num);
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        maximumFractionDigits: 2,
        currency: "INR",
    }).format(val);
};

export const numberToWord = (num) => {
    console.log(num);
    const a = [
        "",
        "one",
        "two",
        "three",
        "four",
        "five",
        "six",
        "seven",
        "eight",
        "nine",
        "ten",
        "eleven",
        "twelve",
        "thirteen",
        "fourteen",
        "fifteen",
        "sixteen",
        "seventeen",
        "eighteen",
        "nineteen",
    ];
    const b = ["", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
    num = parseInt(num).toString();
    if (num.length > 9) {
        return "overflow";
    }
    let n = ("000000000" + num)
        .substring(num.length, num.length + 9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = "";
    str += n[1] != 0 ? (a[parseInt(n[1])] || b[n[1][0]] + " " + a[n[1][1]]) + " crore " : "";
    str += n[2] != 0 ? (a[parseInt(n[2])] || b[n[2][0]] + " " + a[n[2][1]]) + " lakh " : "";
    str += n[3] != 0 ? (a[parseInt(n[3])] || b[n[3][0]] + " " + a[n[3][1]]) + " thousand " : "";
    str += n[4] != 0 ? (a[parseInt(n[4])] || b[n[4][0]] + " " + a[n[4][1]]) + " hundred " : "";
    str +=
        n[5] != 0
            ? (str != "" ? "and " : "") + (a[parseInt(n[5])] || b[n[5][0]] + " " + a[n[5][1]])
            : "";
    return str.trim();
};
