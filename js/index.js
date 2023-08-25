function displayRooms() {
  const storedBaseInformations = localStorage.getItem('baseInformations');
  if (storedBaseInformations) {
    const formData = JSON.parse(storedBaseInformations);
    document.getElementById('firstName').value = formData.firstName || '';
    document.getElementById('lastName').value = formData.lastName || '';
    document.getElementById('street').value = formData.street || '';
    document.getElementById('houseNumber').value = formData.houseNumber || '';
    document.getElementById('zipCode').value = formData.zipCode || '';
    document.getElementById('city').value = formData.city || '';
    document.getElementById('objectType').value = formData.objectType || 'Einfamilienhaus';
    document.getElementById('instrument').value = formData.instrument || 'Zollstock';
    document.getElementById('floors').value = formData.floors || '';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const nextPageButton = document.getElementById('next-page');

  nextPageButton.addEventListener('click', function() {
    const formData = {
      firstName: document.getElementById('firstName').value,
      lastName: document.getElementById('lastName').value,
      street: document.getElementById('street').value,
      houseNumber: document.getElementById('houseNumber').value,
      zipCode: document.getElementById('zipCode').value,
      city: document.getElementById('city').value,
      objectType: document.getElementById('objectType').value,
      instrument: document.getElementById('instrument').value,
      floors: document.getElementById('floors').value
    };
    localStorage.setItem('baseInformations', JSON.stringify(formData));
    window.location.href = 'rooms.html';
  });
  displayRooms();
});
