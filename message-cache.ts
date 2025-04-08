import type { Message } from 'whatsapp-web.js';

export class WhatsappMessageCache {
  private readonly phoneMessageCache = new Map<string, Date>();
  private readonly SECONDS_RATE_LIMIT = 1.5;

  public setMessageCache(msg: Message) {
    this.clearCache();

    if (this.isSendingFast(this.phoneMessageCache.get(msg.from))) {
      const phone = msg.from.split('@')[0];
      throw new Error(`${phone} is sending too fast`);
    }

    this.phoneMessageCache.set(msg.from, new Date());
  }

  private clearCache() {
    const keys = this.phoneMessageCache.keys();

    for (const key of keys) {
      const lastMessage = this.phoneMessageCache.get(key);

      if (!this.isSendingFast(lastMessage)) this.phoneMessageCache.delete(key);
    }
  }

  private isSendingFast(lastMessage: Date | undefined) {
    if (!lastMessage) return false;

    const now = new Date();

    return (
      now.getTime() - lastMessage.getTime() < this.SECONDS_RATE_LIMIT * 1000
    );
  }
}
