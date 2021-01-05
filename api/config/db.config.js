const dev = process.env.dev === '1';
let toExport = {};
if (dev) {
  toExport = {
    HOST: "127.0.0.1",
    USER: "root",
    PASSWORD: "root",
    DB: "meduse"
  };
} else {
  toExport = {
    HOST: "localhost",
    USER: "meduseuser",
    PASSWORD: "053817@Zerty053817",
    DB: "meduse"
  };
}

module.exports = toExport;