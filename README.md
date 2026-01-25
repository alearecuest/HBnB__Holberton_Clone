# Hbnb - Modern Airbnb Clone

**Hbnb** is a modern, fully functional Airbnb-style platform built with React and a Node/Express backend.  
It allows users to browse, search, save favorites, book, and review unique places to stay. Owners can list, edit, and manage their properties, including real calendar-based availability.

---

## Features

- **Property Listing & Search:**  
  Browse and search for places to stay with smart filters (location, date, guests).

- **Photo Gallery & Lightbox:**  
  See high-res images for every property in lightbox format.

- **Real Availability Calendar:**  
  Owners can block unavailable dates; travelers can only book available days.

- **Reservation System:**  
  Instant booking for available dates. Automatic calendar update.

- **Favorites:**  
  Mark properties as favorites (with localStorage persistence).

- **Reviews:**  
  Logged-in users can leave reviews and ratings for properties.

- **Owner/Admin Panel:**  
  Owners can edit, delete, and manage their property listings.

- **Responsive, Multi-language UX:**  
  UI in English and Spanish, with professional i18n and mobile-first design.

---

## Installation & Running Locally

### Prerequisites
- Node.js (v18+ recommended)
- NPM/Yarn

### Clone & Setup

```bash
git clone https://github.com/<your-username>/hbnb.git
cd hbnb
npm install
```

### Start the Backend
```bash
# From project root (or check your backend folder)
npm run backend
# By default runs on http://localhost:4000
```

### Start the Frontend (client)
```bash
cd client
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Demo Accounts

- Regular User:  
  - Email: user@example.com  
  - Password: password

- Property Owner:  
  - Email: owner@example.com  
  - Password: password

---

## Tech Stack

- **Frontend:** React, TypeScript, react-router, react-calendar, OpenStreetMap/leaflet
- **Backend:** Node.js, Express, MongoDB
- **Auth:** JWT-based, role-differentiated (user/owner)
- **Styles:** CSS-in-JS, CSS modules, custom overrides for professional UX

---

## FAQ

**Q: Can I unblock dates as owner?**  
No, once dates are blocked they can't be unblocked (matches real Airbnb: avoid accidental double-booking).

**Q: Is the calendar really connected to backend?**  
Yes! Blocked and reserved dates sync in real time via API.

**Q: How are favorites saved?**  
Favorites are stored in your browser with localStorage, so they persist across reloads.

---

## Room for Contribution / Extras

Feel free to fork and extend. Example ideas:
- Messaging/chat between user and owner
- Multi-image drag-&-drop upload/ordering
- Price calendar with seasonal pricing
- Advanced map filters and clustering
- Dark mode
- Accessibility polish
- Real payment gateway (Stripe, PayPal, etc)

---

## License

[MIT](LICENSE)

---

**_Enjoy Hbnb!_**