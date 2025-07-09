const Database = require('better-sqlite3');
const db = new Database('carrentalservices.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS table_listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT,
    status TEXT DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('Table "table_listings" created successfully.');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'user', -- admin or user
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('Table "users" created successfully.');

const insertUser = db.prepare(`
  INSERT INTO users (name, email, password, role)
  VALUES (@name, @email, @password, @role)
`);

const dummyUsers = [
  { name: 'Alice', email: 'alice@example.com', password: 'hashed_pw_1', role: 'admin' },
  { name: 'Bob', email: 'bob@example.com', password: 'hashed_pw_2', role: 'user' },
  { name: 'Charlie', email: 'charlie@example.com', password: 'hashed_pw_3', role: 'user' }
];

const insertManyUsers = db.transaction((users) => {
  for (const user of users) insertUser.run(user);
});
insertManyUsers(dummyUsers);
console.log('3 users inserted into "users".');

const insertListing = db.prepare(`
  INSERT INTO table_listings (title, description, location, status)
  VALUES (@title, @description, @location, @status)
`);

const dummyListings = [
  { title: 'Car A', description: 'Compact car', location: 'Delhi', status: 'pending' },
  { title: 'Car B', description: 'SUV for rent', location: 'Mumbai', status: 'approved' },
  { title: 'Car C', description: 'Sedan with driver', location: 'Bangalore', status: 'rejected' },
  { title: 'Car D', description: 'Luxury ride', location: 'Chennai', status: 'approved' },
  { title: 'Car E', description: 'Budget friendly', location: 'Hyderabad', status: 'pending' },
  { title: 'Car F', description: 'SUV for family trips', location: 'Pune', status: 'approved' },
  { title: 'Car G', description: 'Electric vehicle', location: 'Ahmedabad', status: 'pending' },
  { title: 'Car H', description: 'Convertible car', location: 'Jaipur', status: 'rejected' },
  { title: 'Car I', description: 'Car with sunroof', location: 'Kolkata', status: 'approved' },
  { title: 'Car J', description: 'Vintage car', location: 'Goa', status: 'pending' }
];

const insertManyListings = db.transaction((listings) => {
  for (const listing of listings) insertListing.run(listing);
});
insertManyListings(dummyListings);
console.log('10 listings inserted into "table_listings".');

db.close();
