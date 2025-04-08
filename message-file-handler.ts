import fs from "node:fs";
import type { Message } from "whatsapp-web.js";

export class WhatsappMessageFileHandler {
  constructor() {}

  async handle(msg: Message) {
    if (!msg.from.includes("@c.us") || !msg.hasMedia) return;

    let tmpPath = "";

    try {
      const file = await msg.downloadMedia();

      const quotedMessage = msg.hasQuotedMsg
        ? await msg.getQuotedMessage()
        : undefined;

      const fileName = file.filename || "file";
      tmpPath = `./temp/${fileName}`;

      fs.writeFileSync(tmpPath, file.data, { encoding: "base64" });
      const readFile = fs.readFileSync(tmpPath);

      console.log(msg);
    } catch (error) {
      console.error("Error on receive message", error);
    } finally {
      if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
    }
  }
}
