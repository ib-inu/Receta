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


export function useLocalStorageState(key, initialState) {
    // Retrieve stored value from localStorage, or use the initial state if none exists
    let storedValue = localStorage.getItem(key);
    let value = storedValue ? JSON.parse(storedValue) : initialState;

    // Function to update both the state and localStorage
    function setValue(newValue) {
        value = newValue; // Update the internal value
        localStorage.setItem(key, JSON.stringify(newValue)); // Save to localStorage
    }

    // Return the value and setter function
    return [value, setValue];
}
