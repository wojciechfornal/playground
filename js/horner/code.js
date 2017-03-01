/**
 * @author Wojciech Fornal <wojciechfornal.com>
 */

/**
 * Base-dependent decimal evaluation of a given number using Horner's scheme.
 * Applies to the whole part.
 * Uses Array.prototype.forEach internally.
 */
function HornerForEach (polycoeffs, base) {
  
  var _val = 0,
      _valsMap = {'0': 0,'1': 1,'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'A': 10,'B': 11,'C': 12,'D': 13,'E': 14,'F': 15};
  
  polycoeffs.split('').forEach(function (coeff, i) {
    _val = _valsMap[coeff] + _val * base;
  });
  
  return _val;
  
}

/**
 * Base-dependent decimal evaluation of a given number using Horner's scheme.
 * Applies to the whole part.
 * Uses Array.prototype.reduce internally.
 */
function HornerReduce (polycoeffs, base) {
  
  var _valsMap = {'0': 0,'1': 1,'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'A': 10,'B': 11,'C': 12,'D': 13,'E': 14,'F': 15};
  
  return polycoeffs.split('').reduce(function (pVal, cVal, i, a) {
    return(_valsMap[cVal] + pVal * base);
  });
  
}

/**
 * Base-dependent decimal evaluation of a given number using Horner's scheme.
 * Applies to the decimal part.
 * Uses Array.prototype.forEach internally.
 */
function HornerDecimalForEach (polycoeffs, base) {
  
  var _val = 0,
      _valsMap = {'0': 0,'1': 1,'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'A': 10,'B': 11,'C': 12,'D': 13,'E': 14,'F': 15};
  
  polycoeffs.split('').reverse().forEach(function (coeff, i) {
    _val = (_valsMap[coeff] + _val) / base;
  });
  
  return _val;
  
}

/**
 *
 * @param  {Number} number Number to evaluate (with or without single decimal point)
 * @param  {Number} base   Base of the number
 * @return {Number} The decinal value of the input number
 *
 * Calls HornerForEach to calculate value of the whole part.
 * Calls HornerDecimalForEach to calculate value of the decimal part.
 *
 */
function Horner (number, base) {
  
  var _numberData,
      _decimalPart,
      _wholePart,
      _val;
  
  _numberData = String(number).match(/([0-9A-F]+)\.?([0-9A-F]*)/);
  
  if (_numberData) {
    _wholePart = HornerForEach(_numberData[1], base);
    _decimalPart = HornerDecimalForEach(_numberData[2], base);
  }
  
  _val = _wholePart + _decimalPart;
  
  return Number(_val.toFixed(3));
  
}

/**
 * Base-dependent decimal evaluation of a given number using Horner's scheme.
 * Single pass. No need to evaluate whole part and decimal part separately.
 *
 * @param  {Number} number Number to evaluate (with or without single decimal point)
 * @param  {Number} base   Base of the number
 * @return {Number} The decinal value of the input number
 */
function HornerSinglePass (number, base) {
  
  var _numberData,
      _l,
      _m,
      _polycoeffs,
      _val,
      _valsMap;
  
  _val = 0;
  _valsMap = {'0': 0,'1': 1,'2': 2,'3': 3,'4': 4,'5': 5,'6': 6,'7': 7,'8': 8,'9': 9,'A': 10,'B': 11,'C': 12,'D': 13,'E': 14,'F': 15};  
  _numberData = String(number).match(/([0-9A-F]+)\.?([0-9A-F]*)/);
  
  if (_numberData) {
    _polycoeffs = _numberData[1] + _numberData[2];
    _l = _polycoeffs.length;
    _m = _numberData[2].length;    
    _polycoeffs.split('').forEach(function (coeff, i) {
      _val = _valsMap[coeff] + _val * base;
      if (i === _l - 1) _val = _val * Math.pow(base, -_m);
    });    
  }
  
  return Number(_val.toFixed(3));
  
}

console.assert(Horner('2A6.AD0E5604189374BC6A7F', 16) === 678.676, "Horner('2A6.AD0E5604189374BC6A7F', 16) should equal 678.676");
console.assert(Horner('1010100110.10101101000011100101', 2) === 678.676, "Horner('1010100110.10101101000011100101', 2) should equal 678.676");

console.assert(HornerForEach('100110', 2) === 38, "HornerForEach('100110', 2) should equal 38");
console.assert(HornerForEach('742031', 8) === 246809, "HornerForEach('742031', 8) should equal 246809");
console.assert(HornerForEach('123456', 10) === 123456, "HornerForEach('123456', 10) should equal 123456");
console.assert(HornerForEach('18DE0E', 16) === 1629710, "HornerForEach('18DE0E', 16) should equal 1629710");

console.assert(HornerReduce('100110', 2) === 38, "HornerForEach('100110', 2) should equal 38");
console.assert(HornerReduce('742031', 8) === 246809, "HornerForEach('742031', 8) should equal 246809");
console.assert(HornerReduce('123456', 10) === 123456, "HornerForEach('123456', 10) should equal 123456");
console.assert(HornerReduce('18DE0E', 16) === 1629710, "HornerForEach('18DE0E', 16) should equal 1629710");

console.assert(Horner(237.745, 8) === 159.947, 'Horner(237.745, 8) should equal 159.947265625');
console.assert(Horner(237, 8) === 159, 'Horner(237, 8) should equal 159');
console.assert(Horner(0.745, 8) === 0.947, 'Horner(.745, 8) should equal 0.947265625');
console.assert(Horner(0, 8) === 0, 'Horner(0, 8) should equal 0');
console.assert(Horner(0.0, 8) === 0, 'Horner(0.0, 8) should equal 0');

console.assert(HornerSinglePass(742031, 8) === 246809, 'HornerSinglePass(742031, 8) should equal 246809');
console.assert(HornerSinglePass(237.745, 8) === 159.947, 'HornerSinglePass(237.745, 8) should equal 159.947265625');
console.assert(HornerSinglePass(237, 8) === 159, 'HornerSinglePass(237, 8) should equal 159');
console.assert(HornerSinglePass(0.745, 8) === 0.947, 'HornerSinglePass(.745, 8) should equal 0.947265625');
console.assert(HornerSinglePass(0, 8) === 0, 'HornerSinglePass(0, 8) should equal 0');
console.assert(HornerSinglePass(0.0, 8) === 0, 'HornerSinglePass(0.0, 8) should equal 0');