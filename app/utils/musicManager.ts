import { Directory, File, Paths } from 'expo-file-system';
import { v4 as uuidv4 } from 'uuid';
import { Playlist } from '../(tabs)/profile';

export interface MusicFile {
  id: string;
  name: string;
  music?: any;
  image?: any;
}

export const MusicManager = {

  async listMusicFiles() {
    try {
      const musicDir = new Directory(Paths.document, 'music');
      if (!musicDir.exists) {
        console.log('Music folder does not exist.');
        return;
      }

      const songFolders = musicDir.list();
      const musicFiles: MusicFile[] = [];

      for (const i in songFolders) {
        const folder = songFolders[i];
        if (!folder.exists) continue;

        const folderDir = new Directory(folder.uri);
        const folderContents = folderDir.list();

        const audioFile = folderContents.find(f => f.name === 'audio.mp3');
        const nameFile = folderContents.find(f => f.name === 'musicName.txt');
        const imageFile = folderContents.find(f => f.name === 'cover.jpg');

        let file_name = '';
        let file_music;
        let file_image;
        if (nameFile) {
          try {
            const file = new File(nameFile.uri);
            file_name = (await file.text()).trim()
          } catch (error) {
            console.error(`Error reading name file in folder ${folder.name}:`, error);
          }
        }
        if (audioFile) {
          try {
            file_music = audioFile.uri;
          } catch (error) {
            console.error(`Error reading bytes file in folder ${folder.name}:`, error);
          }
        }
        if (imageFile) {
          try {
            file_image = imageFile.uri;
          }
          catch (error) {
            console.error(`Error reading bytes file in folder ${folder.name}:`, error);
          }
        }

        musicFiles.push({
          id: folderDir.name,
          name: file_name,
          music: file_music,
          image: file_image
        });
      }
      return musicFiles;

    } catch (error) {
      console.error('Error listing music files:', error);
    }
  },

  async deleteMusic(songId: string) {
    try {
      const songDir = new Directory(Paths.document, `music/${songId}`);
      if (songDir.exists) {
        songDir.delete();
        console.log(`✅ Deleted music folder: ${songId}`);
        return true;
      } else {
        console.warn(`⚠️ Folder not found: ${songId}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting music:', error);
      throw error;
    }
  },

  async renameMusic(songId: string, newName: string) {
    try {
      const musicDir = new Directory(Paths.document, 'music');
      if (!musicDir.exists) {
        console.error('Music folder does not exist');
        return null;
      }

      const songFolder = new Directory(musicDir.uri, songId);
      if (!songFolder.exists) {
        console.error(`Song folder ${songId} does not exist`);
        return null;
      }

      const folderContents = songFolder.list();
      const nameFile = folderContents.find(f => f.name === 'musicName.txt');

      if (nameFile && nameFile.exists) {
        const file = new File(nameFile.uri);
        file.open();
        file.write(newName);

        return true;
      } else {
        console.log('musicName.txt not found');
        return null;
      }
    } catch (error) {
      console.error('Error reading song name:', error);
      return null;
    }
  },

  async createPlaylist(name: string) {
    const playlistsDir = new Directory(Paths.document, 'playlists');

    if (!playlistsDir.exists) {
      await playlistsDir.create({ intermediates: true });
    }

    const id = uuidv4();
    const playlistFile = new File(playlistsDir, `${id}.json`);

    const data = {
      id,
      name,
      songIds: []
    };

    await playlistFile.create();
    await playlistFile.write(JSON.stringify(data));

    return id;
  },

  async loadPlaylists() {
    const playlistsDir = new Directory(Paths.document, 'playlists');

    if (!playlistsDir.exists) {
      return [];
    }

    const files = await playlistsDir.list();
    const playlists: any[] = [];

    for (const f of files) {
      if (!f.name || !f.name.endsWith('.json')) continue;

      try {
        const file = new File(playlistsDir, f.name);
        const text = await file.text();
        const parsed = JSON.parse(text);
        playlists.push(parsed);
      } catch (err) {
        console.warn(`Skipping invalid playlist file ${f.name}:`, err);
        continue;
      }
    }

    return playlists;
  },

  async addSongToPlaylist(playlistId: string, songId: string) {
    const playlistsDir = new Directory(Paths.document, 'playlists');
    const playlistFile = new File(playlistsDir, `${playlistId}.json`);

    const json = await playlistFile.text();
    const playlist = JSON.parse(json);

    if (!playlist.songIds.includes(songId)) {
      playlist.songIds.push(songId);
    }
    playlistFile.write(JSON.stringify(playlist));
  },

  async loadSongsFromPlaylist(playlist: Playlist) {
    const musicDir = new Directory(Paths.document, 'music');

    const songs = await Promise.all(
      playlist.songIds.map(async (id) => {
        const songDir = new Directory(musicDir, id);

        const nameFile = new File(songDir, 'musicName.txt');
        const audioFile = new File(songDir, 'audio.mp3');
        const coverFile = new File(songDir, 'cover.jpg');

        const name = nameFile.text();
        return {
          id,
          name: name,
          music: audioFile.uri,
          image: coverFile.exists ? coverFile.uri : null
        };
      })
    );

    return songs;
  },

  async loadPlaylistPreview(playlist: Playlist, limit = 4) {
    const musicDir = new Directory(Paths.document, "music");

    const previewSongs = playlist.songIds.slice(0, limit);

    const songs = await Promise.all(
      previewSongs.map(async (id) => {
        const songDir = new Directory(musicDir, id);

        const nameFile = new File(songDir, "musicName.txt");
        const coverFile = new File(songDir, "cover.jpg");

        let name = "";
        try {
          name = nameFile.exists ? await nameFile.text() : "";
        } catch (e) {
          console.warn(`Failed to read name for song ${id}:`, e);
        }

        return {
          id,
          title: name,
          coverUri: coverFile.exists ? coverFile.uri : null,
        };
      })
    );

    return songs;
  },

  async removeSongFromPlaylist(playlistId: string, songId: string) {
    try {
      const playlistsDir = new Directory(Paths.document, 'playlists');
      const playlistFile = new File(playlistsDir, `${playlistId}.json`);

      const json = await playlistFile.text();
      const playlist = JSON.parse(json);
      playlist.songIds = playlist.songIds.filter((id: string) => id !== songId);

      playlistFile.write(JSON.stringify(playlist));
    } catch (error) {
      console.error('❌ Error removing song from playlist:', error);
      throw error;
    }
  },

  async deletePlaylist(playlistId: string) {
    try {
      const playlistsDir = new Directory(Paths.document, 'playlists');
      const playlistFile = new File(playlistsDir, `${playlistId}.json`);

      if (playlistFile.exists) {
        playlistFile.delete();
        console.log(`✅ Deleted playlist: ${playlistId}`);
        return true;
      } else {
        console.warn(`⚠️ Playlist file not found: ${playlistId}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting playlist:', error);
      throw error;
    }
  },

  async renamePlaylist(playlistId: string, newName: string) {
    try {
      const playlistsDir = new Directory(Paths.document, 'playlists');
      const playlistFile = new File(playlistsDir, `${playlistId}.json`);

      if (!playlistFile.exists) {
        console.warn(`⚠️ Playlist file not found: ${playlistId}`);
        return false;
      }

      // read and parse current playlist JSON
      const json = await playlistFile.text();
      let playlist;
      try {
        playlist = JSON.parse(json);
      } catch (e) {
        console.error(`Invalid JSON in playlist ${playlistId}, aborting rename:`, e);
        return false;
      }

      // update name and write back as JSON
      playlist.name = newName;
      playlistFile.write(JSON.stringify(playlist));

      console.log(`✅ Renamed playlist: ${playlistId}`);
      return true;
    } catch (error) {
      console.error('❌ Error renaming playlist:', error);
      throw error;
    }
  },


};



export default MusicManager;