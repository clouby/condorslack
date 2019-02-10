// Buffer Container
const buffs = [];

// Catch all buffs and then build a single buff on stream
exports.streamToBuffer = stream => {
  return new Promise((resolve, reject) => {
    if (stream.readable) {
      stream.on("data", data => data && buffs.push(data));
      stream.on("end", () => {
        resolve(buffs.length > 0 ? Buffer.concat(buffs) : false);
      });
      stream.on("error", reject);
    }
  });
};
