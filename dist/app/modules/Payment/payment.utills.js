"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const configs_1 = require("../../configs");
const initiatePayment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const res = yield axios_1.default.post(configs_1.config.payment_url, {
        store_id: configs_1.config.store_id,
        signature_key: configs_1.config.signature_key,
        tran_id: data === null || data === void 0 ? void 0 : data.txn,
        success_url: `https://glamora-server-deployment.vercel.app/api/payment/confirmation?id=${data.orderId}`,
        fail_url: "http://www.merchantdomain.com/failedpage.html",
        cancel_url: "http://www.merchantdomain.com/cancellpage.html",
        amount: data.orderData,
        currency: "BDT",
        desc: "Merchant Registration Payment",
        cus_name: data.customerData.name,
        cus_email: data.customerData.email,
        cus_add1: data.customerData.address,
        cus_add2: "N/A",
        cus_city: "N/A",
        cus_state: "N/A",
        cus_postcode: "N/A",
        cus_country: "N/A",
        cus_phone: data.customerData.mobile,
        type: "json",
    });
    return res;
});
exports.initiatePayment = initiatePayment;
