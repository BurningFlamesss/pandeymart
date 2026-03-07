import CryptoJS from "crypto-js"
import { ESEWA_CONFIG } from "@/server/payment/paymentConfig"

export function generateEsewaSignature(
    total_amount: number,
    transaction_uuid: string,
    product_code: string
) {
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`
    const hash = CryptoJS.HmacSHA256(message, ESEWA_CONFIG.SECRET_KEY)
    return CryptoJS.enc.Base64.stringify(hash)
}