export function isEqual(value: any, otherVal: any): boolean {
  const type = Object.prototype.toString.call(value);

  if (type !== Object.prototype.toString.call(otherVal)) {
    return false;
  }

  if (['[object Array]', '[object Object]'].indexOf(type) < 0) {
    return false;
  }

  const valueLen =
    type === '[object Array]' ? value.length : Object.keys(value).length;
  const otherLen =
    type === '[object Array]' ? otherVal.length : Object.keys(otherVal).length;

  if (valueLen !== otherLen) {
    return false;
  }

  // Compare two items
  const compare = (item1: any, item2: any) => {
    const itemType = Object.prototype.toString.call(item1);

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) {
        return false;
      }
    } else {
      if (itemType !== Object.prototype.toString.call(item2)) {
        return false;
      }
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) {
          return false;
        }
      } else {
        if (item1 !== item2) {
          return false;
        }
      }
    }
  };

  // Compare properties
  if (type === '[object Array]') {
    for (let i = 0; i < valueLen; i++) {
      if (compare(value[i], otherVal[i]) === false) {
        return false;
      }
    }
  } else {
    for (const key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], otherVal[key]) === false) {
          return false;
        }
      }
    }
  }

  // If nothing failed, return true
  return true;
}
