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

## Project Structure

```
HBnB__Holberton_Clone/
├── client/      # React frontend (sources + build output in dist/)
├── server/      # Node/Express/TypeORM backend (API, static files, compiled code)
│   ├── public/  # (uploads/media only; frontend build served direct from client/dist)
│   ├── src/     # TypeScript source code
│   └── dist/    # TypeScript compiled code for production
```

---

### Prerequisites

- Node.js (v18+ recommended)
- NPM/Yarn

---

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

---

### 2. Build and Run (production)

```bash
# From project root
cd client
npm run build        # Compiles React/Vite app (output to client/dist)
cd ../server
npm run build        # Compile TypeScript backend
npm start            # Run backend (serves API + frontend from client/dist)
```

> The frontend is served automatically from `/client/dist`.  
> No need to copy build files manually – just make sure `client/dist` is kept up to date.

---

### 3. Render Deploy

1. Push the entire repo to GitHub.
2. Create a new Render **Web Service**:
    - Root Directory: **leave empty (project root)**
    - Build Command:  
      ```sh
      npm install && cd client && npm run build && cd ../server && npm run build
      ```
    - Start Command:  
      ```sh
      cd server && node dist/server.js
      ```
3. Add any environment variables needed (DB, JWT, etc.)
4. The service will build both backend and frontend, and serve everything from one URL!

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
- **Backend:** Node.js, Express, TypeORM, SQLite
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

**Q: Are frontend and backend served from the same URL?**  
Yes! All features (API and UI) live at the same address for seamless experience.

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