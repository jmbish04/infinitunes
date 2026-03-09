
// Dummy types for removed schema tables
type MyPlaylist = any;
type Favorite = any;
type NewUser = any;

import type { } from "@/lib/db/schema";

type UsersPlaylistsProps = {
  playlists: [];
};

export function UsersPlaylists({ playlists }: UsersPlaylistsProps) {
  return (
    <div>
      <pre>{JSON.stringify(playlists, null, 2)}</pre>
    </div>
  );
}
