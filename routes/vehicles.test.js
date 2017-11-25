const { deg2rad, isWithinDistance, isNumeric } = require('./vehicles')
const latHQ = 52.53
const lngHQ = 13.403
const allowedDistanceInKm = 3.5

describe('deg2rad function', () => {
    test('should return 0 when given 0', () => {
        expect(deg2rad(0)).toEqual(0);
    })
    test('should return 1.5707963267948966 when given 90', () => {
        expect(deg2rad(90)).toEqual(1.5707963267948966);
    })
    test('should return -1.5707963267948966 when given -90', () => {
        expect(deg2rad(-90)).toEqual(-1.5707963267948966);
    })
    test('should return 6.283185307179586 when given 360', () => {
        expect(deg2rad(360)).toEqual(6.283185307179586);
    })
})

describe('isWithinDistance function', () => {
    it('should be truthy when given NewStore\'s office coordinates', () =>
        expect(isWithinDistance(52.5207321, 13.3797115, latHQ, lngHQ, allowedDistanceInKm)).toBeTruthy()
    )
    it('should be falsy when given Milan\'s Duomo coordinates', () =>
        expect(isWithinDistance(45.464211, 9.191383, latHQ, lngHQ, allowedDistanceInKm)).toBeFalsy()
    )
    it('should be falsy when given coordinates without latitude', () =>
        expect(isWithinDistance(45.464211, 9.191383, null, lngHQ, allowedDistanceInKm)).toBeFalsy()
    )
    it('should be falsy when given coordinates without longitude', () =>
        expect(isWithinDistance(45.464211, 9.191383, latHQ, null, allowedDistanceInKm)).toBeFalsy()
    )
    it('should be falsy when given coordinates without distance', () =>
        expect(isWithinDistance(45.464211, 9.191383, latHQ, lngHQ)).toBeFalsy()
    )
})

describe('isNumeric function', () => {
    test('should be truthy when given 0', () => {
        expect(isNumeric(0)).toBeTruthy();
    })
    test('should be truthy when given -100', () => {
        expect(isNumeric(-100)).toBeTruthy();
    })
    test('should be truthy when given 3.14', () => {
        expect(isNumeric(3.14)).toBeTruthy();
    })
    test('should be truthy when given \'3.14\'', () => {
        expect(isNumeric('3.14')).toBeTruthy();
    })
    test('should be falsy when given \'foo\'', () => {
        expect(isNumeric('foo')).toBeFalsy();
    })
    test('should be falsy when given null', () => {
        expect(isNumeric(null)).toBeFalsy();
    })
    test('should be falsy when given undefined', () => {
        expect(isNumeric(undefined)).toBeFalsy();
    })
})