chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: `Reminder: ${alarm.name}`,
      message: 'You have a reminder!',
      priority: 2
    });
  });
  