SmartLendQueue: Online Borrowing System
Overview
SmartLendQueue is an online borrowing management system designed for the USTP Balubal Office. It allows students, faculty, and administrators to borrow items (e.g., projectors, chairs, microphones) with real-time availability tracking, preventing double-booking. The system features a user-friendly interface, role-based access, and basic security measures.

Developed by: Kein Thon And Friends
Date: May 13, 2025
Purpose: Streamline item borrowing and management at USTP Balubal Office.

Features

Real-Time Availability: Items are marked "Available" or "Unavailable" based on current bookings.
Role-Based Access: Students and faculty can borrow items; admins can manage bookings.
User-Friendly Interface: Responsive design with a grid layout for item selection.
Booking Management: Users submit booking requests with details; admins can remove bookings.
Security: Input sanitization and prepared SQL statements to prevent common attacks.

System Requirements

Server: XAMPP (Apache, MySQL, PHP)
Database: MySQL (smartlendqueue database)
Browser: Any modern browser (e.g., Chrome, Firefox)
Files: All PHP, HTML, CSS, and JS files in the project directory

Installation and Setup
1. Install XAMPP

Download and install XAMPP from apachefriends.org.
Start Apache and MySQL from the XAMPP Control Panel.

2. Configure the Database

Open http://localhost/phpmyadmin in your browser.
Create a database named smartlendqueue.
Run the following SQL to create the bookings table:CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    course VARCHAR(50) NOT NULL,
    role VARCHAR(50) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    item VARCHAR(100) NOT NULL,
    start_time BIGINT NOT NULL,
    end_time BIGINT NOT NULL,
    purpose TEXT NOT NULL
);



3. Place Project Files

Copy all files (index.html, style.css, script.js, check_availability.php, save_booking.php, view_bookings.php, remove_booking.php, db_connect.php) to C:\xampp\htdocs\borrow_system\SmartLendQueue.
Ensure the images folder contains:
logo.png
projector.jpg
chair.jpg
microphones.jpg
extension_wire.jpg
markers.jpg
speakers.jpg
amplifiers.jpg
cords.jpg


If images are missing, add placeholder images with matching names.

4. Access the System

Open your browser and go to: http://localhost/borrow_system/SmartLendQueue/.
Log in with:
Role: student, Password: USTP_BALUBAL_STUDENTS
Role: faculty, Password: USTP_BALUBAL_FACULTY
Role: admin, Password: USTP_BALUBAL_ADMIN



Usage
Login

Select your role and enter the corresponding password to access the system.

Borrow Items (Students/Faculty)

Fill out the form with your name, department, phone number, start/end time, and purpose.
Select an available item from the grid.
Submit the form to book the item; the status will update to "Unavailable".

Manage Bookings (Admins)

View all bookings in a table.
Click "Remove" on a booking to delete it; the item will become "Available" again.

Troubleshooting

Availability Not Updating: Check php_errors.log in the project directory for database errors. Verify the bookings table has correct data.
Missing Images: Ensure all image files are in the images folder with correct names.
Connection Issues: Confirm XAMPP is running and the database is accessible via db_connect.php.

File Structure

index.html: Main webpage with login, borrow, and admin sections.
style.css: Styles for the user interface.
script.js: Client-side logic (login, availability updates, form submission).
check_availability.php: Checks item availability from the database.
save_booking.php: Saves new bookings to the database.
view_bookings.php: Fetches and displays bookings for admins.
remove_booking.php: Deletes bookings from the database.
db_connect.php: Establishes database connection.
images/: Contains item and logo images.

Known Issues

Passwords are hardcoded for simplicity; a real system should use a secure authentication method.
view_bookings.php was initially a duplicate of save_booking.php—use the corrected version provided.

Contributing

Report issues or suggest improvements by contacting me 09636204403 or email me in racasakleinthon@gmail.com.
Ensure all changes are tested with XAMPP and the MySQL database.
