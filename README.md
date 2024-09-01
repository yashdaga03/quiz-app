
# Quiz App

This is a quiz app where admin can create quiz using a set of questions and users can attempt and get their results. This app has in memory storage and works with typescript node js (express).

Tech Features -
- 
- The app contains rest APIs related to the doc shared.
- There are various service and controller level tests added using jest and supertest.
- Proper exception handling is also added along with middlewares for input validations
- The application is also containerized using Docker.

Installation -
- 
- Installation of this app is fairly straight forward, you can either use docker or locally set it up:
	- Local:
		- Clone this repository.
		- Run: npm install
		- Run: npm test (to check all tests are passing or not)
		- Run: npm run start
	- Docker:
		- Clone the repository.
		- Run: docker compose up --build
