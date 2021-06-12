"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.firebase = exports.timestamp = exports.db = void 0;
const firebase_1 = __importDefault(require("firebase"));
exports.firebase = firebase_1.default;
const firebaseConfig = {
    apiKey: "AIzaSyC3BDrPfe3kBdYu022ndvpd-4MyLz6ZGiE",
    authDomain: "suggest-bot-bryl.firebaseapp.com",
    projectId: "suggest-bot-bryl",
    storageBucket: "suggest-bot-bryl.appspot.com",
    messagingSenderId: "236852596043",
    appId: "1:236852596043:web:d3c687e901f37578e9ecce",
    measurementId: "G-4VW1R50R8B",
};
if (!firebase_1.default.apps.length) {
    firebase_1.default.initializeApp(firebaseConfig);
}
else {
    firebase_1.default.app();
}
const db = firebase_1.default.firestore();
exports.db = db;
const timestamp = firebase_1.default.firestore.FieldValue.serverTimestamp;
exports.timestamp = timestamp;
//# sourceMappingURL=firebase.js.map