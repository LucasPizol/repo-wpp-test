import type { Message } from "whatsapp-web.js";

export class WhatsappMessageHandler {
  constructor() {}

  async handle(msg: Message) {
    if (!msg.from.includes("@c.us") || msg.hasMedia) return;

    const quotedMessage = msg.hasQuotedMsg
      ? await msg.getQuotedMessage()
      : undefined;

    console.log(msg);
  }
}
