function displayRooms() {
  const storedBaseInformations = localStorage.getItem('baseInformations');
  if (storedBaseInformations) {
    const formData = JSON.parse(storedBaseInformations);
    // Verfasser / Gutachter
    document.getElementById('authorFirstName').value = formData.authorFirstName || '';
    document.getElementById('authorLastName').value = formData.authorLastName || '';
    document.getElementById('company').value = formData.company || '';
    document.getElementById('authorStreet').value = formData.authorStreet || '';
    document.getElementById('authorHouseNumber').value = formData.authorHouseNumber || '';
    document.getElementById('authorZipCode').value = formData.authorZipCode || '';
    document.getElementById('authorCity').value = formData.authorCity || '';
    document.getElementById('mobile').value = formData.mobile || '';
    document.getElementById('email').value = formData.email || '';

    // Empfänger / Kunde
    document.getElementById('recipientFirstName').value = formData.recipientFirstName || '';
    document.getElementById('recipientLastName').value = formData.recipientLastName || '';
    document.getElementById('recipientStreet').value = formData.recipientStreet || '';
    document.getElementById('recipientHouseNumber').value = formData.recipientHouseNumber || '';
    document.getElementById('recipientZipCode').value = formData.recipientZipCode || '';
    document.getElementById('recipientCity').value = formData.recipientCity || '';

    // Objekt
    document.getElementById('street').value = formData.street || '';
    document.getElementById('houseNumber').value = formData.houseNumber || '';
    document.getElementById('zipCode').value = formData.zipCode || '';
    document.getElementById('city').value = formData.city || '';
    document.getElementById('objectType').value = formData.objectType || 'Einfamilienhaus';
    document.getElementById('instrument').value = formData.instrument || 'Zollstock';
    document.getElementById('floors').value = formData.floors || '1';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  const nextPageButton = document.getElementById('next-page');

  nextPageButton.addEventListener('click', function() {
    const formData = {
      // Verfasser / Gutachter
      authorFirstName: document.getElementById('authorFirstName').value,
      authorLastName: document.getElementById('authorLastName').value,
      company: document.getElementById('company').value,
      authorStreet: document.getElementById('authorStreet').value,
      authorHouseNumber: document.getElementById('authorHouseNumber').value,
      authorZipCode: document.getElementById('authorZipCode').value,
      authorCity: document.getElementById('authorCity').value,
      mobile: document.getElementById('mobile').value,
      email: document.getElementById('email').value,

      // Empfänger / Kunde
      recipientFirstName: document.getElementById('recipientFirstName').value,
      recipientLastName: document.getElementById('recipientLastName').value,
      recipientStreet: document.getElementById('recipientStreet').value,
      recipientHouseNumber: document.getElementById('recipientHouseNumber').value,
      recipientZipCode: document.getElementById('recipientZipCode').value,
      recipientCity: document.getElementById('recipientCity').value,

      // Objekt
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

$(document).ready(function() {
  if (document.cookie.includes("disableDSGVOHint=true")) {
    $("#infoBox").hide();
  }

  $("#closeInfoBox").click(function() {
    $("#infoModal").modal("show");
  });

  $("#yesButton").click(function() {
    document.cookie = "disableDSGVOHint=true; path=/";
    $("#infoBox").hide();
    $("#infoModal").modal("hide");
  });
});


