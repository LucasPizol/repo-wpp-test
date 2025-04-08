import path from 'node:path';
import qrcode from 'qrcode-terminal';
import { Client, LocalAuth } from 'whatsapp-web.js';
import { WhatsappMessageCache } from './message-cache';
import { WhatsappMessageFileHandler } from './message-file-handler';
import { WhatsappMessageHandler } from './message-handler';

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

const cache = new WhatsappMessageCache();

const authStrategy = new LocalAuth({
  clientId: 'whatsapp',
  dataPath: path.join(__dirname, '../../../../wwebjs_cache'),
});

export const client = new Client({
  puppeteer: { headless: true, args },
  authStrategy,
});

export class Whatsapp {
  public setupWhatsapp() {
    if (!client) throw new Error('Error initializing WhatsApp client');

    client.on('qr', (qr) => {
      this.log('QRCODE GERADO COM SUCESSO');
      qrcode.generate(qr, { small: true });
    });

    client.on('ready', () => {
      this.log('WHATSAPP CONECTADO COM SUCESSO');
    });

    client.on('authenticated', () => {
      console.log('Authenticated');
    });

    client.on('auth_failure', (msg) => {
      console.error('AUTHENTICATION FAILURE', msg);
    });

    client.on('message', async (msg) => {
      try {
        const hasMedia = msg.hasMedia;
        cache.setMessageCache(msg);

        if (hasMedia) {
          const messageFileHandler = new WhatsappMessageFileHandler();
          await messageFileHandler.handle(msg);

          return;
        }

        const messageHandler = new WhatsappMessageHandler();
        await messageHandler.handle(msg);
      } catch (error) {
        if (error instanceof Error) {
          console.error('[WHATSAPP ERROR]', error.message);
        }
      }
    });

    this.log('INICIANDO CONEXÃO COM O WHATSAPP');
    client.initialize();
  }

  private log(message: string) {
    console.info('====================================');
    console.info(message);
    console.info('====================================');
  }
}

new Whatsapp().setupWhatsapp();
