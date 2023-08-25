// Utility Functions
// Export data to a JSON file
function exportData() {
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
    a.download = 'luna_whnflchbrn_backup.json';
    a.click();
    URL.revokeObjectURL(url);
}

// Import data from a JSON file
function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const data = JSON.parse(event.target.result);
            for (const key in data) {
                localStorage.setItem(key, JSON.stringify(data[key]));
            }
            try {
                displayRooms();
            } catch(error) {
                console.log("displayRooms function only available on rooms page");
            }

        };
        reader.readAsText(file);
    });
    input.click();
}

document.getElementById('export-data').addEventListener('click', exportData);
document.getElementById('import-data').addEventListener('click', importData);