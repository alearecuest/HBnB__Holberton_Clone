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
├── client/      # React frontend (sources only, build output in server/public)
├── server/      # Node/Express/TypeORM backend (API, static files, compiled code)
│   ├── public/  # Frontend build (`npm run build` in client, copy dist here)
│   ├── src/     # TS source code
│   └── dist/    # TS compiled code for production
```

---


### Prerequisites
- Node.js (v18+ recommended)
- NPM/Yarn

### 1. Install dependencies

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### 2. Build and Run (production)

```bash
# From project root
cd client
npm run build                    # Compiles React app
cd ../server
mkdir -p public                  # If not exists
cp -r ../client/dist/* ./public/ # Copy client build to backend
npm run build                    # Compile TypeScript backend
npm start                        # Run backend (serves API + frontend)
```
By default backend runs on http://localhost:4000

---

### 3. Render Deploy

1. Push full repo to GitHub.
2. Create a new Render **Web Service**:
    - Root Directory: `server`
    - Build Command: `npm run build`
    - Start Command: `npm start`
3. Add any environment variables needed (DB, JWT, etc.)
4. Render will build, serve API and static frontend in one URL!

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