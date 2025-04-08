const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

const client = new Client({
  puppeteer: {
    headless: true,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-accelerated-2d-canvas",
      "--no-first-run",
      "--disable-gpu",
      "--no-zygote",
      "--single-process",
    ],
  },
  authStrategy: new LocalAuth({
    clientId: "client-one",
    dataPath: "./whatsapp-session",
  }),
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("authenticated", (session) => {
  console.log("Authenticated successfully");
});
client.on("auth_failure", (msg) => {
  console.error("Authentication failed", msg);
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.initialize();
