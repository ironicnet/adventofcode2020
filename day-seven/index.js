const { readFileSync } = require('fs');
const { it, assertEqual, assertIncludes } = require('../helpers/test');
var input = readFileSync('./input.txt').toString();

const debugText = `light red bags contain 1 bright white bag, 2 muted yellow bags.
dark orange bags contain 3 bright white bags, 4 muted yellow bags.
bright white bags contain 1 shiny gold bag.
muted yellow bags contain 2 shiny gold bags, 9 faded blue bags.
shiny gold bags contain 1 dark olive bag, 2 vibrant plum bags.
dark olive bags contain 3 faded blue bags, 4 dotted black bags.
vibrant plum bags contain 5 faded blue bags, 6 dotted black bags.
faded blue bags contain no other bags.
dotted black bags contain no other bags`;

const getDefinition = (bag, definitions) =>
  definitions.find((d) => d.name === bag);
const getDefinitions = (text) => {
	const definitions = text.split(`\n`).map((bagDefinition) => {
		const [name, content] = bagDefinition.replace('.', '').split(' contain ');

		return {
			name: name.substring(0, name.length - 5),
			containedBy: [],
			canContain: [],
			contains: content.split(',').map((item) => {
				const [, amount, bag] = /([0-9]+|no) (.*) bags?/.exec(item);
				return { amount: amount === 'no' ? 0 : parseInt(amount, 10), bag };
			}),
		};
	});
	// console.log(definitions);
	definitions.forEach((definition) => {
		definition.contains.forEach((contained) => {
			if (contained.amount > 0) {
				// console.log(contained);
				const reference = getDefinition(contained.bag, definitions);
				if (!reference) console.log('Bag not found', contained);
				reference.containedBy.push(definition.name);
			}
		});
	});

	return definitions;
};
const getContainers = (reference, targetBag, definitions, containers = []) => {
  for (let index = 0; index < reference.containedBy.length; index++) {
    const parent = getDefinition(reference.containedBy[index], definitions);
    if (!containers.includes(reference.containedBy[index])) {
      containers.push(reference.containedBy[index]);
      getContainers(parent, targetBag, definitions, containers);
    }
  }
};

it('should get the correct amount of definitions', () => {
	const definitions = getDefinitions(debugText);
	assertEqual(9, definitions.length);
});
it('should contain the correct amount of bags', () => {
	const definitions = getDefinitions(debugText);
	const sumAmmount = (definition) =>
		definition.contains
			.map((d) => d.amount)
			.reduce((accum, value) => accum + value);
	assertEqual(3, sumAmmount(definitions[0]));
	assertEqual(7, sumAmmount(definitions[1]));
	assertEqual(1, sumAmmount(definitions[2]));
	assertEqual(11, sumAmmount(definitions[3]));
	assertEqual(3, sumAmmount(definitions[4]));
	assertEqual(7, sumAmmount(definitions[5]));
	assertEqual(11, sumAmmount(definitions[6]));
	assertEqual(0, sumAmmount(definitions[7]));
	assertEqual(0, sumAmmount(definitions[8]));
});
it('should mark the bags which contains the `shiny bag`', () => {
  const definitions = getDefinitions(debugText);

  const targetBag = 'shiny gold';
  const containers = [];
  getContainers(getDefinition(targetBag, definitions), targetBag, definitions, containers);
  console.log(containers);
  assertIncludes('bright white', containers);
  assertIncludes('muted yellow', containers);
  assertIncludes('dark orange', containers);
  assertIncludes('light red', containers);
  assertEqual(4, containers.length);
});

const definitions = getDefinitions(input);
const targetBag = 'shiny gold';
const containers = [];
getContainers(getDefinition(targetBag, definitions), targetBag, definitions, containers);
console.log('Containers: ', containers.length);
