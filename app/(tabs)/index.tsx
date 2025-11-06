import { FlatList, Text, View, TouchableOpacity } from "react-native";
import { Directory, File, Paths } from 'expo-file-system';
import { useEffect, useState, useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Button } from "@react-navigation/elements";
import { MusicManager } from "../utils/musicManager"
import { useFocusEffect } from "@react-navigation/native";
import MusicPlayer from "../components/musicPlayer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface MusicFile {
  id: string;
  name: string;
  music?: any;
}

export default function Index() {
  const insets = useSafeAreaInsets();
  const [focus, setFocus] = useState(false);
  const [music, setMusic] = useState<MusicFile[]>([]);

  useFocusEffect(
    useCallback(() => {
      listMusicFiles();
      return () => {
      };
    }, [])
  );

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

        let file_name = ''
        let file_music
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

        musicFiles.push({
          id: folderDir.name,
          name: file_name,
          music: file_music
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

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: '#1E1E1E' }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={music}
        keyExtractor={(item, index) => `${item.name}-${index}`}
        renderItem={({ item }: { item: MusicFile }) => (
          <View className="p-4 border-b border-gray-700">
            {/* Clickable header to expand/collapse */}
            <TouchableOpacity onPress={() => toggleExpand(item.id)}>
              <Text className="text-white text-lg">{item.name}</Text>
            </TouchableOpacity>

            {/* Only show MusicPlayer when expanded */}
            {expandedId === item.id && (
              <View className="mt-4">
                <MusicPlayer musicUrl={item.music} />
                <Button
                  onPress={() => MusicManager.deleteMusic(item.id)}
                >Delete</Button>
              </View>
            )}
          </View>
        )}


        ListEmptyComponent={
          <View className="flex-1 justify-center items-center mt-10">
            <Text className="text-gray-500 text-center">
              No music files found. Try downloading some!
            </Text>
          </View>
        }
      />
    </View>
  );
}