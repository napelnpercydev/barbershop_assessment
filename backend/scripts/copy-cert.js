const fs = require("fs");
const path = require("path");

const source = path.join(__dirname, "../src/config/ca.pem");
const destinationDir = path.join(__dirname, "../dist/config");
const destination = path.join(destinationDir, "ca.pem");

fs.mkdirSync(destinationDir, { recursive: true });
fs.copyFileSync(source, destination);

console.log("ca.pem copied successfully.");