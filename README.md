# door2door
door2door, the operator of the 'allygator shuttle' service in Berlin, collects the live position of all vehicles in its fleet in real-time via a GPS sensor in each vehicle.

## Setup & Requirements
The app requires the latest Node.js version (at the time of writing: `v8.8.1`)

Dependencies can be installed with
```
$ yarn
```

## Running the app
A valid `DATABASE_URL` must be exported containing the connection URL to a DB initialized with the provided `schema.sql`.
In alternative, you can just connect to an already existing DB:
```
$ DATABASE_URL=postgres://ggtojyxjoqnpol:20cd35b914206953f146d9119710769b584f912455688a267faa8503c5ead444@ec2-50-19-89-124.compute-1.amazonaws.com:5432/d5cib03ji3ft3a node index.js
```
The above command will run the app accessible at http://localhost:3000
