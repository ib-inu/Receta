import { TIMEOUT_SEC } from "./config.js";

const timeout = function (s) {
    return new Promise(function (_, reject) {
        setTimeout(function () {
            reject(new Error(`Request took too long! Timeout after ${s} second`));
        }, s * 1000)
    })
}

export const getJSON = async function (url) {
    try {

        const res = await Promise.race([fetch(url), timeout(TIMEOUT_SEC)]);
        if (!res.ok) throw new Error(res.status)
        const { status, data } = await res.json();
        if (status !== "success") throw new Error("Invalid id");
        return data

    } catch (e) {
        throw e;
    }

}

export const sendJSON = async function (url, uploadData) {
    try {
        const fetchPro = fetch(url, {
            method: "POST",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(uploadData),
        });

        const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
        const resData = await res.json();

        if (!res.ok) {
            throw new Error(`${res.status} - ${resData.message || 'Bad Request'}`);
        }

        return resData;
    } catch (e) {
        throw e;
    }

}