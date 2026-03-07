export const ESEWA_CONFIG = {
    MERCHANT_ID: process.env.ESEWA_MERCHANT_ID!,
    SECRET_KEY: process.env.ESEWA_SECRET_KEY!,
    PAYMENT_URL: "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
    VERIFY_URL: "https://rc-epay.esewa.com.np/api/epay/transaction/status/",
}