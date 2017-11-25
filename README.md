# door2door
door2door, the operator of the 'allygator shuttle' service in Berlin, collects the live position of all vehicles in its fleet in real-time via a GPS sensor in each vehicle.

## Setup & Requirements
The app requires the latest Node.js version (at the time of writing: `v8.8.*`)

Dependencies can be installed with
```
$ yarn
```

## Running the app
A valid `DATABASE_URL` must be exported containing the connection URL to a DB initialized with the provided `schema.sql`.
In alternative, you can just connect to an already existing DB:
```
$ yarn start
```
The above command will run the app accessible at http://localhost:3000

## Running the tests
The following command will run integration and unit tests on the backend as well as unit tests on the frontend (by opening your default browser):
```
yarn test
```
