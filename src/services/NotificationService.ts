import notifee, {AndroidImportance, TriggerType} from '@notifee/react-native'    
import {v4 as uuidv4} from 'uuid'
import {Reminder} from '../types'
import {generateRandomTimes, isTodayActive} from '../utils/timeUtils'
import {deleteReminder, updateReminder} from './StorageService'

export const createChannel = async (): Promise<void> => {

        //1) Sound ON, Vibration ON
        await notifee.createChannel({
            id: 'reminders-sound-vibe',
            name: 'Reminders (Sound & Vibration)',
            importance: AndroidImportance.HIGH,
            sound: 'default',
            vibration: true,
        });

        //2) Sound ON, Vibration OFF
        await notifee.createChannel({
            id: 'reminders-sound-only',
            name: 'Reminders (Sound Only)',
            importance: AndroidImportance.HIGH,
            sound:'default',
            vibration: false,
        });

        //3) Sound OFF, Vibration ON
        await notifee.createChannel({
            id:'reminders-vibe-only',
            name:'Reminder (Vibration Only)',
            importance: AndroidImportance.HIGH,
            vibration:true,
            sound:undefined,
        });

        //4) Sound OFF, Vibration OFF
        await notifee.createChannel({
            id:'reminders-silent',
            name:'Reminder (Silent)',
            importance: AndroidImportance.HIGH,
            vibration:false,
            sound: undefined
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

    const getChannelID = (sound:boolean, vibration:boolean) => {
        if (sound && vibration) return 'reminders-sound-vibe';
        if (sound && !vibration) return 'reminders-sound-only';
        if (!sound && vibration) return 'reminders-vibe-only';
        return 'reminders-silent';
    };

    const channelId = getChannelID(reminder.sound, reminder.vibration);

        await notifee.createTriggerNotification(
            {
                id: notificationIds,
                title: 'Reminder',
                body: reminder.text,
                android: {
                    channelId: channelId,
                    importance: reminder.sound || reminder.vibration ? AndroidImportance.HIGH : AndroidImportance.DEFAULT,
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

