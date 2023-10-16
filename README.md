# Auctions
A real-time auction platform where users can bid on items added by administrators.
This project is designed as a customisable platform that can be easily adapted for different users.

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
The project consist of two separate npm projects.
Backend is located in the root of the repository and frontend is located in the `frontend` directory.
In production, the frontend is served from the backend running in a Docker container.
For local development, they are run and developed separately.

## User authentication
To make it easier to integrate the platform with other systems, the platform has an authentication plugin system.
A custom authentication plugin can be easily created if the platform needs to be integrated with an existing authentication provider, such as a database or LDAP.
The authentication plugins can be any JavaScript/TypeScript code that should be placed in `src/authenticators` directory.
The only rule is that the code must implement the interface [Authenticator](src/types.ts#L119).

The authentication plugins are loaded from the `authenticators` directory on startup.
Each plugin has a number prefix (for example `50-AdminAuthenticator.ts`) which indicates the order of plugins.

### Login flow
1. Go through all the authentication plugins and try to authenticate the user with each one
2. If authentication succeeds with any of the plugins, user will be logged in successfully
3. If all plugins fail the authentication, set the login attempt as failed

### Admin authenticator
An example (and default) authenticator plugin is provided with the project.
This [plugin](src/authenticators/50-AdminAuthenticator.ts) checks if the username and password match the admin user account set in the environment variables.

## Configuration
Configuration is done using environmental variables.
For local development, you can create .env files in both root directory.

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

## Local development setup
Install npm dependencies in both root and frontend directory

    npm ci && npm run install-frontend

Start a PostgreSQL database

    docker run --rm -d -p 5432:5432 -e POSTGRES_USER=username -e POSTGRES_PASSWORD=password -e POSTGRES_DB=auctions -e POSTGRES_DB=auctions postgres 

Create an .env file with the required environment variables to connect to the database (see the table above).

Start the backend in development mode

    npm run dev

In another terminal, go to the frontend directory and run

    npm start

If everything is configured correctly, the application should open in your browser.

## Docker
### Dockerfile
A [Dockerfile](Dockerfile) is provided in the repository.
It builds the project in multiple stages and sets the needed environment variables for production.
Both backend and frontend are served from the same container from the same port 3000.

### Docker Compose
Docker Compose is the recommended way to run the application in production.
An example [docker-compose.yml](docker-compose.yml) which includes the database is provided in the repository.

Use the provided `docker-compose.yml` and edit it according your needs.
Make sure to change the database credentials and the JWT secret.

Then start the project with 

    docker compose up

### Volumes
When running the application in Docker, few directories should be mapped the filesystem in order to preserve data between container restarts.
It is also a good idea to make a volume for the PostgreSQL data.

* `/app/uploads` image uploads
* `/app/build/authenticators` authentication plugins, if you have any custom ones. Make sure to compile all TypeScript files to JavaScript.
