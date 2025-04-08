"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappMessageHandler = void 0;
class WhatsappMessageHandler {
    constructor() { }
    handle(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msg.from.includes("@c.us") || msg.hasMedia)
                return;
            const quotedMessage = msg.hasQuotedMsg
                ? yield msg.getQuotedMessage()
                : undefined;
            console.log(msg);
        });
    }
}
exports.WhatsappMessageHandler = WhatsappMessageHandler;
