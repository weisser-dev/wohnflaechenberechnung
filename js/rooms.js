function convertToMeters(value) {
  value = value.replace('m', '').replace('cm', '').replace(',', '.');
  if (parseFloat(value) > 30) {
    return parseFloat(value) / 100;
  }
  return parseFloat(value);
}

function generateUID() {
  return '_' + Math.random().toString(36).substr(2, 9);
}
document.addEventListener('click', function(event) {
  if (event.target.classList.contains('info-icon')) {
    const shapeSelect = event.target.previousElementSibling;
    const shape = shapeSelect.value;
    const svgContainer = document.getElementById('svg-container');
    svgContainer.innerHTML = '';

    let svg = '';
    if (shape === 'rectangle') {
      svg = '<svg><rect width="50" height="30" style="fill:blue;"></rect></svg>';
    } else if (shape === 'triangle') {
      svg = '<svg><polygon points="25,0 50,50 0,50" style="fill:blue;"></polygon></svg>';
    } else if (shape === 'circle') {
      svg = '<svg><circle cx="25" cy="25" r="20" style="fill:blue;"></circle></svg>';
    }

    svgContainer.innerHTML = svg;
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const baseInformations = JSON.parse(localStorage.getItem('baseInformations')) || {};
  const mainTitle = document.getElementById('main-title');
  const roomTable = document.getElementById('room-table').getElementsByTagName('tbody')[0];
  const areaSection = document.getElementById('area-section');

  let currentEditingKey = null;
  function editRoom(key) {
    currentEditingKey = key; // Setzen des aktuellen Schlüssels
    const roomData = JSON.parse(localStorage.getItem(key));
    document.getElementById('room-name').value = roomData.roomName;
    document.getElementById('room-type').value = roomData.roomType;

    // Löschen der bestehenden "area"-Reihen im Modal
    while (areaSection.firstChild) {
      areaSection.removeChild(areaSection.firstChild);
    }

    // Hinzufügen der bestehenden "areas" ins Modal
    roomData.areas.forEach((area, index) => {
      // Erstellen Sie hier einen neuen "area"-Reihe im Modal.
      // Sie können den gleichen Code verwenden, den Sie für das Hinzufügen neuer "areas" verwenden,
      // aber füllen Sie die Felder mit den Werten aus `area`.

      const newRow = document.createElement('div');
      newRow.className = 'form-row area-row';
      newRow.innerHTML = `
      <div class="col-12 formsection">
        <label>Teilbereich</label>
        <div class="d-flex align-items-center">
          <select class="form-control shape mr-2">
            <option value="rectangle">Rechteck</option>
            <option value="triangle">Dreieck</option>
            <option value="circle">Kreis</option>
          </select>
          <button class="btn btn-info info-icon" data-toggle="modal" data-target="#infoModal">i</button>
        </div>
      </div>
      <div class="col dimensions rectangle">
        <input type="text" class="form-control length" placeholder="Länge">
      </div>
      <div class="col dimensions rectangle">
        <input type="text" class="form-control width" placeholder="Breite">
      </div>
      <div class="col">
        <select class="form-control height">
          <option value="1">&gt;2m (100%)</option>
          <option value="0.5">&gt;1m (50%)</option>
          <option value="0">&lt;1m (0%)</option>
        </select>
      </div>
    `;
      newRow.querySelector('.shape').value = area.shape;
      newRow.querySelector('.length').value = area.length;
      newRow.querySelector('.width').value = area.width;
      newRow.querySelector('.height').value = area.height;
      areaSection.appendChild(newRow);
    });

    $('#roomModal').modal('show');
  }

  function deleteRoom(key) {
    localStorage.removeItem(key);
    displayRooms();
  }

  function displayRooms() {
    roomTable.innerHTML = '';
    let totalAreaSum = 0;
    for (const key in localStorage) {
      if (key.startsWith('room_')) {
        const roomData = JSON.parse(localStorage.getItem(key));
        let totalArea = 0;
        roomData.areas.forEach((area, index) => {
          const areaRow = roomTable.insertRow();
          if (index === 0) {
            const cell = areaRow.insertCell(0);
            cell.innerText = roomData.roomName;
            areaRow.classList.add('roomStart');

            // Neue Buttons für Bearbeiten und Löschen
            const actionCell = areaRow.insertCell(1);
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-warning btn-sm';
            editButton.innerHTML = '<i class="fas fa-cog"></i>'; // FontAwesome Zahnrad-Icon
            editButton.addEventListener('click', function() {
              editRoom(key);
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm ml-2';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>'; // FontAwesome Papierkorb-Icon
            deleteButton.addEventListener('click', function() {
              deleteRoom(key);
            });

            actionCell.appendChild(editButton);
            actionCell.appendChild(deleteButton);
          } else {
            areaRow.insertCell(0);
            areaRow.insertCell(1);
          }
          const areaSize = area.length * area.width * parseFloat(area.height);
          totalArea += areaSize;
          areaRow.insertCell(1).innerText = `${area.length}m x ${area.width}m`;

          let areaType = roomData.roomType;
          if (area.height === '0.5') {
            areaType += ' (50%)';
          } else if (area.height === '0') {
            areaType += ' (0%)';
          }
          areaRow.insertCell(2).innerText = areaType;
          areaRow.insertCell(3);
        });
        totalAreaSum += totalArea;
        const totalRow = roomTable.insertRow();
        totalRow.insertCell(0);
        totalRow.insertCell(1);
        totalRow.insertCell(2);
        const totalCell = totalRow.insertCell(3);

        totalRow.insertCell(4);
        totalCell.innerText = totalArea.toFixed(2) + 'm²';

        totalRow.classList.add('roomEnd');
      }
    }
    if (totalAreaSum > 0) {
      const totalRow = roomTable.insertRow();
      totalRow.insertCell(0).innerText = 'Gesamt';
      totalRow.insertCell(1);
      totalRow.insertCell(2);
      const totalCell = totalRow.insertCell(3);
      totalCell.innerText = totalAreaSum.toFixed(2) + 'm²';
    }
    if (baseInformations.objectType && baseInformations.street && baseInformations.houseNumber) {
      mainTitle.textContent = `${baseInformations.objectType} - ${baseInformations.street} ${baseInformations.houseNumber}`;
    } else {
      mainTitle.textContent = 'Wohnflächenberechnung';
    }
  }

  displayRooms();

  if (baseInformations.objectType && baseInformations.street && baseInformations.houseNumber) {
    mainTitle.textContent = `${baseInformations.objectType} - ${baseInformations.street} ${baseInformations.houseNumber}`;
  } else {
    mainTitle.textContent = 'Wohnflächenberechnung';
  }

  const tooltipDelay = 3000; // 3 Sekunden in Millisekunden
  let tooltipTimer;

  roomTable.addEventListener('mouseover', function(event) {
    const target = event.target;
    if (target.tagName === 'TD' && target.cellIndex === 2) {
      tooltipTimer = setTimeout(function() {
        target.setAttribute('title', 'Art: Wohnfläche oder Nutzfläche, diese richtet sich nach der Höhe des Raumes. > 2 Meter = 100%, >1 Meter = 50%, < 1 Meter = 0%');
      }, tooltipDelay);
    }
  });

  roomTable.addEventListener('mouseout', function(event) {
    clearTimeout(tooltipTimer);
  });

  const saveRoomButton = document.getElementById('save-room');
  const nextPageButton = document.getElementById('next-page');
  const prevPageButton = document.getElementById('prev-page');

  areaSection.addEventListener('input', function(event) {
    const lastRow = areaSection.lastElementChild;
    const inputs = lastRow.querySelectorAll('input');
    const shapeSelect = lastRow.querySelector('.shape');

    if (Array.from(inputs).every(input => input.value)) {
      const newRow = lastRow.cloneNode(true);
      newRow.querySelectorAll('input').forEach(input => input.value = '');
      areaSection.appendChild(newRow);
    }

    if (shapeSelect) {
      const shape = shapeSelect.value;
      lastRow.querySelectorAll('.dimensions').forEach(el => el.style.display = 'none');
      lastRow.querySelectorAll(`.${shape}`).forEach(el => el.style.display = 'block');
    }
  });

  const addRoomButton = document.getElementById('add-room');

  addRoomButton.addEventListener('click', function() {
    // Setzen Sie den aktuellen Schlüssel zurück
    currentEditingKey = null;

    // Setzen Sie die Werte im Modal zurück
    document.getElementById('room-name').value = '';
    document.getElementById('room-type').value = 'W'; // Setzen Sie dies auf den Standardwert

    // Entfernen Sie alle zusätzlichen "area"-Reihen
    while (areaSection.firstChild) {
      areaSection.removeChild(areaSection.firstChild);
    }

    // Fügen Sie eine leere "area"-Reihe hinzu (Sie können den gleichen Code wie in der `editRoom` Funktion verwenden)
    const newRow = document.createElement('div');
    newRow.className = 'form-row area-row';
    newRow.innerHTML = `
      <div class="col-12 formsection">
        <label>Teilbereich</label>
        <div class="d-flex align-items-center">
          <select class="form-control shape mr-2">
            <option value="rectangle">Rechteck</option>
            <option value="triangle">Dreieck</option>
            <option value="circle">Kreis</option>
          </select>
          <button class="btn btn-info info-icon" data-toggle="modal" data-target="#infoModal">i</button>
        </div>
      </div>
      <div class="col dimensions rectangle">
        <input type="text" class="form-control length" placeholder="Länge">
      </div>
      <div class="col dimensions rectangle">
        <input type="text" class="form-control width" placeholder="Breite">
      </div>
      <div class="col">
        <select class="form-control height">
          <option value="1">&gt;2m (100%)</option>
          <option value="0.5">&gt;1m (50%)</option>
          <option value="0">&lt;1m (0%)</option>
        </select>
      </div>
    `;
    areaSection.appendChild(newRow);
  });

  saveRoomButton.addEventListener('click', function() {
    const roomName = document.getElementById('room-name').value;
    const roomType = document.getElementById('room-type').value;
    const uid = currentEditingKey ? currentEditingKey : generateUID(); // Verwenden Sie den aktuellen Schlüssel, wenn vorhanden
    const roomKey = currentEditingKey ? currentEditingKey : `room_${roomName}${uid}`;

    const roomData = {
      roomName,
      roomType,
      areas: []
    };

    document.querySelectorAll('.area-row').forEach(row => {
      const shape = row.querySelector('.shape').value;
      const lengthInput = row.querySelector('.length').value;
      const widthInput = row.querySelector('.width').value;
      const height = row.querySelector('.height').value;

      if (lengthInput && widthInput) {
        const length = convertToMeters(lengthInput);
        const width = convertToMeters(widthInput);

        roomData.areas.push({ shape, length, width, height });
      }
    });

    localStorage.setItem(roomKey, JSON.stringify(roomData));

    if (currentEditingKey && currentEditingKey !== uid) {
      // Wenn wir einen Raum bearbeiten, entfernen Sie den alten Eintrag
      localStorage.removeItem(currentEditingKey);
    }

    currentEditingKey = null; // Zurücksetzen des aktuellen Schlüssels
    $('#roomModal').modal('hide');
    displayRooms();
  });

  nextPageButton.addEventListener('click', function() {
    window.location.href = 'summary.html';
  });

  prevPageButton.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
});
