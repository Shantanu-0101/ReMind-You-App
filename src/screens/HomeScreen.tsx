import React, { useState, useCallback } from 'react'
import {
  View, Text, FlatList, TouchableOpacity,
  StyleSheet, StatusBar
} from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getReminders } from '../services/StorageService'
import { rescheduleAllReminders } from '../services/NotificationService'
import { Reminder } from '../types'
import { SafeAreaView } from 'react-native-safe-area-context'
import ReminderCard from '../components/ReminderCard'
import { RootStackParamList } from '../types'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { Alert } from 'react-native'
import Clipboard from '@react-native-clipboard/clipboard'


const handleFeedback = () => {
  Clipboard.setString('shantanupanchal.dev@gmail.com')
  Alert.alert(
    'Feedback & Support',
    'Our email has been copied to your clipboard:\nshantanupanchal.dev@gmail.com\n\nPaste it in your email app for any inquiries, bug reports, or suggestions.',
    [{ text: 'Got it', style: 'default' }]
  )
}

export default function HomeScreen() {
  const [reminders, setReminders] = useState<Reminder[]>([])
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>()

  useFocusEffect(
    useCallback(() => {
      const init = async () => {
        const data = await getReminders()
        setReminders(data)
        await rescheduleAllReminders(data)
      }
      init()
    }, [])
  )

  const renderItem = ({ item }: { item: Reminder }) => (
    <View style={styles.row}>
      <Text style={styles.rowText}>{item.text}</Text>
      <TouchableOpacity
        style={styles.gearBtn}
        onPress={() => navigation.navigate('Edit', { reminderId: item.id })}
      >
        <Icon name="cog" size={20} color="#fff" />
      </TouchableOpacity>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a2e" />

      {/* Title */}
      <View style={styles.titleRow}>
        <View style={{ width: 28 }} />
        <Text style={styles.title}>Reminders</Text>
        <TouchableOpacity onPress={handleFeedback}>
          <Icon name="comment" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* List or Empty State */}
      {reminders.length === 0 ? (
        <View style={styles.emptyState}>
          <Icon name="bell-slash" size={48} color="#333" />
          <Text style={styles.emptyText}>No reminders yet</Text>
          <Text style={styles.emptySubText}>Tap  +  to create one</Text>
        </View>
      ) : (
        <FlatList
          data={reminders}
          keyExtractor={(item) => item.id}
          renderItem={({item}) => (
            <ReminderCard 
            reminder={item}
            onEdit={() => navigation.navigate('Edit', {reminderId: item.id})}
            />
          )}
          style={styles.list}
        />
      )}

      {/* Bottom Create Button */}
      <TouchableOpacity
        style={styles.createButton}
        onPress={() => navigation.navigate('Create')}
      >
        <Icon name="plus" size={16} color="#fff" />
        <Text style={styles.createButtonText}>Create Reminder</Text>
      </TouchableOpacity>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#242436',
  },
  
  titleRow: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#2a2a3e',
},

  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#242436',
    backgroundColor: '#242436',
  },
  list: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
  rowText: {
    fontSize: 20,
    color: '#fff',
    flex: 1,
    marginRight: 12,
  },
  gearBtn: {
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#888',
  },
  createButton: {
    backgroundColor: '#5B4FE9',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '500',
  },
})