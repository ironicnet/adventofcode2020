const { readFileSync } = require('fs');
const { it, assertEqual, assertAllEqual } = require('../helpers/test.js');


var rawText = readFileSync('./input.txt').toString();

const inRange = (text, min, max) => {
	const year = parseInt(text, 10);
	return min <= year && year <= max;
};
const inList = (list) => (value) => list.includes(value);
const yearValidator = ({ min, max }) => (value) => {
	if (value.length !== 4) return false;
  return inRange(value, min, max);
};
const heightValidator = () => (value) => {
	if (value.endsWith('cm')) {
		return inRange(value.substr(0, value.length - 2), 150, 193);
	} else if (value.endsWith('in')) {
		return inRange(value.substr(0, value.length - 2), 59, 76);
	} else {
		return false;
	}
};
const HEXColorValidator = () => (value) => {
	return /^\#([a-f0-9]{6})$/.test(value);
};
const PIDValidator = () => (value) => {
	return /^([0-9]{9})$/.test(value);
};

var debugText = `eyr:1972 cid:100
hcl:#18171d ecl:amb hgt:170 pid:186cm iyr:2018 byr:1926

iyr:2019
hcl:#602927 eyr:1967 hgt:170cm
ecl:grn pid:012533040 byr:1946

hcl:dab227 iyr:2012
ecl:brn hgt:182cm pid:021572410 eyr:2020 byr:1992 cid:277

hgt:59cm ecl:zzz
eyr:2038 hcl:74454a iyr:2023
pid:3556412378 byr:2007

pid:087499704 hgt:74in ecl:grn iyr:2012 eyr:2030 byr:1980
hcl:#623a2f

eyr:2029 ecl:blu cid:129 byr:1989
iyr:2014 pid:896056539 hcl:#a97842 hgt:165cm

hcl:#888785
hgt:164cm byr:2001 iyr:2015 cid:88
pid:545766238 ecl:hzl
eyr:2022

iyr:2010 hgt:158cm hcl:#b6652a ecl:blu byr:1944 eyr:2021 pid:093154719`;

const expectedData = {
	passportCount: 8,
	validation: [false, false, false, false, true, true, true, true],
};

const fields = [
	{
		key: 'byr',
		required: true,
		validator: yearValidator({ min: 1920, max: 2002 }),
	},
	{
		key: 'iyr',
		required: true,
		validator: yearValidator({ min: 2010, max: 2020 }),
	},
	{
		key: 'eyr',
		required: true,
		validator: yearValidator({ min: 2020, max: 2030 }),
	},
	{ key: 'hgt', required: true, validator: heightValidator() },
	{ key: 'hcl', required: true, validator: HEXColorValidator() },
	{
		key: 'ecl',
		required: true,
		validator: inList(['amb', 'blu', 'brn', 'gry', 'grn', 'hzl', 'oth']),
	},
	{ key: 'pid', required: true, validator: PIDValidator() },
	{ key: 'cid', required: false, validator: () => true },
];
const getField = key => fields.find(f => f.key === key);

const validate = (text) => {
	return text
		.split('\n\n')
		.map((passport) => {
			return passport.replace(/ /g, '\n').split('\n');
		})
		.map((lines) => {
			var tuples = lines.map((line) => {
				const [key, value] = line.split(':');
				return { key, value };
			});
			const results = fields
				.filter((f) => f.required)
				.map((field) => {
          var matching = tuples
          .filter((t) => t.key === field.key);
          
          return ({
					valid: matching.length > 0 && matching.every((t) => field.validator(t.value)),
					field,
        })
      });
			return {
        valid: results.every((result) => result.valid),
        results,
			};
		});
};

var debugPassports = validate(debugText);
it('passport count', () => assertEqual(expectedData.passportCount, debugPassports.length));
it('passport validations', () => assertAllEqual(expectedData.validation, debugPassports.map(p => p.valid)) );
it('passes valid byr', () => assertEqual(true, getField('byr').validator('2002')));
it('passes valid byr', () => assertEqual(true, getField('byr').validator('2002')));
it('rejects invalid byr', () => assertEqual(false, getField('byr').validator('2003')));
it('passes valid hgt', () => assertEqual(true, getField('hgt').validator('60in')));
it('passes valid hgt', () => assertEqual(true, getField('hgt').validator('190cm')));
it('rejects invalid hgt', () => assertEqual(false, getField('hgt').validator('190in')));
it('rejects invalid hgt', () => assertEqual(false, getField('hgt').validator('190')));
it('passes valid hcl', () => assertEqual(true, getField('hcl').validator('#123abc')));
it('rejects invalid hcl', () => assertEqual(false, getField('hcl').validator('#123abz')));
it('rejects invalid hcl', () => assertEqual(false, getField('hcl').validator('123abc')));
it('passes valid ecl', () => assertEqual(true, getField('ecl').validator('brn')));
it('rejects invalid ecl', () => assertEqual(false, getField('ecl').validator('wat')));
it('passes valid pid', () => assertEqual(true, getField('pid').validator('000000001')));
it('rejects invalid pid', () => assertEqual(false, getField('pid').validator('0123456789')));

const result = validate(rawText);
console.log(`Result: ${result.filter(r=> r.valid).length}/${result.length}`);
