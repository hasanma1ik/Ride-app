# Ride-app
# RideZap


<strong> RideZap - A Comprehensive Ride-Sharing Application </strong>
RideZap is a full-stack ride-sharing application designed to connect passengers with drivers in a seamless and efficient manner. The app offers a robust set of features for both users and drivers, focusing on real-time data handling, intuitive interfaces, and secure transactions.

Features
User Features
Easy Ride Booking: Users can book rides by selecting their pickup and drop-off locations from a list of popular destinations or by searching for specific addresses.

Real-time Fare Calculation: The app calculates fares dynamically based on the distance between pickup and drop-off locations and the selected ride type (e.g., RideZap or RideZapX).
 <img src="https://github.com/user-attachments/assets/7a25c633-2514-4d16-82f7-c12e04e3245c" width="300"/>
  <img src="https://github.com/user-attachments/assets/c833154f-dcd0-4df1-ad0e-0bca18de3568" width="300"/>
   <img src="https://github.com/user-attachments/assets/cdbbca24-9b6d-43d8-a4b1-4d13e78e3a5f" width="300"/>

 <img src="https://github.com/user-attachments/assets/897685b5-970f-4174-96fa-39de8bb42380" width="300"/>

 <img src="https://github.com/user-attachments/assets/6da3ef60-6308-4e53-ba22-e9dcae99fa42" width="300"/>
 <img src="https://github.com/user-attachments/assets/030268f2-41cf-43cc-9db0-70f05897e1ec" width="300"/>
 <img src="https://github.com/user-attachments/assets/6c6338b2-ac54-4d59-90de-453c25732989" width="300"/>
 <img src="https://github.com/user-attachments/assets/bbedd5ac-e8ca-4f8c-86a4-ba81683db17b" width="300"/>

 <img src="https://github.com/user-attachments/assets/bb909130-2f00-4f6e-afa9-ea84b86719c6" width="300"/>
 <img src="https://github.com/user-attachments/assets/8f2dd521-f5ea-435f-91bc-1b87b6c0c1a4" width="300"/>

 <img src="https://github.com/user-attachments/assets/f193ee56-9d00-497e-97f0-105f4c845934" width="300"/>



Ride Options: Users can choose between different ride types:

RideZap: Affordable everyday rides.
RideZapX: Premium rides with extra comfort.
Trip Visualization: Upon booking a ride, users can view the route on an interactive map, with markers indicating the pickup (blue circle) and destination (green circle), connected by a line.

Ride History Tracking: Users have access to their ride history, which includes detailed information like date, time, fare, pickup and drop-off locations, and a visual route map.

Detailed Ride Information: Users can tap on any past trip to view comprehensive ride details, including the exact route taken on the map.

Driver Features
Driver Registration and Profile Management: Drivers can register on the platform, update their vehicle information, and set their availability status.

Ride Requests Management: Available drivers receive ride requests and can accept or decline them based on their preference.

Real-time Ride Updates: Drivers can update the status of rides (e.g., start ride, complete ride), which is reflected in real-time to the user.

Earnings Tracking: Drivers can view their total earnings and access their ride history, which includes customer names, ride types, amounts earned, and detailed ride information.

Ride History: Access to a comprehensive ride history allows drivers to keep track of all completed rides and earnings.

General Features
Secure Authentication and Authorization: Implemented JWT-based authentication for secure user and driver sessions, ensuring that only authorized individuals can access certain features.

Interactive Maps Integration: Utilized mapping services to display routes, markers, and interactive maps for enhanced user experience.

Responsive Design: The app offers a consistent and intuitive user interface across different devices and screen sizes.

Real-time Data Handling: Leveraged real-time communication protocols for instantaneous updates between drivers and users.

Error Handling and Notifications: Comprehensive error handling with user-friendly notifications and alerts to enhance usability.

Technologies Used
Frontend:

React Native: For cross-platform mobile application development.
Axios: For handling HTTP requests to the backend API.
React Navigation: For seamless navigation between screens.
Backend:

Node.js & Express.js: For building a robust RESTful API.
MongoDB & Mongoose: For data storage and object modeling.
JWT (JSON Web Tokens): For secure authentication and authorization.
Socket.IO (planned): For real-time communication (e.g., live driver tracking).
APIs and Services:

Google Maps API: For geolocation and map rendering.
GeoJSON: For handling geographical data formats.
State Management:

React Context API: For managing global state within the application.
Styling:


Real-time Driver Tracking: Implement live location sharing of the driver for users awaiting pickup.


Safety Features: Implement an emergency button to share real-time location with trusted contacts.

<strong>Driver Features</strong>

Driver Registration and Configuration: Enables users to register as drivers and set up their driver profile, vehicle details, and availability status. Only registered drivers can access the Driver Dashboard.

Driver Dashboard: This central hub for drivers displays key information such as weekly earnings and upcoming rides. Drivers can view and manage ride requests, choosing to either accept or decline them. Upon accepting a ride, drivers are guided to an in-app map for navigation. Throughout the trip, drivers have actionable controls:

Pick Up Passenger: Drivers mark the beginning of the ride.
Drop Off Passenger: At the destination, drivers complete the ride, automatically adding the ride fare to their weekly earnings.
Ride History: The Driver Dashboard includes a comprehensive ride history, detailing all completed rides. Each entry shows the ride type, fare amount, and other essential trip information.

Ride Details: Clicking on any ride in the Ride History page provides an in-depth view of that trip, including the date, time, ride type, fare, and pickup and drop-off locations.

<strong>Passenger Features</strong>

Plan Your Trip: Allows users to schedule rides by selecting both pickup and destination locations. This feature supports a user-friendly search and filter for popular locations, offering a convenient booking experience.

Ride Confirmation Page: After booking, passengers are presented with a map showing their current location and desired destination. Passengers can choose between:

RideZap: A standard, affordable ride option.
RideZapX: A premium option offering added comfort for a higher fare.
This page also dynamically calculates and displays the fare for each ride option based on distance and ride type.
Trips Page: Displays a detailed history of the passenger's completed rides, including date, time, pickup and drop-off locations, and fare amount. Each ride is listed with a clear and intuitive layout, allowing passengers to easily review their trip history.















 

