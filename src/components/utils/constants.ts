import { SongConfig } from "../../types/interfaces/song";

export const HEARDLE_IT_WEB_URL = "https://heardle.it";

export const GAME_RESULT_MESSAGES = [
    "👂 Assoluto! 👏",
    "🥳 Fantastico! 🏆",
    "🚀 Veloce come il vento! 💨",
    "🤩 Sei un mito delle HIT! 🙌",
    "👍 Ce l'abbiamo fatta! 🎉",
    "😅 Per un soffio... domani andrà meglio! 😉"   
];

export const GAME_RESULT_FAILED_MESSAGE = "Non ti preoccupare, chiedi ai tuoi amici, magari loro la sanno!";

export const STRING_COMPARE_LOCALE = "it";

export const SILENT_SONG = "https://w.soundcloud.com/player/?url=" + "https://soundcloud.com/bdsls01/silence-of-the-innocent";

export const icon = ["🥇","🥈","🥉"]

export const errorString = "Oops... qualcosa è andato storto! Controlla le tue impostazioni di connessione e riprova!";

export const versions = [
    {name:"Indie", url: "http://indie.heardle.it/"},  
    {name:"90s", url: "", tag: "Coming Soon", class:"coming-soon"},
    {name:"Amici", url: "", tag: "Coming Soon", class:"coming-soon"},
    {name:"X Factor", url: "", tag: "Coming Soon", class:"coming-soon"}
]

export const EMPTY_SONG_CONFIG: SongConfig = {
    trackName: "",
    breaks: [],
    others: [],
    songLength: 0
  };

export const banWords = [
    "rmx","unplugged", "reprise","remaster", "live", "remix", 
    "mix", "version", "edit", "remastered", "concert", "concerto", 
    "live", "studio", "registrazione", "dal vivo", "strumentale", 
    "session", "sanremo", "karaoke", "vrs", "performance"
];

