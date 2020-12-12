const { readFileSync } = require('fs');

var debugText = `..##.......
#...#...#..
.#....#..#.
..#.#...#.#
.#...##..#.
..#.##.....
.#.#.#....#
.#........#
#.##...#...
#...##....#
.#..#...#.#`;
var rawText =  readFileSync('./input.txt').toString();

var mappingDefinition = {
	['#']: {
		isTree: true,
		isOpen: false,
		replacement: '🌳',
	},
	['.']: {
		isTree: false,
		isOpen: true,
		replacement: '_',
	},
};
var data = rawText.split('\n');

var mapInfo = {
	map: data,
	width: data[0].length,
	height: data.length,
};
console.log('map', { map: mapInfo.map.length, width: mapInfo.width, height: mapInfo.height });
const moveToPosition = (
	{ width, height },
	[currentPositionX, currentPositionY],
  [offsetX, offsetY],
  warpY = false,
) => {
  var reachedBottom = false;
	var targetX = currentPositionX + offsetX;
  var targetY = currentPositionY + offsetY;
  if (!warpY && targetY >= height) {
    targetY = height-1;
    reachedBottom= true;
  }
	var warpedX = targetX - Math.floor(targetX / width) * width;
	var warpedY = warpY
		? targetY - Math.floor(targetY / height) * height
		: targetY;

	return {
		position: [targetX, targetY],
    warped: [warpedX, warpedY],
    reachedBottom,
	};
};
const showPosition = (
	inputMap,
	{ warped: [newPositionX, newPositionY] },
	replacementChar = `😬`,
) => {
	var map = inputMap;
	var line = map[newPositionY];
	line = `${line.substring(0, newPositionX)}${replacementChar}${line.substring(
		newPositionX + 1,
	)}`;
	map[newPositionY] = line;
	return map;
};
var checkPath = (movement) => {
	var currentPosition = moveToPosition(mapInfo, [0, 0], [0, 0]);

	var nodes = [];
	var displayMap = [...mapInfo.map];
	for (let rows = currentPosition.position[1]; rows < mapInfo.height; rows++) {
		currentPosition = moveToPosition(
			mapInfo,
			currentPosition.position,
			movement,
    );
    const row = mapInfo.map[currentPosition.warped[1]];
    if (!row) console.error(currentPosition);
    const cell = row[currentPosition.warped[0]];
		const mapped = mappingDefinition[cell];
		nodes.push({ pos: currentPosition, mapped });
    displayMap = showPosition(displayMap, currentPosition, mapped.replacement);
    if (currentPosition.reachedBottom) {
      break;
    }
	}
	for (let index = 0; index < mapInfo.map.length; index++) {
		const original = mapInfo.map[index];
		const display = displayMap[index];
		console.log(`${original}   ${display}`);
	}
	// console.log(displayMap.join('\n'));
	console.log(
		nodes.map((node) => node.mapped.replacement).join(''),
		':',
		nodes.filter((node) => node.mapped.isTree).length,
	);

	return nodes.filter((node) => node.mapped.isTree).length;
};

var results = [
	checkPath([1,1]),
	checkPath([3,1]),
	checkPath([5,1]),
	checkPath([7, 1]),
	checkPath([1,2]),
];
console.log(
	'result',
	results.reduce((prevValue, curValue) => {
		return prevValue * curValue;
	}, 1),
	results,
);
