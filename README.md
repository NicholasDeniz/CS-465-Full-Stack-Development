# CS-465-Full-Stack-Development
# Travlr Getaways Full Stack Application
# Nicholas Deniz

- Architecture
Compare and contrast the types of frontend development you used in your full stack project, including Express HTML, JavaScript, and the single-page application (SPA).
Why did the backend use a NoSQL MongoDB database?

  In this full stack project I used different types of frontend development. The customers side used Express with static HTML templates which let the site render from the server. I also used Javascript to make the application interactive and connect frontend and backend data. Later I created an Angular single-page application for the admin side. SPA made sure that when the user went through the app it wouldn't reload the entire page. Anglue used components, routing, services, and data to update parts of the page that needed updating. The Angular admin side made organizing the features easier like viewing trips, adding trips, editing trips, authenticating, and loggin in. 
  The backend used MongoDB because trip data fit well with document based data. Each trip would have fields like code, name, length, start date, resort, price, image, and description. MongoDB stores data in JSON documents, making it easy to work the data in JavaScript. MongoDB was also easy and versatile to use, if trip data changed then it would be easier to deal with then a relational database. 

- Functionality
How is JSON different from Javascript and how does JSON tie together the frontend and backend development pieces?
Provide instances in the full stack process when you refactored code to improve functionality and efficiencies, and name the benefits that come from reusable user interface (UI) components.

JSON is a data format while JavaScript is a programming language. JSON is used to communicate data from the Frontend to the Backend and vice versa. In the project the backend would send trip data to the Angular frontend as JSON. Angular would then use that data to show the trip cards. When I updated or added a trip Angular would send JSON data back tot he backend. I also refractored the project by using reusable components. For example, the trip card component would let me be able to reuse the same structure for every trip. Making the code clean and easy to maintain. 

- Testing
Methods for request and retrieval necessitate various types of API testing of endpoints, in addition to the difficulties of testing with added layers of security. Explain your understanding of methods, endpoints, and security in a full stack application.

I tested the API using HTTP methods. A GET request was used to get trip data from the backend. A POST request was used to add new data, like registering a user. A PUT request was used to update an existing trip. Each endpoint had a URL like /api/trips, /api/login, or /api/trips/:tripCode. Security made testing more difficult because routes needed a login token. After logging in the backend would give a JWT token. I sent that token in Postman as a Bearer Token to test routes like editing a trip. Helping me understand endpoints, methods, and authentcation in a full stack application. 

- Reflection
How has this course helped you in reaching your professional goals? What skills have you learned, developed, or mastered in this course to help you become a more marketable candidate in your career field?

This course let me understand how a full stack application works. I learned how the frontend, backend, database, and API connect and work together. I practiced using Angular, Express, Node.js, MongoDB, REST APIs, Postman, and JWT auth. I also learned to test routes. This project helped me learn skills that I can use for web development jobs and it gave me a full stack project that I can put in my portfolio. 
