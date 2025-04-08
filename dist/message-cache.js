"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappMessageCache = void 0;
class WhatsappMessageCache {
    constructor() {
        this.phoneMessageCache = new Map();
        this.SECONDS_RATE_LIMIT = 1.5;
    }
    setMessageCache(msg) {
        this.clearCache();
        if (this.isSendingFast(this.phoneMessageCache.get(msg.from))) {
            const phone = msg.from.split('@')[0];
            throw new Error(`${phone} is sending too fast`);
        }
        this.phoneMessageCache.set(msg.from, new Date());
    }
    clearCache() {
        const keys = this.phoneMessageCache.keys();
        for (const key of keys) {
            const lastMessage = this.phoneMessageCache.get(key);
            if (!this.isSendingFast(lastMessage))
                this.phoneMessageCache.delete(key);
        }
    }
    isSendingFast(lastMessage) {
        if (!lastMessage)
            return false;
        const now = new Date();
        return (now.getTime() - lastMessage.getTime() < this.SECONDS_RATE_LIMIT * 1000);
    }
}
exports.WhatsappMessageCache = WhatsappMessageCache;
