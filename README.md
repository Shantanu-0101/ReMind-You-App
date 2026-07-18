# Re-Mind You 

A minimal, focused Android reminder app built with **React Native**. Set recurring reminders that fire throughout the day — with full control over timing, frequency, active days, sound, and vibration.

---

## Features:

- 📝 **Custom Reminder Text** — Write any message up to 100 characters
- 🕐 **Time Window** — Set a start and end time for when notifications should fire
- 🔁 **Frequency Control** — Choose how many reminders to receive per day (5–100)
- 📅 **Day Selector** — Pick which days of the week each reminder is active
- 🔔 **Sound & Vibration Toggles** — Enable or disable sound and vibration independently
- 🧪 **Test Notification** — Send a live test notification right after creating a reminder
- ✏️ **Edit & Delete** — Update or remove any reminder at any time
- 💾 **Persistent Storage** — Reminders survive app restarts via AsyncStorage
- 📵 **Active/Inactive Toggle** — Pause a reminder without deleting it
- 🔕 **Smart Channels** — Four Android notification channels (Sound+Vibration, Sound Only, Vibration Only, Silent)

---

## Screenshots

<img width="1080" height="1920" alt="1" src="https://github.com/user-attachments/assets/8f7bce48-2f3f-4f26-866a-aa1a12123b3a" />


---

## Tech Stack:

| Technology | Purpose |
|---|---|
| React Native 0.86 | Core framework |
| TypeScript | Type safety |
| React Navigation | Screen routing |
| Notifee | Scheduled notifications & channels |
| AsyncStorage | Local data persistence |
| React Native Background Fetch | Daily rescheduling |
| React Native Vector Icons | UI icons |
| UUID | Unique reminder IDs |

---

## Project Structure:

```
src/
├── screens/
│   ├── HomeScreen.tsx          # Reminder list view
│   ├── CreateReminderScreen.tsx # New reminder form
│   └── EditReminderScreen.tsx  # Edit / delete reminder
├── components/
│   └── ReminderCard.tsx        # Individual reminder list item
├── services/
│   ├── NotificationService.ts  # Schedule, cancel & reschedule notifications
│   └── StorageService.ts       # AsyncStorage CRUD operations
├── navigation/
│   └── AppNavigator.tsx        # Stack navigator setup
├── utils/
│   └── timeUtils.ts            # Time generation & day-matching helpers
├── types/
│   └── index.ts                # Shared TypeScript types
└── App.tsx                     # App entry point
```

---

## Getting Started

### Prerequisites

- Node.js >= 22.11.0
- React Native CLI environment set up ([guide](https://reactnative.dev/docs/environment-setup))
- Android Studio with an emulator or a physical Android device

### Installation

```bash
# Clone the repository
git clone https://github.com/Shantanu-0101/ReMindYou-App.git
cd ReMindYou-App

# Install dependencies
npm install

# Start the Metro bundler
npm start

# Run on Android
npm run android
```

---

## How It Works

1. **Creating a reminder** — Enter text, set a start/end time window, choose frequency and active days, and configure sound/vibration preferences. Notifications are scheduled immediately on save.

2. **Notification scheduling** — The app generates random timestamps within your chosen time window and schedules each one via Notifee's timestamp triggers. Notifications are spread across the day to keep reminders feeling organic rather than mechanical.

3. **Rescheduling** — Every time the Home screen gains focus, all active reminders are rescheduled. This ensures reminders continue working day after day without any manual intervention.

4. **Notification channels** — Four Android channels are created to honour your sound and vibration preferences at the OS level, respecting Android's notification system properly.

---

## Feedback & Support

Found a bug or have a suggestion? Email: **shantanupanchal.dev@gmail.com**

You can also tap the 💬 icon inside the app to copy the email address directly to your clipboard.

---

## License

This project is open source and available under the [MIT License](LICENSE).
