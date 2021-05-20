
/**
 * find a value in array of objects if true return the index of where the value was found  
 * @param {Array} arr 
 * @param {string} value 
 * @returns index or false
 */
const findValueInObjectArray = (arr = [], value) => {
  let index
  const checkIfExists = arr.find(
    (c, i) => {
      const exist = c !== void 0 
          ? Object.keys(c).find(f => c[f] === value)
          : false
      if(exist) {
        index = i
        return true
      }else {
        return false
      }
    } 
  )
  return checkIfExists ? index : false
}

/**
 * returns and array of object in descending order
 * @param {Array} reactions 
 * @returns array of object in descending order.
 */
const covertReactions = (reactions = []) => {
  const converter = []
  reactions.forEach(
    (r, i) => {
      const index = findValueInObjectArray(converter, r)
      if(index !== false) {
        converter[index] = {
          ...converter[index],
          count: converter[index].count + 1
        }
      }else {
        converter[i] = {
          name: r,
          count: 1
        }
      }
    }
  )
  return converter.sort((a, b) => b.count - a.count )
}

export default covertReactions