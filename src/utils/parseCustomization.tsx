import type { Prisma } from "@/generated/prisma/client"

export type CustomizationGroup = {
    optionGroupId: string
    groupName: string
    options: Array<string>
}

export type AdminPanelOrder = Prisma.OrderGetPayload<{
    include: {
        items: true
        user: true
    }
}>

export function parseCustomizations(raw: Prisma.JsonValue): Array<CustomizationGroup> {
    if (!Array.isArray(raw)) return []
    return raw.filter(
        (group): group is CustomizationGroup =>
            typeof group === "object" &&
            group !== null &&
            "optionGroupId" in group &&
            "groupName" in group &&
            "options" in group &&
            Array.isArray((group as CustomizationGroup).options)
    )
}