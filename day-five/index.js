const { readFileSync } = require("fs");
const { it, assertEqual } = require("../helpers/test");

const getFromRange = (boarding, totalRange, bottomCharacter, upperCharacter) => {
  const characters = new RegExp(`([${bottomCharacter}${upperCharacter}]+)`).exec(boarding)[0];
  const range = totalRange;
  for (let index = 0; index < characters.length; index++) {
    const char = characters[index];
    const total = range[1]-range[0];
    if (char === bottomCharacter) {
      const half = Math.floor(total / 2);
      range[1] -= half;
    } else if (char === upperCharacter) {
      const half = Math.ceil(total / 2);
      range[0] += half;
    }
  }
  return range[0] < range[1] ? range[0] : range[1];
};
const getSeatId = (row, column) => row * 8 + column;

const getRow = boarding => getFromRange(boarding, [0, 127], 'F', 'B');
const getColumn = boarding => getFromRange(boarding, [0, 7], 'L', 'R');
const getSeat = boarding => getSeatId(getRow(boarding), getColumn(boarding));
it('should return the valid row', () => {
  const result = getRow('FBFBBFFRLR');
  assertEqual(44, result);
});
it('should return the valid column', () => {
  const result = getColumn('FBFBBFFRLR');
  assertEqual(5, result);
});
it('should return the valid seat id', () => {
  const result = getSeatId(44, 5);
  assertEqual(357, result);
});
it('should return the valid seat from the boarding', () => {
  const result = getSeat('FBFBBFFRLR');
  assertEqual(357, result);
});


var boardings = readFileSync('./input.txt').toString().split('\n');
var seats = boardings.map(boarding => ({
  seat: getSeat(boarding),
  boarding,
}));
var higher = seats.reduce((max, val) => max > val.seat ? max : val.seat);
console.log('Higher seat: ', higher);
seats.sort((a,b) => a.seat-b.seat);


for (let index = 0; index < seats.length; index++) {
  const element = seats[index];
  if (index-1 > 0 && index+1 < seats.length) {
    const previous = seats[index-1];
    if (previous.seat + 1 < element.seat) {
      console.log('Missing set: ', element);
      return
    }
  }

}