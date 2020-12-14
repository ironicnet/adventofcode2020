const { readFileSync } = require("fs");
const { it, assertEqual } = require("../helpers/test");

var input = readFileSync('./input.txt').toString();
var questions = []
for (i=0; i<26; i++) {
questions.push(String.fromCharCode(65+i).toLowerCase());
}
const rawText = `abc

a
b
c

ab
ac

a
a
a
a

b`;

const getGroups = text => text.split('\n\n').map(groupText => {
  const persons = groupText.split('\n');
  return {
    persons,
    afirmativeAnswers: questions.filter(q => persons.every(p => p.includes(q))).length,
    };
  });
const sumAffirmativeQuestions = groups => {
  return groups.map(group => group.afirmativeAnswers).reduce((accum, value) => accum + value);
}

it('should return the correct amount of groups', () => {
  const groups = getGroups(rawText);
  assertEqual(5, groups.length);
});

it('should return the correct amount of people', () => {
  const groups = getGroups(rawText);
  assertEqual(1, groups[0].persons.length);
  assertEqual(3, groups[1].persons.length);
  assertEqual(2, groups[2].persons.length);
  assertEqual(4, groups[3].persons.length);
  assertEqual(1, groups[4].persons.length);
});
it('should return the correct amount of affirmative questions', () => {
  const groups = getGroups(rawText);
  assertEqual(3, groups[0].afirmativeAnswers);
  assertEqual(0, groups[1].afirmativeAnswers);
  assertEqual(1, groups[2].afirmativeAnswers);
  assertEqual(1, groups[3].afirmativeAnswers);
  assertEqual(1, groups[4].afirmativeAnswers);
});
it('should sum all affirmative questions of the groups', () => {
  const groups = getGroups(rawText);
  const result = sumAffirmativeQuestions(groups);
  assertEqual(6, result);
});

const groups = getGroups(input);
const result = sumAffirmativeQuestions(groups);
// console.log(groups);
console.log('Total sum: ', result);