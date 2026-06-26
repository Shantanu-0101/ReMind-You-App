import {createAsyncStorage} from '@react-native-async-storage/async-storage'
import { Reminder } from '../types';

const KEY = '@reminders'

// Storage Instance
const storage = createAsyncStorage("appDB");


export const getReminders = async (): Promise<Reminder[]> => {

    const data = await storage.getItem(KEY)
    return data ? JSON.parse(data): []

}


export const setReminder = async (reminder: Reminder): Promise<void> => {

    const reminders = await getReminders()
    const updated = [...reminders, reminder]
    await storage.setItem(KEY, JSON.stringify(updated))
} 



export const updateReminder = async (updatedReminder: Reminder): Promise<void> => {

    const reminders = await getReminders()
    const updated = reminders.map(r => 
        r.id === updatedReminder.id ? updatedReminder : r
    )
    await storage.setItem(KEY, JSON.stringify(updated))
}


export const deleteReminder = async (id : string): Promise<void> => {

    const reminders = await getReminders()
    const updated = reminders.filter(r => r.id !== id)
    await storage.setItem(KEY, JSON.stringify(updated))
    
}