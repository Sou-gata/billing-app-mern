const baseUrl = "http://localhost:7684";
const baseApiUrl = baseUrl + "/api/v1";
export const baseProductsUrl = baseApiUrl + "/products";
export const baseBillsUrl = baseApiUrl + "/bills";
export const baseUserUrl = baseApiUrl + "/users";

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

export const formatDateTime = (date) => {
    return formatDate(date) + " " + formatTime(date);
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

export const numberToWord = (num = 0) => {
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
    const b = [
        "",
        "",
        "twenty",
        "thirty",
        "forty",
        "fifty",
        "sixty",
        "seventy",
        "eighty",
        "ninety",
    ];
    num = parseInt(num).toString();
    if (num.length > 9) {
        return "overflow";
    }
    let n = ("000000000" + num)
        .substring(num.length, num.length + 9)
        .match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return;
    let str = "";
    if (n[1] != 0 && n[1] != "00") {
        if (a[parseInt(n[1])]) {
            str += a[parseInt(n[1])];
        } else {
            str += b[parseInt(n[1][0])] + " " + a[parseInt(n[1][1])];
        }
        str += " crore ";
    }
    if (n[2] != 0 && n[2] != "00") {
        if (a[parseInt(n[2])]) {
            str += a[parseInt(n[2])];
        } else {
            str += b[parseInt(n[2][0])] + " " + a[parseInt(n[2][1])];
        }
        str += " lakh ";
    }
    if (n[3] != 0 && n[3] != "00") {
        if (a[parseInt(n[3])]) {
            str += a[parseInt(n[3])];
        } else {
            str += b[parseInt(n[3][0])] + " " + a[parseInt(n[3][1])];
        }
        str += " thousand ";
    }
    if (n[4] != 0 && n[4] != "00") {
        if (a[parseInt(n[4])]) {
            str += a[parseInt(n[4])];
        } else {
            str += b[parseInt(n[4][0])] + " " + a[parseInt(n[4][1])];
        }
        str += " hundred ";
    }
    if (n[5] != 0 && n[5] != "00") {
        if (a[parseInt(n[5])]) {
            str += a[parseInt(n[5])];
        } else {
            str += b[parseInt(n[5][0])] + " " + a[parseInt(n[5][1])];
        }
    }
    return str.trim();
};

export function rupeeToWord(num = 0) {
    let main = parseRupee(num);
    main = main.split(".");
    let final = "";
    if (main.length >= 2) {
        final += numberToWord(main[0]) + " rupees ";
        if (main[1] != "00" && main[1] != 0) {
            final += numberToWord(main[1]) + " paisa";
        }
    } else {
        final += numberToWord(main[0]) + " rupees";
    }
    final = final.charAt(0).toUpperCase() + final.slice(1);
    return final.trim();
}

export function approxRupee(num = 0) {
    let val = isNaN(parseFloat(num)) ? 0 : parseFloat(num);
    let final = Math.round(val);
    final = parseRupee(final);
    return final;
}

export function nameToInitials(name) {
    let initials = name.match(/\b\w/g) || [];
    initials = ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
    return initials;
}
