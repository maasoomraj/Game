export const codeGenerator = () => {
  let str = "";
  for (let i = 0; i < 6; i++) {
    const random = Math.floor(Math.random() * 62);
    if (random <= 9) {
      str += String.fromCharCode(random + 48);
    } else if (random <= 35) {
      str += String.fromCharCode(random + 55);
    } else if (random <= 61) {
      str += String.fromCharCode(random + 61);
    }
  }

  return str;
};
