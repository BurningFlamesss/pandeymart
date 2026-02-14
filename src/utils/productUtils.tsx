import type { CustomizationGroup } from "@/types/Product";

export const calculateItemUnitPrice = (
    basePrice: number,
    customizations: Array<CustomizationGroup> = []
) => {
    const customizationTotal = customizations.reduce((sum, group) => {
        return sum + group.options.reduce((groupSum, option) => groupSum + (option.additionalPrice ?? 0), 0)
    }, 0)

    return (basePrice ?? 0) + customizationTotal
}
