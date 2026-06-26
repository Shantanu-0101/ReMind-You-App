import React, {useEffect} from "react";
import { getReminders } from "./services/StorageService";
import { rescheduleAllReminders } from "./services/NotificationService";
import notifee from '@notifee/react-native'
import AppNavigator from "./navigation/AppNavigator";
import SplashScreen from 'react-native-splash-screen'



export default function App() {
    useEffect(() => {
        const init = async () => {
            await notifee.requestPermission()

            const reminders = await getReminders()
            await rescheduleAllReminders(reminders)
            SplashScreen.hide()
        }
        init()
    }, [])

    return (
        <AppNavigator/>
    )
}