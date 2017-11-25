const Router = require('express-promise-router')
const bodyParser = require('body-parser')
const moment = require('moment')
const db = require('../db')

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const vehicles = new Router()
const latHQ = 52.53
const lngHQ = 13.403
const allowedDistanceInKm = 3.5

// checks whether it's an integer or a float
const isNumeric = (n) => { return !isNaN(parseFloat(n)) && isFinite(n) }

const deg2rad = (deg) => {
    return deg * (Math.PI / 180)
}

const isWithinDistance = (lat1, lng1, lat2, lng2, distance) => {
    if (!lat1 || !lng1 || !lat2 || !lng2 || !distance) {
        return false
    }

    const R = 6371 // Earth radius in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lng2 - lng1)
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    return R * c <= distance
}

vehicles.use(bodyParser.json())

// ednpoints definitions

vehicles.get('/', async (req, res) => {
    const { rows } = await db.query(
        'SELECT id, lat, lng FROM vehicle WHERE lat IS NOT NULL AND lng IS NOT NULL'
    )
    res.json(rows)
})

vehicles.post('/', async (req, res) => {
    if (req.body.id && uuidPattern.test(req.body.id)) {
        try {
            const res = await db.query(
                'INSERT INTO vehicle (id, created_at) VALUES ($1, CURRENT_TIMESTAMP) ON CONFLICT (id) DO NOTHING',
                [req.body.id]
            )
        } catch (err) {
            console.error(err.stack)
            res.sendStatus(500)
            return
        }
        res.sendStatus(204)
        return
    }
    res.sendStatus(400)
})

vehicles.post('/:vehicleID/locations', async (req, res) => {
    if (
        req.params.vehicleID && uuidPattern.test(req.params.vehicleID) &&
        req.body.lat && isNumeric(req.body.lat) &&
        req.body.lng && isNumeric(req.body.lng) &&
        req.body.at && moment(req.body.at, moment.ISO_8601).isValid() &&
        // stop tracking out of bounds vehicles: it's done this way to get the last known position
        isWithinDistance(req.body.lat, req.body.lng, latHQ, lngHQ, allowedDistanceInKm)
    ) {
        // storing every single tracking recording for further analysis
        try {
            await db.query(
                'INSERT INTO tracking_data (id, lat, lng, at) VALUES ($1, $2, $3, $4)',
                [req.params.vehicleID, req.body.lat, req.body.lng, req.body.at]
            )
        } catch (err) {
            console.error(err.stack)
        }

        try {
            await db.query(
                'UPDATE vehicle SET (lat, lng, updated_at) = ($1, $2, $3) WHERE id = $4',
                [req.body.lat, req.body.lng, req.body.at, req.params.vehicleID]
            )
        } catch (err) {
            console.error(err.stack)
            res.sendStatus(500)
            return
        }
        res.sendStatus(204)
        return
    }
    res.sendStatus(400)
})

vehicles.delete('/:vehicleID', async (req, res) => {
    if (req.params.vehicleID && uuidPattern.test(req.params.vehicleID)) {
        try {
            const deleteRes = await db.query(
                'DELETE FROM vehicle WHERE id = $1',
                [req.params.vehicleID]
            )
            if (deleteRes.rowCount === 0) {
                res.sendStatus(404)
                return
            }

        } catch (err) {
            console.error(err.stack)
            res.sendStatus(500)
            return
        }

        res.sendStatus(204)
        return
    }
    res.sendStatus(400)
})

module.exports = {
    deg2rad,
    isNumeric,
    isWithinDistance,
    vehicles
}
