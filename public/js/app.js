angular.module('door2door', ['uiGmapgoogle-maps'])
    .config(function (uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            key: 'AIzaSyAGsg_7d8yiZcRRQbB0rNHpmkGu8UkixDI'
        })
    })
    .controller('AppCtrl', function ($http, $scope, $timeout) {
        // door2door coordinates
        const latHQ = 52.53
        const lngHQ = 13.403

        // calculates the rotation angle of two coordinates
        const directionFromCoordinates = (lat1, lng1, lat2, lng2) => {
            if (lat1 && lng1 && lat2 && lng2) {
                const dLon = (lng2 - lng1)
                const y = Math.sin(dLon) * Math.cos(lat2)
                const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon)
                let brng = Math.atan2(y, x)
                brng = brng * (180 / Math.PI)
                brng = (brng + 360) % 360
                brng = 360 - brng
                return brng
            }
            return 0
        }

        let app = this

        // the map configuration object
        app.map = {
            center: { latitude: latHQ, longitude: lngHQ },
            zoom: 13
        }
        app.markers = []
        app.cluster = {
            minimumClusterSize: 2,
            averageCenter: true
        }

        let current = {} // temp object for storing the previous coordinates of a vehicle (for the rotation angle)
        let rotation = 0

        // gets the list of registered vehicles with coordinates and displays them as markers
        let fetchVehicles = () => {
            $http.get('/vehicles').then((res) => {
                app.markers = res.data.map((vehicle) => {
                    if (vehicle.id && vehicle.lat && vehicle.lng) {
                        rotation = directionFromCoordinates(
                            current[vehicle.id] && current[vehicle.id].lat,
                            current[vehicle.id] && current[vehicle.id].lng,
                            vehicle.lat,
                            vehicle.lng
                        )
                        current[vehicle.id] = { lat: vehicle.lat, lng: vehicle.lng }
                        return {
                            id: vehicle.id,
                            coords: { latitude: vehicle.lat, longitude: vehicle.lng },
                            options: {
                                icon: {
                                    path: google.maps.SymbolPath.FORWARD_OPEN_ARROW,
                                    scale: 3,
                                    rotation
                                }
                            }
                        }
                    }
                })
            })
            $timeout(fetchVehicles, 3000)
        }

        // fetching new list every 3 seconds
        fetchVehicles()

        // adding testable functions to the scope
        $scope.directionFromCoordinates = directionFromCoordinates
    })