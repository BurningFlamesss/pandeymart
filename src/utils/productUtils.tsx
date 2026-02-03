import type { CustomizationGroup } from "@/types/Product";

export const calculateItemUnitPrice = (basePrice: number, customizations: Array<CustomizationGroup>) => {
    if (!customizations.length) return 0

    const customizationTotal = customizations.reduce((sum, group) => {
        return sum + group.options.reduce((groupSum, option) => groupSum + option.additionalPrice, 0)
    }, 0)

    return basePrice + customizationTotal
}