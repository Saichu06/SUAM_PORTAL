module.exports = (req, res, next) => {
  // Delay for 1.5 to 3 seconds to simulate API latency
  const delayMs = Math.floor(Math.random() * 1500) + 1500;
  setTimeout(next, delayMs);
};
