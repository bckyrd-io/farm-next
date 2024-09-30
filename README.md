# Next-Type

Next-Type is a full-stack project built using **Expo** and **Next.js**, designed to work seamlessly across web and mobile platforms. This app provides a mobile-responsive experience with API access through Next.js, connected to a Postgres database using Drizzle ORM.

## Project Overview

- **Frontend:**
  - **Expo** for mobile-first development.
  - Works on both mobile and web platforms.
- **Backend:**
  - **Next.js** API for handling data requests.
- **Database:**
  - **Postgres** database integrated using **Drizzle ORM**.
- **Package Managers:**
  - **Expo App**: Currently using **npm**.
  - **Next.js Project**: Using **pnpm** for faster performance.
- **Planned Migration**: In the future, both the Expo and Next.js projects will be migrated to **pnpm**.

## Features

- Mobile-responsive design that works on web and mobile.
- API endpoints in Next.js connected to a Postgres database using Drizzle ORM.
- Current use case: **Farm Management** system, including:
  - Tracking farm revenues.
  - Tracking farm expenses.
  - More farm-related features to come.

## Getting Started

### Prerequisites

Make sure you have the following installed:
- **Node.js** (>= 14.x)
- **npm** (>= 6.x) or **pnpm** (>= 7.x)
- **Expo CLI** (>= 5.x)
- **Postgres Database**

### Installation

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd next-type
```
#### 2. Install Dependencies
For the Next.js Project (using pnpm)
```bash
Copy code
cd nextjs
pnpm install
For the Expo App (using npm for now)
bash
Copy code
cd expo-app
npm install
```

#### 3. Running the Application
Running the Next.js API
```bash
Copy code
cd nextjs
pnpm run dev
```

This will start the Next.js API on http://localhost:3000.

Running the Expo App
bash
Copy code
cd expo-app
npm start
This will open Expo Developer Tools. You can either run the app on a simulator/emulator or scan the QR code to run it on a real device using Expo Go.

#### 4. Database Setup
Ensure your Postgres database is up and running.

Update the .env file in the nextjs directory with your database credentials and other necessary environment variables:

```bash
Copy code
DATABASE_URL=your_postgres_database_url
Drizzle ORM will handle the database schema and migrations. To run migrations:

bash
Copy code
cd nextjs
pnpm run drizzle:sync
```

#### 5. Additional Configuration
If needed, update the Expo app’s .env file with API URLs and other necessary configuration.
The Expo app will consume the API provided by the Next.js backend.
Development Notes
Reinitialize Setup: In case you need to reset and start fresh, follow these steps:
```bash
Copy code
rm -rf node_modules
git clone <repository-url>
cd next-type && pnpm install && npm install
```

### Future Plans
-Migrate the Expo app to pnpm.
-Add more features for comprehensive farm management and tracking.
-Expand support for different devices and platforms.

### Contributing
Contributions are welcome! Feel free to submit pull requests or open issues on GitHub to help improve the project.

### License
This project is licensed under the MIT License. See the LICENSE file for details.


This version includes all necessary information for setup, running the app, database configuration, and future plans.





