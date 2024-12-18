"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pickField = void 0;
const pickField = (obj, arr) => {
    const finalObject = {};
    for (const key of arr) {
        if (Object.hasOwnProperty.call(obj, key)) {
            finalObject[key] = obj[key];
        }
    }
    return finalObject;
};
exports.pickField = pickField;
