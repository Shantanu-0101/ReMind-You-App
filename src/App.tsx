import React, {useEffect} from "react";
import { getReminders } from "./services/StorageService";
import { rescheduleAllReminders } from "./services/NotificationService";
import notifee from '@notifee/react-native'
import AppNavigator from "./navigation/AppNavigator";
import SplashScreen from 'react-native-splash-screen'
import BackgroundFetch from "react-native-background-fetch";


const initBackgroundFetch = async () => {
    await BackgroundFetch.configure(
        {
            minimumFetchInterval: 60,
            startOnBoot: true,
            stopOnTerminate: false
        },
        async (taskId) => {
            const reminders = await getReminders()
            await rescheduleAllReminders(reminders)
            BackgroundFetch.finish(taskId)
        },
        (taskId) => {
            BackgroundFetch.finish(taskId)
        }
    )
}

export default function App() {
    useEffect(() => {
        const init = async () => {
            await notifee.requestPermission()

            const reminders = await getReminders()
            await rescheduleAllReminders(reminders)
            SplashScreen.hide()
        }
        init()
        initBackgroundFetch()
    }, [])

    return (
        <AppNavigator/>
    )
}