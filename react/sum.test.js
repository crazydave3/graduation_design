import { describe,expect, test} from '@jest/globals';
const sum = require('./sum.js')
describe('sum module', ()=> {
    test('add 1 + 2 to equal 3', () => {
        expect(sum(1,2)).toBe(4)
    })
})
