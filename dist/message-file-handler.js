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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsappMessageFileHandler = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
class WhatsappMessageFileHandler {
    constructor() { }
    handle(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!msg.from.includes("@c.us") || !msg.hasMedia)
                return;
            let tmpPath = "";
            try {
                const file = yield msg.downloadMedia();
                const quotedMessage = msg.hasQuotedMsg
                    ? yield msg.getQuotedMessage()
                    : undefined;
                const fileName = file.filename || "file";
                tmpPath = `./temp/${fileName}`;
                node_fs_1.default.writeFileSync(tmpPath, file.data, { encoding: "base64" });
                const readFile = node_fs_1.default.readFileSync(tmpPath);
                console.log(msg);
            }
            catch (error) {
                console.error("Error on receive message", error);
            }
            finally {
                if (node_fs_1.default.existsSync(tmpPath))
                    node_fs_1.default.unlinkSync(tmpPath);
            }
        });
    }
}
exports.WhatsappMessageFileHandler = WhatsappMessageFileHandler;
