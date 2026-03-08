import { ESEWA_CONFIG } from "@/server/payment/paymentConfig"
import { formatEsewaAmount, generateEsewaSignature } from "@/server/payment/paymentFunctions"

export function createEsewaPayment({
    amount,
    orderId,
}: {
    amount: number
    orderId: string
}) {
    const transaction_uuid = orderId
    const formattedAmount = formatEsewaAmount(amount)
    const signature = generateEsewaSignature(
        amount,
        transaction_uuid,
        ESEWA_CONFIG.MERCHANT_ID
    )

    return {
        url: ESEWA_CONFIG.PAYMENT_URL,
        fields: {
            amount: formattedAmount,
            tax_amount: "0",
            total_amount: formattedAmount,
            transaction_uuid,
            product_code: ESEWA_CONFIG.MERCHANT_ID,
            product_service_charge: "0",
            product_delivery_charge: "0",
            success_url: `${process.env.APP_URL}/api/payment/esewa/success`,
            failure_url: `${process.env.APP_URL}/api/payment/esewa/failure?order=${orderId}`,
            signed_field_names: "total_amount,transaction_uuid,product_code",
            signature,
        },
    }
}