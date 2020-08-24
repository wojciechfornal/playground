/**
 * Just a quick POC of deep euqality check with circular dependency detection.
 * Author: Wojciech Fornal <wojciech.fornal@gmail.com>
 */
function deepEqual(valA, valB) {

    const objMap = new WeakMap();

    function compare(valA, propPathA, valB, propPathB) {
    
        if (valA === null && valB === null) return true;
    
        if (typeof valA !== 'object' && typeof valB !== 'object') {
            return valA === valB;
        }
    
        if (typeof valA === 'object' && typeof valB === 'object') {

            if (valA === valB) return true;

            if (!Array.isArray(valA)) {
                if (objMap.has(valA) === true) {
                    throw new Error('Circular dependency detected. ' + propPathA);
                } else {
                    objMap.set(valA, true);
                }
            }

            if (!Array.isArray(valB)) {
                if (objMap.has(valB) === true) {
                    throw new Error('Circular dependency detected. ' + propPathB);
                } else {
                    objMap.set(valB, true);
                }
            }
    
            let propsA = Object.keys(valA);
            let propsB = Object.keys(valB);
    
            if (propsA.length !== propsB.length) return false;
    
            let commonProps = new Set();
    
            for (let i = 0; i < propsA.length; i++) {
                commonProps.add(propsA[i]);
                commonProps.add(propsB[i]);
            }
    
            commonProps = commonProps.entries();
    
            for (const prop of commonProps) {

                let key = prop[0];

                if (!(key in valA) || !(key in valB)) {
                    return false;
                } else if (typeof valA[key] !== typeof valB[key]) {
                    return false;
                } else {
                    let deq = compare(valA[key], `${propPathA}.${key}`, valB[key], `${propPathB}.${key}`);
                    if (deq === false) return false;
                }

            }
    
        }
    
        return true;
    
    }

    return compare(valA, '{}', valB, '{}');

}