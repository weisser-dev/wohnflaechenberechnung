// Utility Functions
// Export data to a JSON file
function exportData() {
    const data = {};
    for (const key in localStorage) {
        if (key.startsWith('room_') || key === 'baseInformations') {
            data[key] = JSON.parse(localStorage.getItem(key));
        }
    }
    const blob = new Blob([JSON.stringify(data)], {
        type: 'application/json'
    });
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
            } catch (error) {
                window.location.reload();
                console.log("displayRooms function only available on rooms page");
            }

        };
        reader.readAsText(file);
    });
    input.click();
}

function createModal() {
    const modalHTML = `
    <div class="modal fade" id="clearModal" tabindex="-1" role="dialog">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Daten löschen</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            Möchtest du alle eingegebenen Daten löschen? Dies kann nicht rückgängig gemacht werden, alle Daten gehen dadurch verloren. <a href="#" id="backup-link">Klicke hier</a>, falls du ein Backup möchtest.
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" id="confirm-clear">Ja</button>
            <button type="button" class="btn btn-secondary" data-dismiss="modal">Nein</button>
          </div>
        </div>
      </div>
    </div>
  `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    document.getElementById('confirm-clear').addEventListener('click', function() {
        localStorage.clear();
        $('#clearModal').modal('hide');
        window.location.reload();
    });

    document.getElementById('backup-link').addEventListener('click', function(e) {
        e.preventDefault();
        exportData();
    });
}
function openClearModal() {
    $('#clearModal').modal('show');
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('clear-data').addEventListener('click', function() {
        if (!document.getElementById('clearModal')) {
            createModal();
        }
        openClearModal();
    });
});


document.getElementById('export-data').addEventListener('click', exportData);
document.getElementById('import-data').addEventListener('click', importData);