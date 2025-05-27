// Collection box locations in Jordan with their statuses
const collectionBoxes = [
    {
        id: 'amman-1',
        name: 'Al Weibdeh Collection Box',
        location: [31.9539, 35.9106],
        status: 'empty',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'Paris Circle, Al Weibdeh, Amman',
        capacity: 80
    },
    {
        id: 'amman-2',
        name: 'Abdali Collection Box',
        location: [31.9633, 35.9030],
        status: 'filling',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'Abdali Boulevard, Amman',
        capacity: 65
    },
    {
        id: 'amman-3',
        name: 'Sweifieh Collection Box',
        location: [31.9571, 35.8642],
        status: 'full',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'Ali Nasouh Al Taher St, Sweifieh, Amman',
        capacity: 100
    },
    {
        id: 'irbid-1',
        name: 'Irbid City Center Box',
        location: [32.5556, 35.8500],
        status: 'empty',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'Downtown, Irbid',
        capacity: 20
    },
    {
        id: 'zarqa-1',
        name: 'New Zarqa Collection Box',
        location: [32.0869, 36.0869],
        status: 'filling',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'New Zarqa, Zarqa',
        capacity: 45
    },
    {
        id: 'aqaba-1',
        name: 'Aqaba Port Box',
        location: [29.5267, 35.0078],
        status: 'empty',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'Port Area, Aqaba',
        capacity: 30
    },
    {
        id: 'madaba-1',
        name: 'Madaba Tourist Zone Box',
        location: [31.7160, 35.7939],
        status: 'filling',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'Tourist Street, Madaba',
        capacity: 50
    },
    {
        id: 'petra-1',
        name: 'Petra Visitor Center Box',
        location: [30.3285, 35.4444],
        status: 'empty',
        lastUpdated: '2025-05-21T10:00:00',
        address: 'Visitor Center, Petra',
        capacity: 40
    }
];

// Initialize map when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }

    // Initialize the map centered on Jordan
    const map = L.map('map').setView([31.9634, 35.9304], 7);

    // Add OpenStreetMap tiles with custom style
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add markers for each collection box
    collectionBoxes.forEach(box => {
        addBoxMarker(box, map);
    });

    // Populate box list and start real-time updates
    populateBoxList();
    simulateStatusUpdates();
});

// Add a marker for a collection box
function addBoxMarker(box, map) {
    const markerColor = getStatusColor(box.status);
    
    const marker = L.circleMarker(box.location, {
        radius: 10,
        fillColor: markerColor,
        color: '#fff',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.8
    });

    marker.bindPopup(getPopupContent(box));
    marker.addTo(map);
    boxMarkers[box.id] = marker;
}

// Get color based on box status
function getStatusColor(status) {
    switch(status) {
        case 'empty':
            return '#4caf50';
        case 'filling':
            return '#ffc107';
        case 'full':
            return '#f44336';
        default:
            return '#999';
    }
}

// Get popup content for a box
function getPopupContent(box) {
    const statusColor = getStatusColor(box.status);
    return `
        <strong>${box.name}</strong><br>
        Status: <span style="color: ${statusColor}">${box.status.toUpperCase()}</span><br>
        Capacity: <span style="color: ${statusColor}">${box.capacity}%</span><br>
        Address: ${box.address}<br>
        Last Updated: ${new Date(box.lastUpdated).toLocaleString()}
    `;
}

// Show browser notification
function showNotification(box) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Collection Box Update', {
            body: `${box.name} is now ${box.status.toUpperCase()} (${box.capacity}% full)`,
            icon: './image/logo.png'
        });
    }
}

// Global object to store markers
const boxMarkers = {};

// Populate the box list section
function populateBoxList() {
    const boxGrid = document.querySelector('.box-grid');
    boxGrid.innerHTML = '';

    collectionBoxes.forEach(box => {
        const boxElement = document.createElement('div');
        boxElement.className = 'box-card';
        boxElement.id = `box-${box.id}`;
        boxElement.innerHTML = getBoxListItemContent(box);
        boxGrid.appendChild(boxElement);
    });
}

// Get HTML content for a box list item
function getBoxListItemContent(box) {
    const statusColor = getStatusColor(box.status);
    return `
        <div class="box-card-header" style="border-left: 4px solid ${statusColor}">
            <h3>${box.name}</h3>
            <div class="capacity-indicator">
                <div class="capacity-bar" style="width: ${box.capacity}%; background-color: ${statusColor}"></div>
            </div>
        </div>
        <div class="box-card-content">
            <p><strong>Status:</strong> <span style="color: ${statusColor}">${box.status.toUpperCase()}</span></p>
            <p><strong>Capacity:</strong> ${box.capacity}%</p>
            <p><strong>Address:</strong> ${box.address}</p>
            <p class="last-updated">Last Updated: ${new Date(box.lastUpdated).toLocaleString()}</p>
        </div>
    `;
}

// Simulate real-time updates
function simulateStatusUpdates() {
    setInterval(() => {
        const randomBox = collectionBoxes[Math.floor(Math.random() * collectionBoxes.length)];
        const newCapacity = Math.floor(Math.random() * 100);
        randomBox.capacity = newCapacity;
        
        if (newCapacity < 40) {
            randomBox.status = 'empty';
        } else if (newCapacity < 80) {
            randomBox.status = 'filling';
        } else {
            randomBox.status = 'full';
        }
        
        randomBox.lastUpdated = new Date().toISOString();
        
        // Update the map marker and list item
        const marker = boxMarkers[randomBox.id];
        if (marker) {
            marker.setStyle({ fillColor: getStatusColor(randomBox.status) });
            marker.setPopupContent(getPopupContent(randomBox));
        }

        const listItem = document.getElementById(`box-${randomBox.id}`);
        if (listItem) {
            listItem.innerHTML = getBoxListItemContent(randomBox);
        }

        // Show notification for important status changes
        if (randomBox.status === 'full') {
            showNotification(randomBox);
        }
    }, 30000); // Update every 30 seconds
}