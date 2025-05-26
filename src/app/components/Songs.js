import { useAtomValue, useSetAtom} from 'jotai'; // <--- IMPORT useAtomValue
import {
  playlistIdState,
  playlistAtom,       // <--- IMPORT THE DERIVED playlistAtom
  spotifyApiState     // <--- IMPORT spotifyApiState
} from '../../../atoms/playlistAtom';
function Songs() {

    const playlist = useAtomValue(playlistAtom);



  return (
    <div className="text-white px-8 flex flex-col space-y-1 pb-28">
      {playlist?.tracks.items.map((track, i) => (
        <Song key={track.track.id} track={track} order = {i}/>
      ))}
    </div>
  )
}

export default Songs;