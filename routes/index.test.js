const rp = require('request-promise')
const uuidv4 = require('uuid/v4')

const api = 'http://localhost:3000'

describe('/vehicles API', () => {
    const id = uuidv4()
    const lat = 52.53
    const lng = 13.403
    const at = '2017-09-01T12:00:00Z'

    it('should register a new vehicle', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/`,
            body: { id },
            resolveWithFullResponse: true
        }).then(result =>
            expect(result.statusCode).toEqual(204)
        )
    )
    it('should not list the registered vehicle', () =>
        rp({
            json: true,
            method: 'GET',
            uri: `${api}/vehicles/`,
            resolveWithFullResponse: true
        }).then(result => {
            let found = false
            expect(result.statusCode).toEqual(200)
            found = result.body && result.body.some((vehicle) => {
                return vehicle.id === id
            })
            expect(found).toBeFalsy()
        })
    )
    it('should not set the location if vehicle has a wrong uuid format', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/+${id}+/locations`,
            body: { lat, lng, at },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
    it('should not set the location if vehicle doesn\'t have a latitude', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/+${id}+/locations`,
            body: {
                lng,
                at
            },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
    it('should not set the location if vehicle has a wrong latitude value type', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/+${id}+/locations`,
            body: {
                lat: lat.toString(),
                lng,
                at
            },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
    it('should not set the location if vehicle doesn\'t have a longitude', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/+${id}+/locations`,
            body: {
                lat,
                at
            },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
    it('should not set the location if vehicle has a wrong latitude value type', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/+${id}+/locations`,
            body: {
                lat,
                lng: lng.toString(),
                at
            },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
    it('should not set the location if vehicle doesn\'t have a timestamp', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/+${id}+/locations`,
            body: {
                lat,
                lng
            },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
    it('should not set the location if vehicle doesn\'t have a valid timestamp format', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/+${id}+/locations`,
            body: {
                lat,
                lng,
                at: `+${at}+`
            },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
    it('should set the location of a vehicle', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/${id}/locations`,
            body: { lat, lng, at },
            resolveWithFullResponse: true
        }).then(result =>
            expect(result.statusCode).toEqual(204)
        )
    )
    it('should list the registered vehicle', () =>
        rp({
            json: true,
            method: 'GET',
            uri: `${api}/vehicles/`,
            resolveWithFullResponse: true
        }).then(result => {
            let found = false
            expect(result.statusCode).toEqual(200)
            found = result.body && result.body.some((vehicle) => {
                return vehicle.id === id
            })
            expect(found).toBeTruthy()
        })
    )
    it('should not deregister a vehicle with a wrong uuid format', () =>
        rp({
            method: 'DELETE',
            uri: `${api}/vehicles/+${id}+`,
            resolveWithFullResponse: true
        }).catch(err => {
            expect(err.statusCode).toEqual(400)
        })
    )
    it('should not deregister a non-registered vehicle', () =>
        rp({
            method: 'DELETE',
            uri: `${api}/vehicles/${uuidv4()}`,
            resolveWithFullResponse: true
        }).catch(err => {
            expect(err.statusCode).toEqual(404)
        })
    )
    it('should deregister the vehicle', () =>
        rp({
            method: 'DELETE',
            uri: `${api}/vehicles/${id}`,
            resolveWithFullResponse: true
        }).then(result => {
            expect(result.statusCode).toEqual(204)
        })
    )
    it('should not list the registered vehicle anymore', () =>
        rp({
            json: true,
            method: 'GET',
            uri: `${api}/vehicles/`,
            resolveWithFullResponse: true
        }).then(result => {
            let found = false
            expect(result.statusCode).toEqual(200)
            found = result.body && result.body.some((vehicle) => {
                return vehicle.id === id
            })
            expect(found).toBeFalsy()
        })
    )
    it('should not register a vehicle with a wrong uuid format', () =>
        rp({
            json: true,
            method: 'POST',
            uri: `${api}/vehicles/`,
            body: { id: `+${id}+` },
            resolveWithFullResponse: true
        }).catch(err =>
            expect(err.statusCode).toEqual(400)
        )
    )
})