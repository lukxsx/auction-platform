# Auctions
A real-time auction platform where users can bid on items added by administrators.
This project is designed as a customizable platform that can be easily adapted for different users.

Built with TypeScript, Express, React, Socket.io and PostgreSQL.

## Features
* Real-time updates and notifications
* User roles (regular users and admins)
* Support for custom fields in items
* Image support
* Authentication plugin system
  * Easy integration with third-party authentication providers
* Create HTML reports of auctions

## Project structure
The project consists of two separate npm projects and Cypress tests.
The backend is located in the `backend` directory and the frontend is located in the `frontend` directory. Cypress tests are in the `cypress` directory.

In production, the frontend is served by the backend running in a Docker container.
For local development, they are run and developed separately.

## User authentication
To make it easier to integrate the platform with other systems, the platform has an authentication plugin system.
A custom authentication plugin can be easily created if the platform needs to be integrated with an existing authentication provider, such as a database or LDAP.
The authentication plugins can be any JavaScript/TypeScript code that should be placed in `src/authenticators` directory.
The only rule is that the code must implement the interface [Authenticator](src/types.ts#L119).

The authentication plugins are loaded from the `authenticators` directory on startup.
Each plugin has a number prefix (for example `50-DefaultAuthenticator.ts`) which indicates the order of plugins.

### Login flow
1. Go through all the authentication plugins and try to authenticate the user with each one
2. If authentication succeeds with any of the plugins, the user will be logged in successfully
3. If all plugins fail the authentication, set the login attempt as failed

### Admin authenticator
An example authenticator plugin is provided with the project.
This [plugin](src/authenticators/50-DefaultAuthenticator.ts) checks if the username and password match the admin user account set in the environment variables.

## Configuration
Configuration is done using environmental variables.
For local development, you can create .env files in both frontend and backend directories.

| Variable       | Setting                        |
|----------------|--------------------------------|
| PORT           | Port for the backend           |
| JWT_SECRET     | JWT secret string              |
| ADMIN_USERNAME | Username for the admin account |
| ADMIN_PASSWORD | Password for the admin account |
| DB_HOST        | Postgres database hostname     |
| DB_USER        | Postgres database username     |
| DB_PASS        | Postgres database password     |
| DB_NAME        | Postgres database name         |
| NODE_ENV       | Serve frontend from backend if set to `production`. Testing mode if set to `test`|
| DEMO_MODE      | Enable "demo" account. Do not use in production.|

## Local development setup
Install npm dependencies in both frontend and backend directories

    cd frontend && npm ci
    cd ../backend && npm ci

Start a PostgreSQL database

    docker run --rm -d -p 5432:5432 -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=auctions -e POSTGRES_DB=auctions postgres 

Create an .env file with the required environment variables to connect to the database (see the table above).

Go to the backend directory and start the backend in development mode

    npm run dev

In another terminal, go to the frontend directory and run

    npm run dev

If everything is configured correctly, the application should open in your browser.
The frontend will run in port `3000` and the backend in port `3001`.
[http://localhost:3000](http://localhost:3000)

## Docker
### Dockerfile
A [Dockerfile](Dockerfile) is provided in the repository.
It builds the project in multiple stages and sets the needed environment variables for production.
Both the backend and frontend are served from the same container from the same port 3000.

### Docker Compose
Docker Compose is the recommended way to run the application in production.
An example [docker-compose.yml](docker-compose.yml) which includes the database is provided in the repository.

Use the provided `docker-compose.yml` and edit it according to your needs.
Make sure to change the database credentials and the JWT secret.

Start the project with

    docker compose up --build

### Volumes
When running the application in Docker, volumes should be used to preserve data between container restarts.

These directories should be mapped to volumes:
* `/app/uploads` image uploads
* `/app/build/authenticators` authentication plugins, if you have any custom ones. Make sure to compile all TypeScript files to JavaScript.

## Tests
The project is tested with unit tests and end-to-end tests.

### Testing mode
When `NODE_ENV` is set to `test`, the application will run in testing mode. In the testing mode /testing route becomes available and user accounts for testing are created.
Never enable this mode in production!

### Unit tests
Launch the backend in testing mode and run npm test

    cd backend
    NODE_ENV=test npm run dev
    npm test

### End-to-end tests
End-to-end tests using Cypress have been created for the application. The tests require
that the both backend and frontend are running and connected to a database. There are
a couple of options to do so.

**Note!** The end-to-end tests might take up to 2 minutes to finish.

#### Running E2E tests on Docker
A Docker Compose file `docker-compose.test.yml` is provided in the project. It launches
a database and the application with `NODE_ENV=test`. Cypress can be then launched using Docker.

Start the application in testing mode

    docker compose -f docker-compose.test.yml up -d --build

Run Cypress in a Docker container

    docker run -v $(pwd)/cypress:/cypress -v $(pwd)/cypress.docker.js:/cypress.config.js --network=host cypress/included:13.6.4

#### Running Cypress locally
Start the backend in testing mode

    cd backend
    NODE_ENV=test npm run dev

Start frontend

    cd frontend
    npm run dev

At the root of the project, run

    npx cypress run

**Note!** You might need to adjust the `backend_url` and `app_url` parameters in [cypress.config.js](cypress.config.js) if the frontend is not served from the backend (backend and frontend started separately).

## CI/CD
The project has a GitHub Actions pipeline, which runs linting and tests when new commits arrive in the master branch.
