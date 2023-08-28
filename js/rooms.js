function convertToMeters(value) {
  value = value.replace('m', '').replace('cm', '').replace(',', '.');
  if (parseFloat(value) > 30) {
    return parseFloat(value) / 100;
  }
  return parseFloat(value);
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
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
      svg = '<object data="img/rectangle.svg" type="image/svg+xml"></object>'
    } else if (shape === 'triangle') {
      svg = '<object data="img/triangle.svg" type="image/svg+xml"></object>'
    } else if (shape === 'circle') {
      svg = '<object data="img/circle.svg" type="image/svg+xml"></object>'
    }
    svgContainer.innerHTML = svg;
  }
  if (event.target.classList.contains('delete-area') || event.target.parentElement.classList.contains('delete-area')) {
    const areaRow = event.target.closest('.form-row');
    areaRow.remove();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const baseInformations = JSON.parse(localStorage.getItem('baseInformations')) || {};
  const mainTitle = document.getElementById('main-title');
  const roomTable = document.getElementById('room-table').getElementsByTagName('tbody')[0];
  const areaSection = document.getElementById('area-section');

  let currentEditingKey = null;

  function editRoom(key) {
    currentEditingKey = key;
    const roomData = JSON.parse(localStorage.getItem(key));
    document.getElementById('room-name').value = roomData.roomName;
    document.getElementById('room-type').value = roomData.roomType;
    document.getElementById('room-floor').value = roomData.roomFloor;

    while (areaSection.firstChild) {
      areaSection.removeChild(areaSection.firstChild);
    }

    let newEmptyRow;
    roomData.areas.forEach((area, index) => {

      const newRow = document.createElement('div');
      newEmptyRow = document.createElement('div');
      newRow.className = 'form-row area-row';
      newRow.style.marginTop = '20px';
      newEmptyRow.className = newRow.className;
      newEmptyRow.style.marginTop = '20px';
      newRow.innerHTML = `
      <div class="col-12 formsection">
        <label>Teilbereich</label>
        <button class="btn btn-danger btn-sm ml-2 delete-area" style="display:none;"><i class="fas fa-trash"></i></button>
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
      newEmptyRow.innerHTML = newRow.innerHTML;
      newRow.querySelector('.shape').value = area.shape;
      newRow.querySelector('.length').value = area.length;
      newRow.querySelector('.width').value = area.width;
      newRow.querySelector('.height').value = area.height;
      areaSection.appendChild(newRow);

      const deleteButton = newRow.querySelector('.delete-area');
      if (area.length && area.width) {
        deleteButton.style.display = 'inline-block';
      }
    });
    areaSection.appendChild(newEmptyRow);

    $('#roomModal').modal('show');
  }

  function deleteRoom(key) {
    localStorage.removeItem(key);
    displayRooms();
  }

  function displayRooms() {
    roomTable.innerHTML = '';
    let totalAreaSum = 0;
    let roomCount = 0;
    for (const key in localStorage) {
      if (key.startsWith('room_')) {
        roomCount++;
        const roomData = JSON.parse(localStorage.getItem(key));
        let totalArea = 0;
        roomData.areas.forEach((area, index) => {
          const areaRow = roomTable.insertRow();
          if (index === 0) {
            const cell = areaRow.insertCell(0);
            cell.innerText = roomData.roomName + " (" + roomData?.roomFloor + ")";
            areaRow.classList.add('roomStart');

            const actionCell = areaRow.insertCell(1);
            actionCell.classList.add('text-right');
            const editButton = document.createElement('button');
            editButton.className = 'btn btn-warning btn-sm';
            editButton.innerHTML = '<i class="fas fa-cog"></i>';
            editButton.addEventListener('click', function() {
              editRoom(key);
            });

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger btn-sm ml-2';
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
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
          areaRow.insertCell(1).innerText = `${area.length.toFixed(2)}m x ${area.width.toFixed(2)}m`;

          let areaType = roomData.roomType;
          if (area.height === '0.5') {
            areaType += ' (50%)';
          } else if (area.height === '0') {
            areaType += ' (0%)';
          }
          areaRow.insertCell(2).innerText = areaType;
          areaRow.insertCell(3);
        });
        if(roomData.roomType == 'A') {
          totalArea = totalArea * -1;
        }
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
    //show add button
    if (roomCount === 0) {
      document.getElementById('empty-table-message').style.display = 'block';
      document.getElementById('table-actions').style.display = 'none'; // Verstecken des Buttons unter der Tabelle
    } else {
      document.getElementById('empty-table-message').style.display = 'none';
      document.getElementById('table-actions').style.display = 'block'; // Anzeigen des Buttons unter der Tabelle
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

  const tooltipDelay = 3000;
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

    document.querySelectorAll('.area-row').forEach(row => {
      const lengthInput = row.querySelector('.length').value;
      const widthInput = row.querySelector('.width').value;
      const deleteButton = row.querySelector('.delete-area');

      if (lengthInput && widthInput) {
        deleteButton.style.display = 'inline-block';
      } else {
        deleteButton.style.display = 'none';
      }
    });
  });

  function addRoom() {
    currentEditingKey = null;

    document.getElementById('room-name').value = '';
    document.getElementById('room-type').value = 'W';

    while (areaSection.firstChild) {
      areaSection.removeChild(areaSection.firstChild);
    }

    const newRow = document.createElement('div');
    newRow.className = 'form-row area-row';
    newRow.style.marginTop = '20px';
    newRow.innerHTML = `
      <div class="col-12 formsection">
        <label>Teilbereich</label>
        <button class="btn btn-danger btn-sm ml-2 delete-area" style="display:none;"><i class="fas fa-trash"></i></button>
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
  }

  const addEmptyRoomButton = document.getElementById('add-room-empty');
  const addRoomButton = document.getElementById('add-room');

  addEmptyRoomButton.addEventListener('click', function() {
    addRoom();
  });
  addRoomButton.addEventListener('click', function() {
    addRoom();
  });

  saveRoomButton.addEventListener('click', function() {
    const roomName = capitalizeFirstLetter(document.getElementById('room-name').value);
    const roomType = document.getElementById('room-type').value;
    const roomFloor = document.getElementById('room-floor').value;
    const uid = currentEditingKey ? currentEditingKey : generateUID();
    const roomKey = currentEditingKey ? currentEditingKey : `room_${roomName}${uid}`;
    const roomData = {
      roomName,
      roomType,
      roomFloor,
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

        roomData.areas.push({
          shape,
          length,
          width,
          height
        });
      }
    });

    // Only save if at least one area with both width and length exists
    if (roomData.areas.length > 0) {
      localStorage.setItem(roomKey, JSON.stringify(roomData));

      if (currentEditingKey && currentEditingKey !== uid) {
        localStorage.removeItem(currentEditingKey);
      }
      currentEditingKey = null;
      $('#roomModal').modal('hide');
      displayRooms();
    } else {
      // You can show an alert or some other form of notification here
      alert("Es muss mindestens ein Teilbereich mit Länge und Breite existieren um speichern zu können.");
    }
  });

  nextPageButton.addEventListener('click', function() {
    window.location.href = 'summary.html';
  });

  prevPageButton.addEventListener('click', function() {
    window.location.href = 'index.html';
  });
});