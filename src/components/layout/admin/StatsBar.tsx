import { cn } from "@/lib/utils"

export function StatsBar({ stats }: { stats: Array<{ change: string, label: string, positive: boolean | null, value: string }> }) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-6">
            {stats.map(({ change, label, positive, value }) => {
                return (
                    <div key={label} className='bg-zinc-100 border border-zinc-200 rounded-xl px-5 py-4'>
                        <p className='text-xs text-zinc-700 uppercase tracking-wider mb-1'>{label}</p>
                        <p className='text-xl font-semibold text-zinc-900'>{value}</p>
                        <p className={cn('text-xs mt-1', positive === true ? "text-green-500" : positive === false ? "text-yellow-500" : "text-gray-800")}>{change}</p>
                    </div>
                )
            })}
        </div>
    )
}