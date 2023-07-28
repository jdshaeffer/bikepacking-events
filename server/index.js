"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const puppeteer_1 = __importDefault(require("puppeteer"));
const cors_1 = __importDefault(require("cors"));
const cheerio = __importStar(require("cheerio"));
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 8000;
app.use((0, cors_1.default)({
    origin: ['http://localhost:3000', 'https://jdshaeffer.github.io'],
}));
app.get('/api/events', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getBikepackingEvents = () => __awaiter(void 0, void 0, void 0, function* () {
        const browser = yield puppeteer_1.default.launch({
            headless: 'new',
        });
        const page = yield browser.newPage();
        yield page.goto('https://bikepacking.com/events');
        const eventsHTML = yield page.evaluate(() => Array.from(document.querySelectorAll('div[id^="post-"]'), (e) => e.innerHTML));
        const events = eventsHTML.map((event) => {
            const $ = cheerio.load(event);
            const dateAndPrice = $('div.event-list-when');
            const [category, location] = $('div.event-list-where')
                .text()
                .split(' / ');
            const titleAndDistance = $('h2').text().split('(');
            const distance = titleAndDistance.pop().slice(0, -1);
            const title = titleAndDistance.length > 1
                ? `${titleAndDistance[0]}(${titleAndDistance[1]}`
                : titleAndDistance[0];
            return {
                title,
                distance,
                eventUrl: $('a').attr('href'),
                date: dateAndPrice.find('span.tribe-event-date-start').text(),
                price: dateAndPrice.find('span:not(.tribe-event-date-start)').text(),
                category,
                location,
                detail: $('p').text(),
            };
        });
        return events;
    });
    console.log('getting events...');
    const events = yield getBikepackingEvents();
    res.json(events);
    console.log('events sent');
}));
app.listen(port, () => {
    console.log(`running server on ${port}`);
});
