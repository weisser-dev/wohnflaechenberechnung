// Function to export data
function exportDataAsJson() {
    const data = {};
    for (const key in localStorage) {
        if (key.startsWith('room_') || key === 'baseInformations') {
            data[key] = JSON.parse(localStorage.getItem(key));
        }
    }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Function to initiate print
function printPage() {
    window.print();
}

// Function to go back to rooms.html
function goBackToRooms() {
    window.location.href = 'rooms.html';
}

// Function to clear localStorage and go to index.html
function startNewCalculation() {
    localStorage.clear();
    window.location.href = 'index.html';
}

// Event listeners
document.getElementById('export-icon').addEventListener('click', exportDataAsJson);
document.getElementById('print-icon').addEventListener('click', printPage);
document.getElementById('go-back').addEventListener('click', goBackToRooms);
document.getElementById('new-calculation').addEventListener('click', function() {
    // Show the modal
    document.getElementById('confirmationModal').style.display = 'block';
});
document.getElementById('yes-button').addEventListener('click', function() {
    // Close the modal and start new calculation
    document.getElementById('confirmationModal').style.display = 'none';
    startNewCalculation();
});
document.getElementById('no-button').addEventListener('click', function() {
    // Simply close the modal
    document.getElementById('confirmationModal').style.display = 'none';
});
