export const sleep = (ms = 0) =>
  new Promise(resolve => {
    setTimeout(resolve, 0, ms);
  });
