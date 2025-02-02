import axios from "axios";
import { config } from "../../configs";


export const initiatePayment = async (data: any) => {
  const res = await axios.post(config.payment_url as string, {
    store_id: config.store_id,
    signature_key: config.signature_key,
    tran_id: data?.txn,
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
};