# The Hedgehog Café – Localhost Setup

A cozy literary book café web application built with React, Vite, Tailwind CSS, and Lucide Icons.

---

## 🚀 How to Run Locally

### Option 1: One-Click Quick Launch (Windows)
- **Development Mode (Fast with hot reload)**: Double-click **`start-localhost.bat`**.
- **Production Mode (Compiled build)**: Double-click **`start-prod-localhost.bat`**.

Both scripts will automatically check dependencies, start the server at port 3000, and open your default browser.

### Option 2: Using Terminal / Command Prompt

1. **Install dependencies** (if not already done):
   ```bash
   npm install
   ```

2. **Start the local server**:
   - **Dev Mode**:
     ```bash
     npm run dev
     ```
   - **Production Mode**:
     ```bash
     npm run build
     npm run serve
     ```

3. **Open in your browser**:
   - 🌐 **Customer Website**: [http://localhost:3000](http://localhost:3000)
   - 🔐 **Admin Panel**: [http://localhost:3000/admin55555](http://localhost:3000/admin55555) *(Password: `12345678`)*

---

## 🛍️ Direct Kitchen Food Ordering (In-App)
- **Direct Order**: Customers can add items to their Cart directly from the Menu (`+ Add to Order`) or click **"Order Online"**.
- **Delivery & Takeaway**: Supports Home Delivery (with address/landmark) and Café Takeaway/Pickup.
- **Payment Modes**: UPI / QR Code on Delivery & Cash on Delivery (COD).
- **Instant Live Sync**: Every order placed is instantly sent to the Admin Panel in real time.

---

## 🔐 Secret Admin Panel

- **Secret Login URL**: 👉 **[http://localhost:3000/admin55555](http://localhost:3000/admin55555)** *(or [http://localhost:3000/#admin55555](http://localhost:3000/#admin55555))*
- **Admin Password**: `12345678`

### Admin Features:
- 🛍️ **Food Orders Management**: Real-time kitchen order feed, customer address & phone, itemized bill, total revenue tracker, live order status changer (`New`, `Preparing`, `Out for Delivery`, `Delivered`, `Cancelled`), one-click WhatsApp status update, direct phone call, and printable kitchen receipts.
- 🍽️ **Table Bookings**: Real-time table reservations, customer details (name, phone, date, time, party size, notes), status manager (`Pending`, `Confirmed`, `Completed`, `Cancelled`), direct phone call, and WhatsApp confirmation.
- 👥 **Visitor Analytics**: Real-time traffic, unique visitor counter, daily trends chart, page breakdown, and live session stream.
- 📥 **Export to CSV**: Download orders and reservations as Excel/CSV spreadsheets.

---

## ⚙️ Configuration (`.env.local`)

Local settings can be found in [`.env.local`](.env.local):
- `APP_URL`: Set to `http://localhost:3000` for local testing.
- `GEMINI_API_KEY`: *(Optional)* Add your Gemini API key if using Gemini AI features.

---

## 🛠 Available Scripts

- `npm run dev` / `npm start`: Starts Vite development server at `http://localhost:3000` with hot-module reloading.
- `npm run build`: Compiles and bundles production files into the `/dist` directory.
- `npm run preview`: Locally previews the production build from `/dist`.
- `npm run lint`: Runs TypeScript type checks.
