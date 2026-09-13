
export const timeToMinutes = (time: string): Date => {

    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours)
    date.setMinutes(minutes)
    date.setSeconds(0)
    return date
}


export const minutesToDate = (minutes: number): Date => {

    const today = new Date()
    const hours = Math.floor(minutes / 60)
    const remaining = minutes % 60

    today.setHours(hours)
    today.setMinutes(remaining)
    today.setSeconds(0)
    today.setMilliseconds(0)

    return today

}

const MIN_GAP_MINUTES = 2

const collidesWith = (candidateMinutes: number, excludedMs: number[], dayBase: Date): boolean => {
    const candidateMs = new Date(dayBase).setHours(
        Math.floor(candidateMinutes / 60),
        candidateMinutes % 60,
        0, 0
    )
    return excludedMs.some(ts => Math.abs(ts - candidateMs) < MIN_GAP_MINUTES * 60 * 1000)
}

export const generateRandomTimes = (
    startTime: string,
    endTime: string,
    frequency: number,
    activeDays: number[] = [0,1,2,3,4,5,6],
    daysToSchedule: number = 7,
    excludedTimestamps: number[] = []
): Date[] => {

    const startDate = timeToMinutes(startTime)
    const endDate = timeToMinutes(endTime)
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()
    const range = endMinutes - startMinutes

    // Cap frequency to available range
    const cappedFrequency = Math.min(frequency, Math.max(1, range))
    const chunkDuration = Math.floor(range / cappedFrequency)

    const baseToday = new Date()
    baseToday.setHours(0, 0, 0, 0)

    const allTimes: Date[] = []
    // Track timestamps already chosen in this batch so chunks within the same reminder also don't collide
    const chosenThisBatch: number[] = []

    for (let dayOffset = 0; dayOffset < daysToSchedule; dayOffset++) {
        const targetDate = new Date(baseToday)
        targetDate.setDate(targetDate.getDate() + dayOffset)

        if (activeDays.includes(targetDate.getDay())) {
            const allExcluded = [...excludedTimestamps, ...chosenThisBatch]

            for (let i = 0; i < cappedFrequency; i++) {
                const chunkStart = startMinutes + (i * chunkDuration)
                let picked: number | null = null

                // Try up to 20 times to find a non-colliding minute in this chunk
                for (let attempt = 0; attempt < 20; attempt++) {
                    const candidate = chunkStart + Math.floor(Math.random() * chunkDuration)
                    if (!collidesWith(candidate, allExcluded, targetDate)) {
                        picked = candidate
                        break
                    }
                }

                // Fallback: use chunk midpoint even if it collides (better than missing the reminder entirely)
                if (picked === null) {
                    picked = chunkStart + Math.floor(chunkDuration / 2)
                }

                const finalDate = new Date(targetDate)
                finalDate.setHours(Math.floor(picked / 60), picked % 60, 0, 0)
                allTimes.push(finalDate)
                chosenThisBatch.push(finalDate.getTime())
            }
        }
    }

    return allTimes.sort((a, b) => a.getTime() - b.getTime())
}

export const isTodayActive = (activeDays: number[]): boolean => {
    const today = new Date().getDay()
    return activeDays.includes(today)
}

