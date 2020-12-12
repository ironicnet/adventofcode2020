var readFileSync = require('fs').readFileSync;


var rawText = readFileSync('./input.txt')
          .toString();
// rawText = `1-3 a: abcde
// 1-3 b: cdefg
// 2-9 c: ccccccccc`
var data = rawText
          .split('\n')
          .map(text => {
            const [ policyText, password ] = text.split(':');
            const [ policyRange, character] = policyText.split(' ');
            const [ positionA, positionB] = policyRange.split('-');

            return {
              policy: {
                positionA,
                positionB,
                character
              },
              password: password.replace(' ', ''),
            }
          });
// var countCharacterInText = (text, targetChar) => {
//   let count = 0;
//   for (let index = 0; index < text.length; index++) {
//     const char = text[index];
//     if (char === targetChar) {
//       count++;
//     }
//   }
//   return count;
// }
var characterPresentXOR = (text, targetChar, positionA, positionB) => {
  var validA = text.length>positionA && text[positionA] === targetChar;
  var validB = text.length>positionB && text[positionB] === targetChar;
  
  let result = false;
  if (validA && validB) {
    result = false;
  }
  else {
    result = validA || validB;
  }
  console.log(text, targetChar, positionA, positionB, result, validA, validB, text[positionA], text[positionB]);
  return result;
}
const valid = data.filter(item => {
  // var count = countCharacterInText(item.password, item.policy.character);
  // return (count >= item.policy.min && count <= item.policy.max);
  return characterPresentXOR(item.password, item.policy.character, item.policy.positionA-1, item.policy.positionB-1);
});

console.log(valid.length);
