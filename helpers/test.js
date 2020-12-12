
const assertEqual = (expected, value) => {
  if (expected !== value) {
	  throw new Error(`Expected ${expected}. Found ${value}.`);
  }
};
const assertAllEqual = (expected, value) => {
  if (expected.length !== value.length) {
    throw new Error(`Expected length ${expected.length}. Found ${value.length}.`);
  }
  for (let index = 0; index < expected.length; index++) {
    const expectedValue = expected[index];
    if (expectedValue !== value[index]) {
      throw new Error(`Expected ${expected}. Found ${value}. index: ${index}`);
    }
  }
};
const it = (title, predicate) => {
  try {
    predicate();
    console.info(`%c\x1b[32m ☑ ${title} \x1b[0m`, 'color: #00FF00')
  } catch (e) {
    console.error(`${title}: ${e}`);
    console.info(`%c\x1b[31m ☒ ${title} \x1b[0m`, 'color: #00FF00')
  }
};
module.exports = {
  it,
  assertEqual,
  assertAllEqual,
}