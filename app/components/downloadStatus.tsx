// components/DownloadToast.jsx
import React from 'react';
import { View, Text, Animated } from 'react-native';
import { useDownload } from '../context/downloadContext';

export default function DownloadToast() {
    const { 
        isDownloadModalVisible, 
        downloadProgress, 
        downloadStatus, 
    } = useDownload();

    const slideAnim = React.useRef(new Animated.Value(-100)).current;

    React.useEffect(() => {
        if (isDownloadModalVisible) {
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isDownloadModalVisible]);

    if (!isDownloadModalVisible) return null;

    return (
        <Animated.View 
            style={{
                position: 'absolute',
                top: 50, // Below status bar
                left: 16,
                right: 16,
                zIndex: 9999,
                backgroundColor: 'white',
                borderRadius: 12,
                padding: 16,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
                elevation: 5,
                transform: [{ translateY: slideAnim }]
            }}
        >
            <View className="flex-row items-center justify-between">
                <View className="flex-1">
                    <Text className="text-sm font-semibold text-gray-800">
                        {downloadStatus === 'downloading' 
                            ? `Downloading... ${downloadProgress}%`
                            : downloadStatus === 'completed'
                            ? 'Download Complete!'
                            : 'Download Failed'
                        }
                    </Text>
                    
                    {downloadStatus === 'downloading' && (
                        <View className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <View 
                                className="h-2 rounded-full bg-blue-500"
                                style={{ width: `${downloadProgress || 0}%` }}
                            />
                        </View>
                    )}
                </View>
            </View>
        </Animated.View>
    );
}