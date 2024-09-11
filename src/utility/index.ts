// Check if the given string is a valid JSON string
module.exports.isJsonString = (str: string): boolean => {  
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}