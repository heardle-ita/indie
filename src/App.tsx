import { useEffect, useState } from "react";
import LoadingSpinner from "./components/LoadingSpinner";
import { GameContextProvider } from "./components/player/GameContext";
import PlayerContainer from "./components/player/PlayerContainer";
import { EMPTY_SONG_CONFIG } from "./components/utils/constants";
import { getDailySong } from "./services/dataService";
import { fetchServerDate } from "./services/function";
import { getAccessToken } from "./services/spotifyService";
import { SongConfig } from "./types/interfaces/song";


const APP_VERSION = process.env.REACT_APP_VERSION || "0";
console.debug("v" + APP_VERSION);

const currentVersion = localStorage.getItem("version");
if (currentVersion !== APP_VERSION) {
  console.log(`version upgrated from ${currentVersion} to ${APP_VERSION}`);
  localStorage.setItem("version", APP_VERSION);
}

function App() {
  const [loading, setLoading] = useState(true);
  const [currentSongConfig, setCurrentSongConfig] = useState<SongConfig>(EMPTY_SONG_CONFIG);
  const [accessToken, setAccessToken] = useState("");
  const [serverDate, setServerDate] = useState("");

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      //while (isMounted) {
        try {
          const [date, token] = await Promise.all([fetchServerDate(), getAccessToken()]);
          setServerDate(date);
          setAccessToken(token);

          const songConfig = await getDailySong(token, date);
          setCurrentSongConfig(songConfig);
        } catch (error) {
          console.error("Initialization failed:", error);
        } finally {
          setLoading(false);
        }
      //}
    };
    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
    {loading ? (
      <LoadingSpinner></LoadingSpinner>
      ) :(
        <GameContextProvider date={serverDate}>
          <PlayerContainer
            songConfig={currentSongConfig}
            accessToken={accessToken}
            date={serverDate}
          />
        </GameContextProvider>
      )
 
    }
    </>
  );
}

export default App;
