const regex = /(^\w{1})|(\s+\w{1})/g;

const Capitalize = (sentence: string) => {
  return sentence.replace(regex, (letter: string) => letter.toUpperCase());
};

export default Capitalize;
