// Regex to match first letter of each word in a sentence
const regex = /(^\w{1})|(\s+\w{1})/g;

// Capitalize first letter of each word in a sentence
const Capitalize = (sentence: string) => {
  return sentence.replace(regex, (letter: string) => letter.toUpperCase());
};

export default Capitalize;
