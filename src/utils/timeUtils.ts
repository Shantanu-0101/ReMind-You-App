
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

export const generateRandomTimes = (
    startTime: string,
    endTime: string,
    frequency: number,
    activeDays: number[] = [0,1,2,3,4,5,6],
    daysToSchedule: number = 7
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

    for (let dayOffset = 0; dayOffset < daysToSchedule; dayOffset++) {
        const targetDate = new Date(baseToday)
        targetDate.setDate(targetDate.getDate() + dayOffset)
        
        if (activeDays.includes(targetDate.getDay())) {
            const timesForDay = new Set<number>()
            
            // Distribute randomly across chunks
            for (let i = 0; i < cappedFrequency; i++) {
                const chunkStart = startMinutes + (i * chunkDuration)
                const randomMinuteInChunk = chunkStart + Math.floor(Math.random() * chunkDuration)
                timesForDay.add(randomMinuteInChunk)
            }
            
            Array.from(timesForDay).forEach(minutes => {
                const hours = Math.floor(minutes / 60)
                const remaining = minutes % 60
                
                const finalDate = new Date(targetDate)
                finalDate.setHours(hours, remaining, 0, 0)
                allTimes.push(finalDate)
            })
        }
    }

    return allTimes.sort((a,b) => a.getTime() - b.getTime())
}

export const isTodayActive = (activeDays: number[]): boolean => {
    const today = new Date().getDay()
    return activeDays.includes(today)
}

