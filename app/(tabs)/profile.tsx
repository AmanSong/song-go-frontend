import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useSafeAreaInsets, } from 'react-native-safe-area-context';
import NewPlayList from '../components/newPlaylistModal';
import MusicManager from '../utils/musicManager';

type Playlist = {
  id: string;
  name: string;
  songIds: string[];
};

export default function profile() {
  const Insets = useSafeAreaInsets();
  const [openModal, setOpenModal] = useState(false);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const data = await MusicManager.loadPlaylists();
    setPlaylists(data);
  }

  return (
    <View style={{ paddingTop: Insets.top }} className="flex-1 items-center justify-center bg-Dark">

      <View className="justify-center items-between h-24 w-full">
        <View className='flex-row justify-between px-3'>
          <TouchableOpacity onPress={() => setOpenModal(true)} className="justify-center items-center bg-Primary rounded-full w-32 h-12">
            <Text>New PlayList +</Text>
          </TouchableOpacity>


          <TouchableOpacity className="justify-center items-center bg-Primary rounded-full w-12 h-12">
            <MaterialIcons name="person-outline" size={35} />
          </TouchableOpacity>
        </View>
      </View>

      <View className='flex-1 bg-Primary/80 w-full p-3'>
        <View style={{ flex: 1, padding: 16 }}>
          <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 10 }}>
            Playlists
          </Text>

          <FlatList
            data={playlists}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => console.log("Clicked")}>
                <View className='flex-row h-32 w-full bg-white mb-4 rounded-2xl'>
                  <View className='m-2 flex-2 h-28 w-28 bg-red-100 rounded-2xl'>

                  </View>
                  <View className='p-2 flex-1 h-32 w-32 bg-white rounded-2xl'>
                    <Text>{item.name}</Text>
                    <View className='h-16 w-full bg-Primary'>
                      <Text>{item.songIds}</Text>
                    </View>
                  </View>

                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>


      {openModal ?
        <NewPlayList visible={openModal} onClose={() => setOpenModal(!openModal)}
        />
        :
        null
      }
    </View>
  );
}