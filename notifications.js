// Sample notifications data
const notifications = [
    {
        id: 1,
        location: 'Amman - Sweileh',
        status: 'full',
        timestamp: new Date('2025-05-21T10:30:00'),
        type: 'urgent'
    },
    {
        id: 2,
        location: 'Amman - Jubaiha',
        status: 'almostFull',
        timestamp: new Date('2025-05-21T09:45:00'),
        type: 'warning'
    },
    {
        id: 3,
        location: 'Zarqa - Downtown',
        status: 'almostFull',
        timestamp: new Date('2025-05-21T09:15:00'),
        type: 'warning'
    }
];

// Function to create a notification element
function createNotificationElement(notification) {
    const div = document.createElement('div');
    div.className = 'p-4 hover:bg-gray-50 transition';
    
    const statusClass = notification.type === 'urgent' ? 'text-red-600' : 'text-yellow-600';
    const statusIcon = notification.type === 'urgent' ? '🔴' : '🟡';
    
    div.innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <h4 class="font-semibold ${statusClass} mb-1">
                    ${statusIcon} ${getStatusText(notification.status)} - ${notification.location}
                </h4>
                <p class="text-sm text-gray-600">
                    ${formatTimestamp(notification.timestamp)}
                </p>
            </div>
            <button onclick="markAsRead(${notification.id})" 
                    class="px-3 py-1 text-sm bg-green-100 text-green-700 rounded hover:bg-green-200 transition">
                Mark as Read
            </button>
        </div>
    `;
    
    return div;
}

// Function to format the timestamp in English
function formatTimestamp(timestamp) {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);

    if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (hours < 24) {
        return `${hours} hours ago`;
    } else {
        return timestamp.toLocaleDateString('en-US');
    }
}

// Function to get status text in English
function getStatusText(status) {
    switch(status) {
        case 'full':
            return 'Full Box';
        case 'almostFull':
            return 'Almost Full Box';
        default:
            return '';
    }
}

// Function to mark notification as read
function markAsRead(notificationId) {
    // Here you would typically send a request to your backend
    console.log(`Marking notification ${notificationId} as read`);
    // Remove the notification from the UI
    const notification = document.querySelector(`[data-notification-id="${notificationId}"]`);
    if (notification) {
        notification.remove();
    }
}

// Function to add new notification
function addNewNotification(notification) {
    const notificationsList = document.getElementById('notificationsList');
    const notificationElement = createNotificationElement(notification);
    notificationsList.insertBefore(notificationElement, notificationsList.firstChild);
}

// Initial load of notifications
window.addEventListener('DOMContentLoaded', () => {
    const notificationsList = document.getElementById('notificationsList');
    notifications.forEach(notification => {
        const notificationElement = createNotificationElement(notification);
        notificationsList.appendChild(notificationElement);
    });

    // Simulate receiving new notifications
    setInterval(() => {
        // Simulate a 20% chance of receiving a new notification
        if (Math.random() < 0.2) {
            const locations = ['Amman - Abdali', 'Mafraq', 'Aqaba', 'Salt', 'Karak'];
            const newNotification = {
                id: Date.now(),
                location: locations[Math.floor(Math.random() * locations.length)],
                status: Math.random() < 0.3 ? 'full' : 'almostFull',
                timestamp: new Date(),
                type: Math.random() < 0.3 ? 'urgent' : 'warning'
            };
            addNewNotification(newNotification);

            // Show browser notification if permitted
            if (Notification.permission === 'granted') {
                new Notification('New Notification from It3am', {
                    body: `${getStatusText(newNotification.status)} at ${newNotification.location}`,
                    icon: './image/food.jpg'
                });
            }
        }
    }, 30000); // Check every 30 seconds
});

// Request notification permissions
if ('Notification' in window) {
    Notification.requestPermission();
}