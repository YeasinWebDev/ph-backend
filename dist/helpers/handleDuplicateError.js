"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handlerDuplicateError = void 0;
const handlerDuplicateError = (err) => {
    const matchedArray = err.message.match(/"([^"]*)"/);
    const duplicatedValue = (matchedArray === null || matchedArray === void 0 ? void 0 : matchedArray[1]) || "Field";
    return {
        statusCode: 400,
        message: `${duplicatedValue} already exists!!`,
    };
};
exports.handlerDuplicateError = handlerDuplicateError;
