import {Alert, TouchableOpacity} from 'react-native'
import { View, Text, TextInput, StatusBar, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native'
import { v4 as uuidv4 } from 'uuid'
import { setReminder } from '../services/StorageService'
import { scheduleReminder } from '../services/NotificationService'
import { Reminder } from '../types'
import Slider from '@react-native-community/slider';
import { ScrollView, Switch } from 'react-native'
import { timeToMinutes } from '../utils/timeUtils'


const CreateReminderScreen = () => {

    const [text, setText] = useState('')
    const [startTime, setStartTime] = useState('08:00')
    const [endTime, setEndTime] = useState('22:00')
    const [frequency, setFrequency] = useState(5)
    const [activeDays, setActiveDays] = useState<number[]>([0,1,2,3,4,5,6])
    const [vibration, setVibration] = useState(true)
    const [sound, setSound] = useState(true)

    const navigation = useNavigation()

    const handleSave = async () => {

        // Empty text check
        if (!text.trim()) {
            Alert.alert('Missing Text', 'Please enter a reminder message')
            return
        }

        //Negative Range Check
        if (timeToMinutes(startTime) >= timeToMinutes(endTime)) {
            Alert.alert('Invalid Times', 'Start time must be before end time')
            return
        }

        //No active Days Check
        if (activeDays.length === 0) {
            Alert.alert('No Active Days', 'Please select atleast one day')
            return
        }

        const newReminder: Reminder = {
            id: uuidv4(),
            text,
            startTime,
            endTime,
            frequency: Number(frequency),
            activeDays,
            vibration,
            sound,
            isActive: true,
            notificationIds: [],
        }
        await setReminder(newReminder)
        await scheduleReminder(newReminder)
        navigation.goBack()
    }

    {/* Day Selector */}
    const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    const toggleDay = (dayIndex: number) => {
        if (activeDays.includes(dayIndex)){
            setActiveDays(activeDays.filter(d => d !== dayIndex))
        } else {
            setActiveDays([...activeDays, dayIndex])
        }
    }

    const formatTime = (date: Date): string => {
        const hours   = date.getHours().toString().padStart(2, '0')
        const minutes = date.getMinutes().toString().padStart(2, '0')
        return `${hours}:${minutes}`
        }

    const incrementHour = (time: string, increment: number): string => {
        const [hours, minutes] = time.split(':').map(Number)
        let newHours = (hours + increment + 24) % 24
        return `${newHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    }


    const incrementMinute = (time: string, increment: number): string => {
        const [hours, minutes] = time.split(':').map(Number)
        let totalMinutes = hours * 60 + minutes + increment
        totalMinutes = ((totalMinutes % (24 * 60)) + 24 * 60) % (24 * 60)
        const newHours = Math.floor(totalMinutes / 60)
        const newMinutes = totalMinutes % 60
        return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
    }

    const formatDisplayTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number)
        const period = hours >= 12 ? 'PM' : 'AM'
        const displayHours = hours % 12 || 12
        return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`
    }


    const TimeRow = ({
    label,
    time,
    setTime,
    }: {
    label: string
    time: string
    setTime: (t: string) => void
    }) => (
    <View style={styles.timeRow}>
        <Text style={styles.timeLabel}>{label}</Text>
        <Text style={styles.timeDisplay}>{formatDisplayTime(time)}</Text>
        <View style={styles.timeButtons}>
        <TouchableOpacity
            style={styles.timeBtn}
            onPress={() => setTime(incrementHour(time, -1))}>
            <Text style={styles.timeBtnText}>−</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={styles.timeBtn}
            onPress={() => setTime(incrementHour(time, 1))}>
            <Text style={styles.timeBtnText}>+</Text>
        </TouchableOpacity>
        </View>
    </View>
    )
    

  return (
    <ScrollView
    style={styles.screen}
    >

    <StatusBar />

    {/* Text */}
    <View style={styles.container}>
        <Text style={styles.label}>Reminder Text</Text>
        <TextInput
            style={styles.input}
            maxLength={100}
            value={text}
            onChangeText={setText}
            placeholder='Write You Reminder Here'
            multiline
        />

    <TimeRow label="Starting at:" time={startTime} setTime={setStartTime} />
    <TimeRow label="Ending at:"   time={endTime}   setTime={setEndTime} />

    {/* Frequency Bar */}
      <Text style={styles.label}>Selected Frequency: {frequency} </Text>
      <Slider
        style={{ width: 300, height: 40 }}
        minimumValue={5}
        maximumValue={100}
        step={1}
        value={frequency}
        onValueChange={setFrequency}
      />

       {/* Active Days Sextion  */}
      <Text style={styles.label}>Which days should this reminder be sent?</Text>
      <View style={styles.daysRow}>
        {DAYS.map((day, index) => (
            <TouchableOpacity
            key={index}
            onPress={() => toggleDay(index)}
            style={[
                styles.dayButton,
                activeDays.includes(index) && styles.dayButtonActive
            ]}
            >
                <Text style={[
                    styles.dayText,
                    activeDays.includes(index) && styles.dayTextActive
                ]}>
                    {day}
                </Text>
            </TouchableOpacity>
        ))}
      </View>

      {/* Viration and Sound Toggles */}

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel} >Vibration</Text>
        <Switch 
        value={vibration}
        onValueChange={setVibration}
        trackColor={{false: '#2a2a3e', true: '#5B4FE9'}}
        thumbColor={'#fff'}
        />
      </View>

      <View style={styles.toggleRow}>
        <Text style={styles.toggleLabel}>Sound</Text>
        <Switch 
        value={sound}
        onValueChange={setSound}
        trackColor={{false: '#2a2a3e', true: '#5B4FE9'}}
        thumbColor={'#fff'}
        />
      </View>

    {/* Save Button */}
    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
    </TouchableOpacity>

    </View>
    </ScrollView>
  )
}

export default CreateReminderScreen

const styles = StyleSheet.create({

  // ── Layout ──────────────────────────────
  screen: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  container: {
    padding: 20,
    paddingBottom: 48,
  },

  // ── Header ──────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },

  // ── Labels & Inputs ──────────────────────
  label: {
    fontSize: 11,
    color: '#fff',
    marginTop: 24,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: '#12122a',
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    padding: 14,
    fontSize: 16,
    color: '#fff',
    minHeight: 80,
    textAlignVertical: 'top',
  },

  // ── Time Rows ────────────────────────────
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  timeLabel: {
    fontSize: 20,
    fontWeight: '500',
    color: '#fff',
    flex: 1,
  },
  timeDisplay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginRight: 12,
  },
  timeButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  timeBtn: {
    backgroundColor: '#5B4FE9',
    width: 44,
    height: 35,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeBtnText: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '300',
  },

  // ── Slider ───────────────────────────────
  sliderLabel: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginTop: 24,
    marginBottom: 8,
  },
  slider: {
    width: '100%',
    height: 40,
  },

  // ── Day Selector ─────────────────────────
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#2a2a3e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayButtonActive: {
    backgroundColor: '#5B4FE9',
    borderColor: '#5B4FE9',
  },
  dayText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '500',
  },
  dayTextActive: {
    color: '#fff',
  },

  // ── Toggles ──────────────────────────────
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  toggleLabel: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
  },

  // ── Buttons ──────────────────────────────
  saveButton: {
    backgroundColor: '#5B4FE9',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
    height: 55
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  deleteButton: {
    backgroundColor: 'transparent',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#c0392b',
  },
  deleteButtonText: {
    color: '#c0392b',
    fontSize: 16,
    fontWeight: '600',
  },
})