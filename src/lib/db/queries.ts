import { Favorite } from "./schema";

export const getUserPlaylists = async (userId: string) => [];
export const getUserFavorites = async (userId?: string, type?: any): Promise<Favorite | undefined> => undefined;
export const addSongsToPlaylist = async (playlistId: string, songs: any) => {};
export const addToFavorites = async (userId: string, type: any, item: any) => {};
export const removeFromFavorites = async (userId: string, type: any, item: any) => {};
