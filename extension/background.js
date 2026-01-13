chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'QUESTION_DETECTED') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'iClicker Question Detected',
      message: `Question: ${message.question.substring(0, 100)}...`,
      priority: 2
    });
  } else if (message.type === 'ERROR') {
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icon.png',
      title: 'Error',
      message: message.message,
      priority: 2
    });
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('lazyClicker installed (Secure Mode)');
});