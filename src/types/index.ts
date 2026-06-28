export type Reminder = {
    id: string
    text: string
    startTime: string
    endTime: string
    frequency: number
    activeDays: number[]
    vibration: boolean
    sound: boolean
    isActive: boolean
    notificationIds: string[]
}

export type RootStackParamList = {
  Home: {testRemider?: Reminder} | undefined;
  Create: undefined
  Edit: { reminderId: string }
}