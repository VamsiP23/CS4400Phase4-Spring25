<h2>Phase IV Setup + Information</h6>

<h3>Setting Up the Project</h3>
1. Download and install Node.js from the website (https://nodejs.org/en)
2. Clone the git repository onto your local device, and open your the folder on some sort of IDE/Text editor (VSCode).

Now, you have the files to set up both the backend and front end server.

**NOTE: ENSURE THAT YOU HAVE RAN BOTH THE DATABASE FILE AND STORED PROCEDURE FILES IN MYSQLWORKBENCH BEFORE PROCEEDING**

<h4>Setting Up the Backend</h4>
1. Navigate into the backend directory by running <code>cd backend</code> in the terminal.
2. Then, run <code>source venv/bin/activate</code> in the terminal. This creates a local developer environment that has all of the dependencies installed, such as the Flask API.
3. In the main.py file, make sure to change the 'password' argument in the get_db_connection() method to the password to our local instance of MySQL (and username if necessary).
4. Next, run <code>python3 main.py</code> in the terminal to start the backend server.

<h4>Setting Up the Frontend</h4>
1. Navigate into the frontend directory by running <code>cd airplane-system</code> in a separate terminal window.
2. Next, run <code>npm install</code> in the same terminal window to install of the necessary dependencies (Axios, TailwindCSS, etc.)
3. Run <code>npm run dev</code> to start the frontend environment.

<h3>Running the Project</h3>
<h4>Starting the Backend Server</h4>
1. Navigate into the backend directory by running <code>cd backend</code> in the terminal.
2. Then, run <code>source venv/bin/activate</code> in the terminal.
3. Next, run <code>python3 main.py</code> in the terminal to start the backend server.

<h4>Starting the Frontend Server</h4>
1. Navigate into the frontend directory by running <code>cd airplane-system</code> in a separate terminal window.
2. Run <code>npm run dev</code> to start the frontend environment.
3. Copy the link that follows 'Local:' and paste it into the browser to view the website.

<h3>How We Built the App</h3>
We utilized Vite.JS for our frontend and Flask for our backend server. In terms of our frontend, we used React and JSX as the primary way to design and format how the user can interact with various parts of the database.
For example, we incorporated drop down menus (using optgroups) that were subdivided into the views, database tables, and procedures so that the user can achieve all functionality on one page.
When calling our procedure, we made sure to include different number of inputs based on the procedure that was being called. Whenever a procedure was called (using the Execute Procedure button), we made sure 
to give a confirmation message that the request was sent through. Then, users can switch to any of the views or database tables which would be updated based on whatever tables the procedure affected.
Lastly, in order to generate these requests, we used the Axios library that sent a request to our backend server on Flask, using REST APIs.

For our backend, we used a Flask server to create a simple REST API that was able to conduct simple GET and POST requests, with appropriate response codes based on where the request was successful or not. 
We created GET API endpoints for the full tables and views, while we created POST API end points for the stored procedures.

<h3>Responsibilities</h3>
Sri Vamsi completed setting up the backend Flask Server and creating all of GET and POST endpoints mentioned previously.
Kenny focused on refining the UI so that everything could be accessed within one dropdown, and made sure to implement stored procedures 1-3, and the views.
Iris focused on making sure that the UI was adaptable so that it could adjust for the number of parameters for a particular stored procedure, instead of hardcoding everything. She implemented stored procedures 4-9.
Suraj focused on refining the UI so that some of the wider tables didn't leak out of the page by implemeting Tailwind CSS into the app for better UI control. He implemented stored procedures 10-13.


