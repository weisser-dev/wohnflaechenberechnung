#Wohnflächenberechnung

## Overview

[Visit the GitHub Page](https://weisser-dev.github.io/wohnflaechenberechnung/)

This web application is designed for calculating the living area of buildings according to the German Wohnflächenverordnung (WoFLV). It is developed using HTML, CSS, and JavaScript and stores all data locally in the user's browser.

## Features

- Input of room data including length, width, and height
- Automatic calculation of living area for each room
- Data export and import in JSON format
- Print function for the summary
- Option to enter author and recipient data
- Image upload for the building
- Clear presentation of calculated data
- SVGs for explaining how the area (circle, triangle, rectangle) is calculated can be found under `/img/*`
- The `style.css` is mainly designed for desktop and there is a printable area on the `summary.js`. When you click the "Print" button, only this area is displayed. If you want to export it as a PDF, you can choose the "Print" button and select PDF as the destination.

## Installation

No installation is required as it is a web application. Simply open the `index.html` file in your web browser.

## File Structure

- `index.html`: Home page of the application
- `rooms.html`: Page for entering room data
- `summary.html`: Summary of calculated data
- `index.js`, `summary.js`, `rooms.js`, `utils.js`: JavaScript logic
- `css/style.css`: Stylesheet for the application
- `/img/*`: SVGs for area calculations

## Dependencies

- [Bootstrap 4.5.2](https://getbootstrap.com/)
- [Font Awesome 5.15.3](https://fontawesome.com/)

## Usage

### index.html
1. Open the `index.html` file in your web browser.
2. Enter the base information for your object and your personal details. These can be changed later.

### rooms.html
3. Navigate to `rooms.html`.
4. Insert rooms and specify their dimensions (length, width, height).
5. Choose the usage type for each area, such as "Nutzfläche" or "Wohnfläche".

### summary.html
6. Go to `summary.html` to see a printable summary of the calculated data.
7. Many fields can be adjusted as they are text areas. You can also export or print the data.

---

# README.md für die Wohnflächenberechnungs-App

## Übersicht

[GitHub-Pages](https://weisser-dev.github.io/wohnflaechenberechnung/)

Diese Webanwendung wurde entwickelt, um die Wohnfläche von Gebäuden gemäß der deutschen Wohnflächenverordnung (WoFLV) zu berechnen. Sie wurde mit HTML, CSS und JavaScript entwickelt und speichert alle Daten lokal im Browser des Benutzers.

## Funktionen

- Eingabe von Raumdaten einschließlich Länge, Breite und Höhe
- Automatische Berechnung der Wohnfläche für jeden Raum
- Datenexport und -import im JSON-Format
- Druckfunktion für die Zusammenfassung
- Möglichkeit zur Eingabe von Verfasser- und Empfängerdaten
- Bildupload für das Gebäude
- Klare Darstellung der berechneten Daten
- SVGs zur Erklärung der Flächenberechnung (Kreis, Dreieck, Rechteck) finden Sie unter `/img/*`
- Das `style.css` ist hauptsächlich für den Desktop optimiert und es gibt einen druckbaren Bereich in der `summary.js`. Wenn Sie auf den "Drucken"-Button klicken, wird nur dieser Bereich angezeigt. Wenn Sie es als PDF exportieren möchten, können Sie den "Drucken"-Button wählen und PDF als Ziel auswählen.

## Installation

Keine Installation erforderlich, da es sich um eine Webanwendung handelt. Öffnen Sie einfach die `index.html`-Datei in Ihrem Webbrowser.

## Dateistruktur

- `index.html`: Startseite der Anwendung
- `rooms.html`: Seite zur Eingabe von Raumdaten
- `summary.html`: Zusammenfassung der berechneten Daten
- `index.js`, `summary.js`, `rooms.js`, `utils.js`: JavaScript-Logik
- `css/style.css`: Stylesheet für die Anwendung
- `/img/*`: SVGs für die Flächenberechnungen

## Abhängigkeiten

- [Bootstrap 4.5.2](https://getbootstrap.com/)
- [Font Awesome 5.15.3](https://fontawesome.com/)

## Verwendung

### index.html
1. Öffnen Sie die `index.html`-Datei in Ihrem Webbrowser.
2. Geben Sie die Basisinformationen für Ihr Objekt und Ihre persönlichen Daten ein. Diese können später geändert werden.

### rooms.html
3. Navigieren Sie zu `rooms.html`.
4. Fügen Sie Räume hinzu und geben Sie deren Abmessungen (Länge, Breite, Höhe) an.
5. Wählen Sie den Verwendungszweck für jede Fläche, wie z.B. "Nutzfläche" oder "Wohnfläche".

### summary.html
6. Gehen Sie zu `summary.html`, um eine druckbare Zusammenfassung der berechneten Daten zu sehen.
7. Viele Felder können angepasst werden, da es sich um Textbereiche handelt. Sie können die Daten auch exportieren oder drucken.
