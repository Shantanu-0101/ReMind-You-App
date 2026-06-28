import React from "react";
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import { Text, View } from "react-native/";

import HomeScreen from '../screens/HomeScreen'
import CreateReminderScreen from '../screens/CreateReminderScreen'
import EditReminderScreen from '../screens/EditReminderScreen'
 


const Stack = createNativeStackNavigator()

export default function AppNavigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">

                <Stack.Screen
                name="Home"
                component={HomeScreen}
                options={{
                    title: 'Reminders',
                    headerShown: false
                    
                }} 
                />
                    
                <Stack.Screen
                name="Create"
                component={CreateReminderScreen}
                options={{
                    title: 'Create Reminder',
                    headerStyle: {
                        backgroundColor: '#1a1932',                         
                    },
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                    
                }}
                />

                <Stack.Screen 
                name="Edit"
                component={EditReminderScreen}
                options={{
                    title: 'Edit Reminder',
                    headerStyle: {
                        backgroundColor: '#1a1932',                         
                    },
                    headerTintColor: '#fff',
                    headerTitleAlign: 'center',
                }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

