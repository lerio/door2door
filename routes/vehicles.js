const Router = require('express-promise-router')
const bodyParser = require('body-parser')
const moment = require('moment')
const db = require('../db')
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const router = new Router()

// checks whether it's an integer or a float
const isNumeric = (n) => { return !isNaN(parseFloat(n)) && isFinite(n) }

// checks if a given coordinate is within a 3.5km radius from door2door's HQ
const isInCityBounds = (lat, lng) => {
    const latHQ = 52.53
    const lngHQ = 13.403
    const p = Math.PI / 180
    const a = 0.5 - Math.cos((lat - latHQ) * p) / 2 + Math.cos(latHQ * p) * Math.cos(lat * p) * (1 - Math.cos((lng - lngHQ) * p)) / 2;

    return (12742 * Math.asin(Math.sqrt(a))) <= 3.5 // 2 * R; R = 6371 km
}

router.use(bodyParser.json())
module.exports = router

// ednpoints definitions

router.get('/', async (req, res) => {
    const { rows } = await db.query(
        'SELECT id, lat, lng FROM vehicle WHERE lat IS NOT NULL AND lng IS NOT NULL'
    )
    res.json(rows)
})

router.post('/', async (req, res) => {
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

router.post('/:vehicleID/locations', async (req, res) => {
    // storing every single tracking recording for further analisys
    try {
        await db.query(
            'INSERT INTO tracking_data (id, lat, lng, at) VALUES ($1, $2, $3, $4)',
            [req.params.vehicleID, req.body.lat, req.body.lng, req.body.at]
        )
    } catch (err) {
        console.error(err.stack)
    }

    if (
        req.params.vehicleID && uuidPattern.test(req.params.vehicleID) &&
        req.body.lat && isNumeric(req.body.lat) &&
        req.body.lng && isNumeric(req.body.lng) &&
        req.body.at && moment(req.body.at, moment.ISO_8601).isValid() &&
        // stop tracking out of bounds vehicles: it's done this way to get the last known position
        isInCityBounds(req.body.lat, req.body.lng)
    ) {
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

router.delete('/:vehicleID', async (req, res) => {
    if (req.params.vehicleID && uuidPattern.test(req.params.vehicleID)) {
        try {
            const res = await db.query(
                'DELETE FROM vehicle WHERE id = $1',
                [req.params.vehicleID]
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