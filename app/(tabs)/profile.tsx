import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets, } from 'react-native-safe-area-context';
import NewPlayList from '../components/newPlaylistModal';
import MusicManager from '../utils/musicManager';
import { useRouter } from 'expo-router';
import { MusicFile } from '../(tabs)';

export type Playlist = {
  id: string;
  name: string;
  songIds: string[];
};

export default function profile() {
  const Insets = useSafeAreaInsets();
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [playlists, setPlaylists] = useState<Array<Playlist & { preview: any[] }>>([]);
  const [openMenuId, setOpenMenuId] = useState(null as string | null);

  useFocusEffect(
    useCallback(() => {
      load();
      return () => {
      };
    }, [])
  );

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const loadedPlaylists = await MusicManager.loadPlaylists();
    // Attach previews to each playlist
    const enhanced = await Promise.all(
      loadedPlaylists.map(async (pl) => {
        const preview = await MusicManager.loadPlaylistPreview(pl, 4);
        return {
          ...pl,
          preview,
        };
      })
    );

    setPlaylists(enhanced);
  }

  async function playlistSelected(playlist: Playlist) {
    try {
      // Await the promise to get the actual music array
      const songs = await MusicManager.loadSongsFromPlaylist(playlist);

      // Resolve all name promises
      const resolvedSongs = await Promise.all(
        songs.map(async (song) => ({
          ...song,
          name: await song.name, // Await the Promise<string>
        }))
      );
      const startIndex = resolvedSongs.length > 0 ? 0 : -1;

      if (resolvedSongs.length === 0) {
        return;
      }

      router.push({
        pathname: "/player",
        params: {
          index: startIndex.toString(),
          list: JSON.stringify(resolvedSongs),
          playlistTitle: playlist.name,
        },
      });

    } catch (error) {
      console.error("Error loading playlist:", error);
    }
  }

  return (
    <View style={{ paddingTop: Insets.top }} className="flex-1 items-center justify-center bg-Dark">

      <View className="justify-center items-between h-24 w-full px-2">
        <View className='flex-row justify-between px-3'>
          <TouchableOpacity onPress={() => setOpenModal(true)} className="justify-center items-center bg-Primary rounded-full w-32 h-12">
            <Text>New PlayList +</Text>
          </TouchableOpacity>

          <TouchableOpacity className="justify-center items-center bg-Primary rounded-full w-12 h-12">
            <MaterialIcons name="person-outline" size={35} />
          </TouchableOpacity>
        </View>
      </View>

      <View className="flex-1 w-full bg-Primary/80 pt-4">
        <View className="px-6 pb-4">
          <Text className="text-2xl font-bold text-white mb-2">
            Playlists
          </Text>
        </View>

        <FlatList
          data={playlists}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-4"
          renderItem={({ item }) => {
            const extraCount = item.songIds.length - item.preview.length;
            const isMenuOpen = openMenuId === item.id;


            return (
              <TouchableOpacity
                onPress={() => playlistSelected(item)}
                style={{ zIndex: isMenuOpen ? 999 : 0 }}
                className="bg-Dark/90 mb-3 p-4 rounded-2xl shadow-lg shadow-black/50">

                <View className="flex-row items-center space-x-4">
                  {/* Preview Thumbnails - Improved Grid */}
                  <View className="w-24 h-24 bg-Primary/30 rounded-xl overflow-hidden">
                    <View className="flex-1 flex-row flex-wrap">
                      {item.preview.slice(0, 4).map((song, index) => (
                        <View
                          key={song.id}
                          className={`${index % 2 === 0 ? 'pr-0.5' : 'pl-0.5'} ${index < 2 ? 'pb-0.5' : 'pt-0.5'} w-1/2 h-1/2`}
                        >
                          <Image
                            source={{ uri: song.coverUri }}
                            className="w-full h-full"
                            resizeMode="cover"
                          />
                        </View>
                      ))}

                      {/* Show extra count badge if needed */}
                      {extraCount > 0 && (
                        <View className="absolute inset-0 bg-black/60 justify-center items-center">
                          <Text className="text-white font-semibold text-sm">
                            +{extraCount}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Playlist Info */}
                  <View className="flex-1 ml-4">
                    <Text className="text-white text-lg font-semibold mb-1" numberOfLines={1}>
                      {item.name}
                    </Text>
                    <Text className="text-gray-400 text-sm">
                      {item.songIds.length} songs
                    </Text>
                  </View>

                  {/* Menu Button */}
                  <View className="relative" style={{ zIndex: isMenuOpen ? 1000 : 1 }}>
                    <TouchableOpacity
                      onPress={() => setOpenMenuId(isMenuOpen ? null : item.id)}
                      className="w-10 h-10 justify-center items-center rounded-full active:bg-white/10"
                    >
                      <MaterialIcons name="more-vert" color={"white"} size={24} />
                    </TouchableOpacity>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                      <View className="absolute top-12 right-0 bg-Secondary border border-Primary/50 rounded-xl shadow-2xl shadow-black z-10 min-w-32">
                        <TouchableOpacity
                          onPress={() => { console.log("Rename"); }}
                          className="px-4 py-3 border-b border-white/10 active:bg-white/5"

                        >
                          <Text className="text-white text-base">Rename</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => { MusicManager.deletePlaylist(item.id); load(); }}
                          className="px-4 py-3 active:bg-red-500/20"
                        >
                          <Text className="text-red-400 text-base">Delete</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>

              </TouchableOpacity>
            );
          }}
        />
      </View>


      {
        openModal ?
          <NewPlayList visible={openModal} onClose={() => { setOpenModal(!openModal); load(); }}
          />
          :
          null
      }
    </View >
  );
}