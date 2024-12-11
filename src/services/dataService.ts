import { getDayStr, getDayStrAsPath, getAudioPreview } from "./function";
import { SongConfig } from "../types/interfaces/song";
import { artists } from "../components/utils/artists";
import { getDatabase, ref, onValue, set } from "firebase/database";
import { db } from "./firebase";
import { banWords } from "../components/utils/constants";
import { of } from "rxjs";

interface Map {
  [key: string]: any;
}

const DEFAULT_SONG = {
  artists:[{name:"Pinguini Tattici Nucleari"}],
  breaks: [1,2,4,8,16,30],
  day:"2024/03/31",
  album: {images: [{url:"https://i.scdn.co/image/ab67616d0000b273df8e97d294e5f3d8ec777f68"}]},
  others: ["Pinguini Tattici Nucleari Fede"],
  showSoundCloud:false,
  showSpotify:true,
  name:"Fede",
  songLength:30,
  preview_url:"https://p.scdn.co/mp3-preview/39ab1a30f963ea53f7d6158cd7e137ce3c1796db?cid=cfafff534b09449592428997e78acf38",
  soundSpotifyLink:"https://open.spotify.com/embed/track/2WYL6etkzaNnQUxvQ7KyYC",
  trackName:"Pinguini Tattici Nucleari Fede"
};

const SONG_DATABASE: Map = {};

const setSong = (day: string, selectedSong: any) => {
  //const database = getDatabase();

  let hardCodedSong = selectedSong;

  set(ref(db, "songs/" + day), hardCodedSong);
};

async function fetchSong(accessToken: string): Promise<any> {

  var finded: boolean = false;
  let song;
  let offset = 0;

  let artist = artists[Math.floor(Math.random() * artists.length)];
  var myHeaders = new Headers();
  myHeaders.append("Authorization", "Bearer " + accessToken);
  myHeaders.append("Content-Type", "application/json");

  do {

    song = await fetch(
      `https://api.spotify.com/v1/search?q=artist:${artist}&type=track&market=IT&limit=40&offset=${offset * 40}`,
      {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",
      }
    )
    .then((response) => response.json())
    .then(
      async (response) => {
        let artistsSongs = response.tracks.items.filter((v: any) => (v.artists[0].name.toLowerCase() === artist))
        if(artistsSongs.length != 0) {
          const selectedSong =
          artistsSongs[Math.floor(Math.random() * artistsSongs.length)];

          // Recupera l'URL di audioPreview usando la funzione getAudioPreview
          const audioPreview = await getAudioPreview(
            selectedSong.id
          );

          // Aggiungi l'audioPreview alla traccia
          selectedSong.preview_url = audioPreview || null;

          return selectedSong;
        }       
      }
    )
    .catch((error) => {
      // reset search
      artist = artists[Math.floor(Math.random() * artists.length)]
      offset = 0
      return undefined;
    });

    if(song && !(new RegExp(banWords.join("|")).test(song.name.toLowerCase())) && song.preview_url !== null) 
      finded = true;
    
    offset++;
  
  } while(!finded)

  return song;
}

export const getDailySong = (
  accessToken: string,
  dayPath: string
): Promise<any> => {

  return new Promise<SongConfig>(async (resolve, reject) => {
    try {
      // Reference to the Firebase song data based on the dayPath
      const songRef = ref(db, "songs/" + dayPath);

      // Listen to the value of the songRef in Firebase
      onValue(
        songRef,
        async (snapshot) => {
          const data = snapshot.val();

          if (data) {
            // If the song data exists in Firebase, resolve with the data
            console.debug("Song found in Firebase:", data);
            resolve(data);
          } else {
            // If no song data is found in Firebase, fetch a new song
            console.debug("Song not found in Firebase, fetching new song...");
            
            // Fetch the song from the API
            const selectedSong = await fetchSong(accessToken);

            // Format and clean the song name
            let songName = selectedSong.name.includes("-")
              ? selectedSong.name.substring(0, selectedSong.name.indexOf("-"))
              : selectedSong.name.includes("(")
              ? selectedSong.name.substring(0, selectedSong.name.indexOf("("))
              : selectedSong.name;

            // Combine artist name and song name
            let trackName = selectedSong.artists[0].name + " " + selectedSong.name;

            // Clean up track name (removes special characters)
            trackName = trackName.replaceAll("å", "a");
            trackName = trackName.replaceAll("_", "");
            trackName = trackName.replaceAll(".", "");
            trackName = trackName.replaceAll("?", "");
            trackName = trackName.replaceAll("!", "");

            // Prepare the hardcoded song data to store in Firebase
            const hardCodedSong = {
              day: dayPath,
              songLength: 30,
              breaks: [1, 2, 4, 8, 16, 30],
              trackName: trackName,
              others: [selectedSong.artists[0].name + " " + songName],
              song: songName,
              artist: selectedSong.artists[0].name,
              soundCloudLink: selectedSong.preview_url,
              showSoundCloud: false,
              showSpotify: true,
              soundSpotifyLink:
                "https://open.spotify.com/embed/track/" + selectedSong.id,
              image: selectedSong.album.images[0].url,
            };

            console.log(hardCodedSong)
            // Store the song data in Firebase
            await setSong(dayPath, hardCodedSong);

            // Resolve the promise with the newly fetched song data
            console.debug("Fetched and stored new song in Firebase:", hardCodedSong);
            resolve(hardCodedSong);
          }
        },
        (err) => {
          console.error("Error accessing Firebase:", err);
          reject(err); // Reject the promise if Firebase fails
        },
        {
          onlyOnce: true, // Only listen once to avoid unnecessary updates
        }
      );
    } catch (error) {
      console.error("Error fetching song:", error);
      reject(error); // Reject the promise in case of any error
    }
  });
};

