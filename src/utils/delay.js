function delay(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

export default delay;
