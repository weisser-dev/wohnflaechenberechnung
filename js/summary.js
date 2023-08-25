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

// on page load, fill data from json:
function loadData() {
    const storedBaseInformations = localStorage.getItem('baseInformations');
    if (storedBaseInformations) {
        const formData = JSON.parse(storedBaseInformations);
        document.getElementById('object-address').placeholder = (formData.street || '') + ' ' + (formData.houseNumber || '') + '\n' + (formData.zipCode || '') + ' ' + (formData.city || '');

        document.getElementById('empfaengerdaten').placeholder = (formData.firstName || '') + ' ' + (formData.lastName || '')+'\n'+(formData.street || '') + ' ' + (formData.houseNumber || '')+'\n'+(formData.zipCode || '') + ' ' + (formData.city || '');
        document.getElementById('object-daten').placeholder = (formData.street || '') + ' ' + (formData.houseNumber || '')+'\n'+(formData.zipCode || '') + ' ' + (formData.city || '')+'\n'+(formData.objectType || '')+'\n'+(formData.floors || '');


        document.getElementById('object-measuring-details').value = (formData.instrument || '');
    }
}

function currentDate() {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Monate sind von 0-11
    const year = date.getFullYear();

    const formattedDate = `${day}.${month}.${year}`;
    const innerHtml = document.getElementById('currentDate').innerHTML;
    document.getElementById('currentDate').innerHTML = innerHtml + formattedDate + ".";
}

function uploadImage() {
    // Add event listener for image upload
    const imagePlaceholder = document.getElementById('image-placeholder');
    const imageUpload = document.getElementById('image-upload');

    imagePlaceholder.addEventListener('click', function() {
        imageUpload.click();
    });

    imageUpload.addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                imagePlaceholder.innerHTML = '';
                imagePlaceholder.appendChild(img);
            };
            reader.readAsDataURL(file);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadData();
    uploadImage();
    currentDate();

    var textAreas = document.getElementsByTagName('textarea');

    Array.prototype.forEach.call(textAreas, function(elem) {
        elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
    });
});
