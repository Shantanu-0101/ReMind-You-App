import notifee, {AndroidImportance, TriggerType} from '@notifee/react-native'    
import {v4 as uuidv4} from 'uuid'
import {Reminder} from '../types'
import {generateRandomTimes, isTodayActive} from '../utils/timeUtils'
import {deleteReminder, updateReminder} from './StorageService'

export const createChannel = async (): Promise<void> => {
    
        await notifee.createChannel({
            id: 'reminders',
            name: 'Random Reminders',
            importance: AndroidImportance.HIGH,
        })
}


export const scheduleReminder = async (reminder: Reminder): Promise<Reminder> => {

    if (!reminder.isActive) return reminder
    if (!isTodayActive(reminder.activeDays)) return reminder

    await cancelReminder(reminder)

    const times = generateRandomTimes(
        reminder.startTime,
        reminder.endTime,
        reminder.frequency
    )

    const now = new Date()
    const scheduledIds: string[] = []

    for (const triggerDate of times) {
        if (triggerDate <= now) continue

        const notificationIds = uuidv4()

        await notifee.createTriggerNotification(
            {
                id: notificationIds,
                title: 'Reminder',
                body: reminder.text,
                android: {
                    channelId: 'reminders',
                    importance: AndroidImportance.HIGH,
                    vibrationPattern: reminder.vibration ? [300, 500] : undefined,
                    sound: reminder.sound ? 'default' : undefined,
                    pressAction: {id: 'default'},
                },
            },
            {
                type: TriggerType.TIMESTAMP,
                timestamp: triggerDate.getTime(),
            }
        )

        scheduledIds.push(notificationIds)
    }

    const updated: Reminder = {...reminder, notificationIds: scheduledIds}
    await updateReminder(updated)

    return updated

}


export const cancelReminder = async (reminder: Reminder): Promise<void> => {
    if (reminder.notificationIds?.length > 0) {
        for (const id of reminder.notificationIds) {
            await notifee.cancelNotification(id)
        }
    }
}


export const rescheduleAllReminders = async (reminders: Reminder[]): Promise<void> => {
    await createChannel()

    for (const reminder of reminders) {
        if (reminder.isActive) {
            await scheduleReminder(reminder)
        }
    }
}

