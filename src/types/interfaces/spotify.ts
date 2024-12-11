import { artist } from "./artist";

export interface SpotifyResult {
    duration_ms: number
    artists: artist[]
    name: string
}
  