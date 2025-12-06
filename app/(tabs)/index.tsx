import { FlatList, Text, View, TouchableOpacity, Image, Alert } from "react-native";
import { useEffect, useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MusicManager } from "../utils/musicManager"
import { useFocusEffect } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import EditText from "../components/modals/editTextModal";
import ListPlaylistModal from "../components/modals/listPlaylistsModal";
import SearchBar from "../components/searchBar";
import { MusicFile } from "../utils/musicManager";

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [music, setMusic] = useState<MusicFile[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false)
  const [openPlaylist, setOpenPlaylist] = useState(false);

  useFocusEffect(
    useCallback(() => {
      listMusicFiles();
      return () => {
      };
    }, [])
  );

  function playAllMusic() {
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
      }

    } catch (error) {
      console.error('Error listing music files:', error);
      setMusic([]);
    }
  }

  useEffect(() => {
    listMusicFiles();
  }, []);


  return (
    <View className="flex-1" style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#1E1E1E' }}>

      <View className="flex-row justify-center items-center h-16 bg-Primary/50 m-2 rounded-full">
        <TouchableOpacity
          onPress={() => playAllMusic()}
          className="bg-Dark/50 h-12 w-12 rounded-full justify-center items-center">
          <MaterialIcons name="play-arrow" color={"#DA7676"} size={35} />
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={music}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }: { item: MusicFile }) => (
          <View className="p-4 border-b border-gray-700">

            <View className="w-full pt-2">
              <TouchableOpacity className="flex-row items-start"
                onPress={() => setExpandedId(prevId => prevId === item.id ? null : item.id)}
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