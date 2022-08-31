const http = require("http");
const fs = require("fs");
const config = JSON.parse(fs.readFileSync("./config.json"));

let dataRaw = Buffer.from("");
const req = http.request(config["docs-url"], (res) => {
  res.on("data", (d) => {
    dataRaw = Buffer.concat([dataRaw, d]);
  });

  res.on("end", () => {
    fs.writeFileSync("api.json", dataRaw.toString());
  });
});

req.on("error", (error) => {
  console.error(error);
});

req.end(() => {});
