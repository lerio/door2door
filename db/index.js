const { Pool } = require('pg')
const url = require('url')
const dbUrl = process.env.DATABASE_URL || 'postgres://ggtojyxjoqnpol:20cd35b914206953f146d9119710769b584f912455688a267faa8503c5ead444@ec2-50-19-89-124.compute-1.amazonaws.com:5432/d5cib03ji3ft3a'

const params = url.parse(dbUrl);
const auth = params.auth.split(':');

const config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: true
};

const pool = new Pool(config);

module.exports = {
    query: (text, params) => pool.query(text, params)
}