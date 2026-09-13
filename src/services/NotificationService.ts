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

let isRescheduling = false;

export const rescheduleAllReminders = async (reminders: Reminder[]): Promise<void> => {
    if (isRescheduling) return;
    isRescheduling = true;

    try {
        await createChannel()

        // Cancel ALL existing trigger notifications to prevent orphans and race conditions
        const pendingTriggers = await notifee.getTriggerNotifications()
        for (const t of pendingTriggers) {
            if (t.notification?.id) {
                await notifee.cancelNotification(t.notification.id)
            }
        }

    const now = new Date()
    const MIN_GAP_MINUTES = 5
    let allScheduled: {time: Date; reminder: Reminder }[] = []

    // Collect all times across all reminders (7 days forward)
    for (const reminder of reminders) {
        if (!reminder.isActive) continue

        const times = generateRandomTimes(
            reminder.startTime,
            reminder.endTime,
            reminder.frequency,
            reminder.activeDays,
            7
        )

        for (const time of times) {
            if (time > now) {
                allScheduled.push({ time, reminder })
            }
        }
    }

    // sort all notifications by time
    allScheduled.sort((a,b) => a.time.getTime() - b.time.getTime())

    //enforce minimum gap
    for (let i = 1; i< allScheduled.length; i++) {
        const prev = allScheduled[i - 1].time.getTime()
        const curr = allScheduled[i].time.getTime()
        const diffMinutes = (curr - prev) / (1000 * 60)

        if (diffMinutes < MIN_GAP_MINUTES) {
            // push this notification forward
            const newTime = new Date(prev + MIN_GAP_MINUTES * 60 * 1000)
            allScheduled[i].time = newTime
        }
    }

    const getChannelID = (sound: boolean, vibration: boolean) => {
        if (sound && vibration) return 'reminders-sound-vibe';
        if (sound && !vibration) return 'reminders-sound-only';
        if (!sound && vibration) return 'reminders-vibe-only';
        return 'reminders-silent';
    };

    // now schedule everything
    for (const {time, reminder} of allScheduled){
        const notificationId = uuidv4()
        const channelId = getChannelID(reminder.sound, reminder.vibration)

        await notifee.createTriggerNotification(
            {
                id: notificationId,
                title: 'Reminder',
                body: reminder.text,
                data: { reminderId: reminder.id },
                android: {
                    channelId: channelId,
                    smallIcon: 'ic_notification',
                    importance: reminder.sound || reminder.vibration ? AndroidImportance.HIGH : AndroidImportance.DEFAULT,
                    pressAction: {id: 'default'},
                },
            },
            {
                type: TriggerType.TIMESTAMP,
                timestamp: time.getTime(),
            }
        )
    }
    } finally {
        isRescheduling = false;
    }
}
