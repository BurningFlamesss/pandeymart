import type { Prisma } from "@/generated/prisma/client"

export type ParsedCustomizationGroup = {
    title: string
    options: Array<{ label: string; additionalPrice: number }>
}

export type AdminPanelOrder = Prisma.OrderGetPayload<{
    include: {
        items: true
        user: true
    }
}>

export function parseCustomizations(raw: Prisma.JsonValue): Array<ParsedCustomizationGroup> {
    if (!Array.isArray(raw)) return []
    return raw.filter(
        (group): group is ParsedCustomizationGroup =>
            typeof group === "object" &&
            group !== null &&
            "title" in group &&
            typeof (group as ParsedCustomizationGroup).title === "string" &&
            "options" in group &&
            Array.isArray((group as ParsedCustomizationGroup).options)
    )
}