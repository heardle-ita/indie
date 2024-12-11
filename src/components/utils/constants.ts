import { SongConfig } from "../../types/interfaces/song";

export const HEARDLE_IT_WEB_URL = "https://heardle.it";

export const GAME_VARIANT = "indie/";

export const GAME_RESULT_MESSAGES = [
    "Ammazza che pischellettə indie",
    "Chapeau.",
    "Eeeeeasy",
    "Ti sei meritatə una birra",
    "Onesto.",
    "Pe' poco, menomale"
];

export const GAME_RESULT_FAILED_MESSAGE = "Nt'e preoccupa, chiedi ai soci, magari la sanno";

export const STRING_COMPARE_LOCALE = "it";

export const SILENT_SONG = "https://w.soundcloud.com/player/?url=" + "https://soundcloud.com/bdsls01/silence-of-the-innocent";

export const icon = ["🥇","🥈","🥉"]

export const errorString = "Oops... qualcosa è andato storto! Controlla le tue impostazioni di connessione e riprova!";

export const versions = [
    {name:"", url: "http://heardle.it/", tag: ""}, ,  
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

