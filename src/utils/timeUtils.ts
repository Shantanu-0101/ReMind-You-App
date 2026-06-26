
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
    frequency: number
): Date[] => {

    const startDate = timeToMinutes(startTime)
    const endDate = timeToMinutes(endTime)
    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()
    const range = endMinutes - startMinutes

    // Cap frequency to available range
    const cappedFrequency = Math.min(frequency, range)

    const times = new Set<number>()

    while (times.size < frequency) {
        const randomMinute = Math.floor(Math.random() * range ) + startMinutes
        times.add(randomMinute)

    }

    return Array.from(times)
    .sort((a,b) => a-b)
    .map(minutesToDate)
}

export const isTodayActive = (activeDays: number[]): boolean => {
    const today = new Date().getDay()
    return activeDays.includes(today)
}

