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
exports.Whatsapp = exports.client = void 0;
const node_path_1 = __importDefault(require("node:path"));
const qrcode_terminal_1 = __importDefault(require("qrcode-terminal"));
const whatsapp_web_js_1 = require("whatsapp-web.js");
const message_cache_1 = require("./message-cache");
const message_file_handler_1 = require("./message-file-handler");
const message_handler_1 = require("./message-handler");
const args = [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-accelerated-2d-canvas',
    '--no-first-run',
    '--disable-gpu',
    '--no-zygote',
    '--single-process',
];
const cache = new message_cache_1.WhatsappMessageCache();
const authStrategy = new whatsapp_web_js_1.LocalAuth({
    clientId: 'whatsapp',
    dataPath: node_path_1.default.join(__dirname, '../../../../wwebjs_cache'),
});
exports.client = new whatsapp_web_js_1.Client({
    puppeteer: { headless: true, args },
    authStrategy,
});
class Whatsapp {
    setupWhatsapp() {
        if (!exports.client)
            throw new Error('Error initializing WhatsApp client');
        exports.client.on('qr', (qr) => {
            this.log('QRCODE GERADO COM SUCESSO');
            qrcode_terminal_1.default.generate(qr, { small: true });
        });
        exports.client.on('ready', () => {
            this.log('WHATSAPP CONECTADO COM SUCESSO');
        });
        exports.client.on('authenticated', () => {
            console.log('Authenticated');
        });
        exports.client.on('auth_failure', (msg) => {
            console.error('AUTHENTICATION FAILURE', msg);
        });
        exports.client.on('message', (msg) => __awaiter(this, void 0, void 0, function* () {
            try {
                const hasMedia = msg.hasMedia;
                cache.setMessageCache(msg);
                if (hasMedia) {
                    const messageFileHandler = new message_file_handler_1.WhatsappMessageFileHandler();
                    yield messageFileHandler.handle(msg);
                    return;
                }
                const messageHandler = new message_handler_1.WhatsappMessageHandler();
                yield messageHandler.handle(msg);
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error('[WHATSAPP ERROR]', error.message);
                }
            }
        }));
        this.log('INICIANDO CONEXÃO COM O WHATSAPP');
        exports.client.initialize();
    }
    log(message) {
        console.info('====================================');
        console.info(message);
        console.info('====================================');
    }
}
exports.Whatsapp = Whatsapp;
new Whatsapp().setupWhatsapp();
