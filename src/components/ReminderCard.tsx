import React from "react";
import {View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome';
import { Reminder } from "../types";


type Props = {
    reminder: Reminder
    onEdit: () => void
}

const ReminderCard = ({reminder, onEdit}: Props) => {

    return (
        <View style={styles.card}>

            <Text style={styles.reminderText} numberOfLines={1}>
                {reminder.text}
            </Text>
            <TouchableOpacity onPress={onEdit} style={styles.settingsBtn}>
                <Icon name="cog" size={30} color={'#888'}/>
            </TouchableOpacity>
            
        </View>
    )
}


export default ReminderCard

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2a2a3e',
  },
 
  reminderText: {
    fontSize: 17,
    fontWeight: '400',
    color: '#fff',
    flex: 1,
    marginRight: 12,
  },
  settingsBtn: {
    padding: 4,
    width: 44,
    height: 44,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
    
  },

})