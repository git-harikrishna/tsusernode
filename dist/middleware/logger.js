"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const methodLogger = (req, res, next) => {
    console.log(`Request: ${req.method} - ${req.url}`);
    next();
};
exports.default = methodLogger;
