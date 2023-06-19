
# Online Judge
The project "Online Judge" is a comprehensive platform aimed at combating the limited awareness and participation in competitive programming among our college community. This project was conceived with the goal of fostering motivation among students to improve and establish a competitive programming culture that is currently lacking in our college.

1. User Registration and Authentication:
* The platform supports authentication mechanisms to verify user credentials and ensure secure access.
2. Modern and Intuitive Design:
* The UI of Online Judge GNDEC boasts a modern and visually appealing design.
* The overall layout and styling are carefully crafted to provide an intuitive and seamless user experience.
3. Problem Submission:
* Users can submit their code solutions for different programming problems.
* The platform supports multiple programming languages: C, C++, Java & Python.
* Users can provide input for their code and receive output results.
4. Automated Test Case Checking:
* The platform has an automated test case checking system to evaluate the correctness of code submissions.
* Test cases are provided for each problem, and the platform compares the output generated by the submitted code against the expected output.
* The system provides feedback to users on the success or failure of their code execution. 
5. Contest Participation:
* Users can participate in coding contests organized on the platform.
* The platform tracks the progress and scores of participants during the contest.
* Contest standings and rankings are updated in real-time.
6. Code Evaluation and Compilation:
* The platform has a code evaluation and compilation system to execute submitted code. The system compiles the code using the selected programming language and checks for syntax errors.
* The platform provides compile-time error messages to users for code corrections. 
7. Leaderboard and Ranking:
* The platform maintains a leaderboard and ranking system to display the performance of users.
* Users can view their rankings based on contest participation, problem solving, and overall performance in each Contest.

# Installation Guide
This guide will walk you through the installation process for the OnlineJudge_GNDEC project. Please make sure you have the following prerequisites installed on your system:

* HTML-CSS
* JavaScript, NodeJS
* MySQL
* C/C++ Compiler (G++)
* Java Development Kit (JDK)
* Python (version 3.6 or higher)
* Node.js (version 14 or higher)






## Step 1: Clone the Repository
1. Open a terminal on your system/IDE.
2. Change to the directory where you want to clone the project.
3. Run the following command to clone the repository:


```bash
git clone https://github.com/anorangefalcon/OnlineJudge_GNDEC.git 
```
## Step 2: Install Node.js Dependencies
1. Change to the project directory:
```bash
cd OnlineJudge_GNDEC
```
2. Install the Node.js dependencies by running the following command:
```bash
npm install
```
## Step 3: Set Up MySQL Database
1. Ensure that MySQL is installed and running on your system.
2. Create a new MySQL database for the project. You can use the following SQL commands:
```sql
-- Create the onlinejudge database
CREATE DATABASE onlinejudge;

-- Use the onlinejudge database
USE onlinejudge;

-- Create the demousers table
CREATE TABLE demousers (
  email VARCHAR(255) PRIMARY KEY,
  password VARCHAR(255)
);

-- Create contest1 table
CREATE TABLE contest1 (
  email VARCHAR(255) PRIMARY KEY,
  ques1 INT DEFAULT 0,
  ques2 INT DEFAULT 0,
  ques3 INT DEFAULT 0,
  ques4 INT DEFAULT 0,
  ques5 INT DEFAULT 0,
  ques6 INT DEFAULT 0,
  FOREIGN KEY (email) REFERENCES demousers(email)
);
```
3. Open the server/app.js file and update MySQL connection with your MySQL database credentials.

## Step 4: Configure Compiler/Interpreters
* Ensure that suitable compilers/interpreters are installed on your system for C, C++, Python and Java.
* G++ recommended for C & C++.

## Step 5: Start the Application
1. Start the application by running the following command:
```bash
npm start
```
2. Open a web browser and navigate to http://localhost:3000 to access the OnlineJudge_GNDEC application.  
           
           
That's it! You have successfully installed and set up the OnlineJudge_GNDEC project. You can now start using it for online judging.

# Contributing
If you would like to contribute to this project, please follow these guidelines:

1. Fork the repository on GitHub.
2. Clone your forked repository.
3. Create a new branch for your feature or bug fix.
4. Make your changes and commit them.
5. Push your changes to your forked repository.
6. Submit a pull request detailing your changes.
## Authors

- [@Priyanshu Dhall](https://www.github.com/anorangefalcon)
- [@Payal Kash](https://www.github.com/Payal508)
