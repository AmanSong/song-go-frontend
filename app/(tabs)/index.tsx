import { FlatList, Text, View, TouchableOpacity, Image, Alert, TextInput } from "react-native";
import { useEffect, useState, useCallback, useMemo, use } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MusicManager } from "../utils/musicManager"
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import EditText from "../components/modals/editTextModal";
import ListPlaylistModal from "../components/modals/listPlaylistsModal";
import { MusicFile } from "../utils/musicManager";
import { useKeepAwake } from 'expo-keep-awake';

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [music, setMusic] = useState<MusicFile[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false)
  const [openPlaylist, setOpenPlaylist] = useState(false);
  const [searchQuery, setSearchQuery] = useState("")
  const [multiSelect, setMultiSelect] = useState(false);
  const [selectedMusic, setSelectedMusic] = useState<MusicFile[]>([]);

  useKeepAwake();

  useFocusEffect(
    useCallback(() => {
      listMusicFiles();
      return () => {
      };
    }, [])
  );

  function playAllMusic() {
    if(music.length === 0) return;
    router.push({
      pathname: "/player",
      params: {
        index: 0,
        list: JSON.stringify(music),
      },
    });
  }

  function playSingleMusic(item: MusicFile) {
    router.push({
      pathname: "/player",
      params: {
        index: 0,
        list: JSON.stringify([item]),
      },
    });
  }

  function handlePresses(songID: string, type: string) {
    if (type === "delete") {
      const showConfirmationAlert = () => {
        Alert.alert(
          "Are you sure?",
          "This action cannot be undone.",
          [
            {
              text: "Cancel",
              style: "cancel"
            },
            {
              text: "OK",
              onPress: () => {
                MusicManager.deleteMusic(songID);
                listMusicFiles();
              },
              style: "destructive"
            }
          ]
        );

      };
      showConfirmationAlert();
    }

    if (type === "edit") {
      setEditing(true);
    }
  }

  const handleClose = () => {
    setEditing(false);
    setOpenPlaylist(false);
    listMusicFiles();
  }

  // get music from local storage
  async function listMusicFiles() {
    try {
      // Update state with all the music files
      try {
        const files = await MusicManager.listMusicFiles();
        setMusic(files || []);
      } catch (error) {
        console.error('Error listing music files:', error);
        setMusic([]);
      };
    } catch (error) {
      console.error('Error listing music files:', error);
      setMusic([]);
    }
  }

  useEffect(() => {
    listMusicFiles();
  }, []);

  const filteredData = useMemo(() => {
    const q = (searchQuery || '').trim().toLowerCase();
    if (!q) return music;
    return music.filter(item => (item.name || '').toLowerCase().includes(q));
  }, [searchQuery, music]);

  const handleMultiSelect = (music: MusicFile) => {
    setSelectedMusic(prev => {
      // Check if music is already selected
      const isAlreadySelected = prev.some(item => item.id === music.id);

      if (isAlreadySelected) {
        // Remove it if already selected
        return prev.filter(item => item.id !== music.id);
      } else {
        // Add it if not selected
        return [...prev, music];
      }
    });
  };

  function multiSelectClose() {
    setSelectedMusic([]);
    setMultiSelect(false);
  }

  function handleMultiDelete() {
    const showConfirmationAlert = () => {
      Alert.alert(
        `Are you sure you want to delete ${selectedMusic.length} songs?`,
        "This action cannot be undone.",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "OK",
            onPress: () => {
              selectedMusic.forEach((music, index) => {
                console.log(`Music ${index + 1}:`, music.name);
                MusicManager.deleteMusic(music.id);
              });

              multiSelectClose();
              listMusicFiles();
            },
            style: "destructive"
          }
        ]
      );

    };
    showConfirmationAlert();
  }

  return (
    <View className="flex-1" style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#1E1E1E' }}>

      <View className="flex-row justify-between items-center h-16 bg-white/5 mx-5 my-4 rounded-3xl border border-white/10 backdrop-blur-xl">
        <TouchableOpacity
          onPress={() => playAllMusic()}
          className="h-12 w-12 rounded-full justify-center items-center ml-5 bg-Primary/40"
          activeOpacity={0.8}
        >
          <MaterialIcons name="play-arrow" color={"white"} size={36} />
        </TouchableOpacity>

        <View className="flex-1 ml-4 mr-1">
          <View className="bg-black/20 rounded-full">
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Find your music"
              placeholderTextColor="#BBBBBB"
              className="text-white px-4 py-3.5 text-base font-medium"
              selectionColor="#FF6B6B"
            />
          </View>
        </View>

        <View className="mr-2">
          <MaterialIcons name="search" size={26} color="#BBBBBB" />
        </View>
      </View>

      {/* Amount of songs or amount of hold selected show here */}
      <View className="ml-2 p-2 flex-row items-center justify-between">
        {
          multiSelect ?
            <>
              <Text className="text-white">Selected {selectedMusic.length}</Text>
              <View className="flex-row items-center justify-center">
                <MaterialIcons onPress={() => multiSelectClose()} name="cancel" color={"#DA7676"} size={30} />
                <MaterialIcons onPress={() => handleMultiDelete()} name="delete-forever" color={"crimson"} size={30} />
              </View>
            </>
            :
            <Text className="text-white">{music.length} Songs</Text>
        }
      </View>

      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={filteredData}
        keyExtractor={(item) => item.id} 
        renderItem={({ item }: { item: MusicFile }) => (

          <View
            className={`p-4 border-b border-gray-700 ${expandedId === item.id ? "bg-white/10" : null} ${multiSelect && selectedMusic.some(music => music.id === item.id)
              ? 'bg-Primary/30'
              : ''
              }`}
          >

            <View className="w-full pt-2">
              <TouchableOpacity className="flex-row items-start"
                onPress={() => {
                  multiSelect ?
                    handleMultiSelect(item) :
                    setExpandedId(prevId => prevId === item.id ? null : item.id)
                }

                }

                onLongPress={() => {
                  { setMultiSelect(true) };
                  { handleMultiSelect(item) };
                }
                }
              >
                <Image
                  source={
                    item.image
                      ? { uri: item.image }
                      : require("../../assets/images/Song_Go.jpg")
                  }
                  className="w-32 h-24 rounded-lg mr-4"
                />

                <View className="flex-1">
                  <Text className="text-white text-base" numberOfLines={4}>
                    {item.name}

                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {expandedId === item.id && (
              <View className="flex-row items-start justify-between px-2 mt-4">
                {/* Play music */}
                <TouchableOpacity className="justify-center items-center bg-Primary/20 h-12 w-12 rounded-full"
                  onPress={() => playSingleMusic(item)}>
                  <MaterialIcons name="play-arrow" color={"#DA7676"} size={35} />
                </TouchableOpacity>

                {/* Edit Name */}
                <TouchableOpacity className="justify-center items-center bg-Primary/20 h-12 w-12 rounded-full"
                  onPress={() => handlePresses(item.id, "edit")}>
                  <MaterialIcons name="drive-file-rename-outline" color={"#DA7676"} size={35} />
                  {
                    editing ?
                      <EditText
                        visible={editing}
                        onClose={() => handleClose()}
                        toRename={item}
                        type="Song"
                      />
                      :
                      null
                  }
                </TouchableOpacity>

                {/* Add to playlist */}
                <TouchableOpacity className="justify-center items-center bg-Primary/20 h-12 w-12 rounded-full"
                  onPress={() => setOpenPlaylist(!openPlaylist)}>
                  <MaterialIcons name="bookmark-add" color={"#DA7676"} size={35} />
                  {
                    openPlaylist ?
                      <ListPlaylistModal
                        visible={openPlaylist}
                        onClose={() => handleClose()}
                        song={item}
                      />
                      :
                      null
                  }
                </TouchableOpacity>

                {/* delete */}
                <TouchableOpacity className="justify-center items-center bg-Primary/20 h-12 w-12 rounded-full"
                  onPress={() => handlePresses(item.id, "delete")}>
                  <MaterialIcons name="delete-forever" color={"#DA7676"} size={35} />
                </TouchableOpacity>

              </View>
            )}
          </View>
        )
        }

        ListEmptyComponent={
          < View className="flex-1 justify-center items-center mt-10" >
            <Text className="text-gray-500 text-center">
              No music files found. Try downloading some!
            </Text>
          </View >
        }
      />
    </View >
  );
}