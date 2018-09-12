module.exports = duration => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, duration);
  });
};
