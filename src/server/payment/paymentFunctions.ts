import CryptoJS from "crypto-js"
import { ESEWA_CONFIG } from "@/server/payment/paymentConfig"

export function hmacSha256Base64(message: string, secret: string): string {
    const hash = CryptoJS.HmacSHA256(message, secret)
    return CryptoJS.enc.Base64.stringify(hash)
}

export function generateEsewaSignature(
    total_amount: number,
    transaction_uuid: string,
    product_code: string
) {
    const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`
    return hmacSha256Base64(message, ESEWA_CONFIG.SECRET_KEY)
}