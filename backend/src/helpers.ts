export const getValueFromMailHeaders = (headers: string, key: string) => {
  // Get the right value/key line
  const lines = headers.split('\n');
  const value = lines.filter((line: string) => line.split(':')[0].toUpperCase() == key.toUpperCase())[0]

  // If it's not there return null
  if (!value) return null

  // Mkae it into an array
  let valueArray = value.split(":");

  // Remove the fist value
  valueArray.shift();

  // Remove the key name
  return valueArray.join(":").trim();
}
