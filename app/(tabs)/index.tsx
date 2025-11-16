import { FlatList, Text, View, TouchableOpacity, Image, Alert, TextInput } from "react-native";
import { Directory, File, Paths } from 'expo-file-system';
import { useEffect, useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@react-navigation/elements";
import { MusicManager } from "../utils/musicManager"
import { useFocusEffect } from "@react-navigation/native";
import MusicPlayer from "../components/musicPlayer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useRouter } from "expo-router";
import EditText from "../components/editTextModal";

export interface MusicFile {
  id: string;
  name: string;
  music?: any;
  image?: any;
}

export default function Index() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [music, setMusic] = useState<MusicFile[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState("");

  useFocusEffect(
    useCallback(() => {
      listMusicFiles();
      return () => {
      };
    }, [])
  );

  function playMusic(item: MusicFile) {
    router.push({
      pathname: "/player",
      params: {
        index: music.findIndex((m) => m.id === item.id),
        list: JSON.stringify(music),
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

  async function listMusicFiles() {
    try {
      const musicDir = new Directory(Paths.document, 'music');
      if (!musicDir.exists) {
        console.log('Music folder does not exist.');
        setMusic([]);
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

      // Update state with all the music files
      setMusic(musicFiles);

    } catch (error) {
      console.error('Error listing music files:', error);
      setMusic([]);
    }
  }

  useEffect(() => {
    listMusicFiles();
  }, []);


  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#1E1E1E' }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={music}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }: { item: MusicFile }) => (
          <View className=" p-4 border-b border-gray-700">

            <View className="w-full pt-2">
              <TouchableOpacity className="flex-row items-start"
                onPress={() => setExpandedId(prevId => prevId === item.id ? null : item.id)}
              //onPress={() => playMusic(item)}
              >
                <Image source={{ uri: item.image }} className="w-32 h-24 rounded-lg mr-4" />
                <View className="flex-1">
                  <Text className="text-white text-base" numberOfLines={4}>
                    {item.name}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            {expandedId === item.id && (
              <View className="flex-row items-start justify-between px-2 mt-4">
                <TouchableOpacity
                  onPress={() => playMusic(item)}
                  className="bg-green-300 rounded-full">

                  <MaterialIcons name="play-arrow" color="green" size={50} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handlePresses(item.id, "edit")}
                  className="bg-blue-300 rounded-full">

                  <MaterialIcons name="drive-file-rename-outline" color={"blue"} size={50} />
                </TouchableOpacity>

                <TouchableOpacity
                  className="e rounded-full">

                  <MaterialIcons name="save" size={50} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handlePresses(item.id, "delete")}
                  className="bg-red-300 rounded-full">

                  <MaterialIcons name="delete-forever" color="red" size={50} />
                  {
                    editing ?
                      <EditText
                        visible={editing}
                        onClose={() => setEditing(false)}
                        Song={item}
                      />
                      :
                      null
                  }
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