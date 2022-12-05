import { v4 } from "uuid";

export function genId() {
    return v4().split("-").join("");
}

/**
 * delete keys of object => return object without keys
 * @param object
 * @param keys
 * @returns object without keys
 */
export function exclude<T, K extends keyof T>(object: T, ...keys: K[]) {
    for (const key of keys) {
        delete object[key];
    }
    return object;
}
