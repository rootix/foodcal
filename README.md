# Foodcal

Weekly food planning tool for my own purpose. Currently in a MVP version.

## Installation

1. Setup FaunaDB Database (see [Instructions](database/database-setup.md))
2. Configure `FAUNADB_SECRET` environment variable with the secret from the FaunaDB server key
3. Start application with `npm start`

## Deployment

The application runs only on Netlify (free account) as it uses Netlify Functions to handle FaunaDB user sessions.

1. Create a new site with the repository (fork it to have a stable version)
2. Configure Deploy
    - Base directory: `<empty>`
    - Build command: `ng build --prod`
    - Publish directory: `dist/Foodcal`
3. Configure `FAUNADB_SECRET` environment variable in Deploy configuration
