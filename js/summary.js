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

function displaySummary() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ''; // Löscht alle vorhandenen Zeilen
    let rooms = [];

    for (const key in localStorage) {
        if (key.startsWith('room_')) {
            const roomData = JSON.parse(localStorage.getItem(key));
            let totalArea = 0;

            roomData.areas.forEach((area) => {
                let areaSize = area.length * area.width * parseFloat(area.height);
                if (roomData.roomType === 'A') {
                    areaSize = areaSize * -1;
                }
                if (roomData.roomType === 'N') {
                    areaSize = 0; // Set area to 0 if type is N
                }
                totalArea += areaSize;
            });

            rooms.push({
                name: roomData.roomName,
                floor: roomData.roomFloor,
                totalArea: totalArea
            });
        }
    }

    // Sortieren der Räume nach dem Geschoss
    const floorOrder = ['KG', 'EG', 'OG', 'DG'];
    rooms.sort((a, b) => floorOrder.indexOf(a.floor) - floorOrder.indexOf(b.floor));

    // Hinzufügen der sortierten Räume zur Tabelle
    rooms.forEach((room) => {
        const row = document.createElement('tr');
        const cell1 = document.createElement('td');
        const cell2 = document.createElement('td');

        cell1.textContent = `${room.name} (${room.floor})`;
        cell2.textContent = `${room.totalArea.toFixed(2).replace('.', ',')} m²`; // Replaced '.' with ',' for German formatting

        row.appendChild(cell1);
        row.appendChild(cell2);
        tableBody.appendChild(row);
    });
}


// Event listeners
document.getElementById('print-icon').addEventListener('click', printPage);
document.getElementById('print-btn').addEventListener('click', printPage);
document.getElementById('go-back').addEventListener('click', goBackToRooms);
document.getElementById('new-calculation').addEventListener('click', function() {
    // Show the modal
    $('#confirmationModal').modal('show');
});
document.getElementById('yes-button').addEventListener('click', function() {
    // Close the modal and start new calculation
    document.getElementById('confirmationModal').style.display = 'none';
    startNewCalculation();
});

// on page load, fill data from json:
function loadData() {
    const storedBaseInformations = localStorage.getItem('baseInformations');
    if (storedBaseInformations) {
        const formData = JSON.parse(storedBaseInformations);

        // Verfasser / Gutachter
        document.getElementById('verfasserdaten_top').placeholder =
          (formData.authorFirstName || '') + ' ' +
          (formData.authorLastName || '') + '\n' +
          (formData.company || '') + '\n' +
          (formData.authorStreet || '') + ' ' +
          (formData.authorHouseNumber || '') + '\n' +
          (formData.authorZipCode || '') + ' ' +
          (formData.authorCity || '') + '\n' +
          (formData.mobile || '') + '\n' +
          (formData.email || '');

        document.getElementById('verfasserdaten_bottom').placeholder =
          (formData.authorFirstName || '') + ' ' +
          (formData.authorLastName || '') + '\n' +
          (formData.authorStreet || '') + ' ' +
          (formData.authorHouseNumber || '') + '\n' +
          (formData.authorZipCode || '') + ' ' +
          (formData.authorCity || '') + '\n';

        // Empfänger / Kunde
        document.getElementById('empfaengerdaten').placeholder =
          (formData.recipientFirstName || '') + ' ' +
          (formData.recipientLastName || '') + '\n' +
          (formData.recipientStreet || '') + ' ' +
          (formData.recipientHouseNumber || '') + '\n' +
          (formData.recipientZipCode || '') + ' ' +
          (formData.recipientCity || '');

        // Objekt
        document.getElementById('object-address-top').placeholder =
          (formData.street || '') + ' ' +
          (formData.houseNumber || '') + '\n' +
          (formData.zipCode || '') + ' ' +
          (formData.city || '');

        document.getElementById('object-address-bottom').placeholder =
          (formData.street || '') + ' ' +
          (formData.houseNumber || '') + '\n' +
          (formData.zipCode || '') + ' ' +
          (formData.city || '') + '\n' +
          (formData.objectType || '') + '\n' +
          (formData.floors || '');

        document.getElementById('object-measuring-details').value =
          (formData.instrument || '');
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

let rowCount = 0;
let tableCount = 0;
let roomTable = document.getElementById('room-table');
// Function to create a new table when row limit is reached
function createNewTable() {
    const newTable = document.createElement('table');
    newTable.id = 'room-table';
    newTable.className = 'table mt-4';
    newTable.style.marginTop = '30px';
    const newPrintDiv = document.createElement('div');
    newPrintDiv.className = 'new-page';
    roomTable.parentNode.appendChild(newPrintDiv);
    roomTable.parentNode.appendChild(newTable);
    //document.body.appendChild(newTable);
    roomTable = newTable;
    rowCount = 0;
}
function displayDetailedSummary() {
    roomTable = document.getElementById('room-table');
    let roomNumber = 0;
    let totalAreaSum = 0;
    let totalNutzflaeche = 0; // Total utility area

    let rooms = [];

    // Collect all rooms from localStorage
    for (const key in localStorage) {
        if (key.startsWith('room_')) {
            rooms.push(JSON.parse(localStorage.getItem(key)));
        }
    }

    // Sort rooms by floor
    const floorOrder = ['KG', 'EG', 'OG', 'DG'];
    rooms.sort((a, b) => floorOrder.indexOf(a.roomFloor) - floorOrder.indexOf(b.roomFloor));

    // Add sorted rooms to the table
    rooms.forEach((roomData) => {
        roomNumber++; // Increment room number
        let totalArea = 0;
        let totalNutzArea = 0; // Total utility area for this room

        // First row for room name and room number
        const roomNameRow = roomTable.insertRow();
        const roomNumberCell = roomNameRow.insertCell(0);
        roomNumberCell.innerText = roomNumber; // Room number
        const roomNameCell = roomNameRow.insertCell(1);
        roomNameCell.innerText = roomData.roomName + " (" + roomData?.roomFloor + ")";
        roomNameRow.classList.add('roomStart');

        // Add empty cells for the first row
        roomNameRow.insertCell(2);
        roomNameRow.insertCell(3);
        roomNameRow.insertCell(4);
        roomNameRow.insertCell(5);
        rowCount++;
        roomData.areas.forEach((area, index) => {
            const areaRow = roomTable.insertRow();
            rowCount++;

            // Add empty cells for the first and second columns
            areaRow.insertCell(0);
            areaRow.insertCell(1);

            let areaSize = area.length * area.width * parseFloat(area.height);
            if (roomData.roomType === 'A') {
                areaSize = areaSize * -1;
            }

            let areaType = roomData.roomType;
            if (area.height === '0.5') {
                areaType += ' (50%)';
            } else if (area.height === '0') {
                areaType += ' (0%)';
            }

            areaRow.insertCell(2).innerText = `${area.length.toFixed(2)}m x ${area.width.toFixed(2)}m`;
            areaRow.insertCell(3).innerText = areaType;

            const wohnflaecheCell = areaRow.insertCell(4);
            wohnflaecheCell.className = 'text-right';
            wohnflaecheCell.innerText = (areaType === 'N' || areaType === 'N (50%)' || areaType === 'N (0%)') ? '0.000 m²' : `${areaSize.toFixed(3)} m²`;

            const nutzflaecheCell = areaRow.insertCell(5);
            nutzflaecheCell.className = 'text-right';
            nutzflaecheCell.innerText = (areaType === 'N' || areaType === 'N (50%)' || areaType === 'N (0%)') ? `${areaSize.toFixed(3)} m²` : '0.000 m²';

            if (areaType === 'N' || areaType === 'N (50%)' || areaType === 'N (0%)') {
                totalNutzArea += areaSize;
            } else {
                totalArea += areaSize;
            }
        });

        totalAreaSum += totalArea;
        totalNutzflaeche += totalNutzArea; // Add to total utility area

        // Last row for the total area of the room
        const totalRow = roomTable.insertRow();
        totalRow.insertCell(0);
        totalRow.insertCell(1);
        totalRow.insertCell(2);
        totalRow.insertCell(3);
        totalRow.classList.add('roomEnd');

        const totalCell = totalRow.insertCell(4);
        totalCell.className = 'text-right';
        totalCell.innerText = `= ${totalArea.toFixed(3)} m²`;

        const totalNutzCell = totalRow.insertCell(5);
        totalNutzCell.className = 'text-right';
        totalNutzCell.innerText = `= ${totalNutzArea.toFixed(3)} m²`;
        if((rowCount >= 16 && tableCount == 0) || (rowCount >= 22 && tableCount > 0)) {
            createNewTable();
            tableCount++;
        }
    });

    // Update the total area sizes in the HTML
    document.getElementById('total-wohnflaeche').innerText = totalAreaSum.toFixed(2) + ' m²';
    document.getElementById('total-nutzflaeche').innerText = totalNutzflaeche.toFixed(2) + ' m²';
}



document.addEventListener('DOMContentLoaded', function() {
    loadData();
    uploadImage();
    currentDate();
    displaySummary();
    displayDetailedSummary();

    var textAreas = document.getElementsByTagName('textarea');

    Array.prototype.forEach.call(textAreas, function(elem) {
        elem.placeholder = elem.placeholder.replace(/\\n/g, '\n');
    });
});