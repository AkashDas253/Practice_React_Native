import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Colors } from '../constants/theme';

interface MediaViewerProps {
  mediaUri: string | null;
  onClose: () => void;
}

const { width, height } = Dimensions.get('window');

export default function MediaViewer({ mediaUri, onClose }: MediaViewerProps) {
  if (!mediaUri) return null;

  const isVideo = mediaUri.endsWith('.mp4') || mediaUri.endsWith('.mov') || mediaUri.includes('video');

  // Setup video player if it's a video
  const player = useVideoPlayer(isVideo ? mediaUri : '', (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
          <Text style={styles.closeText}>✕ Close</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {isVideo ? (
          <VideoView
            player={player}
            style={styles.video}
            allowsFullscreen
            allowsPictureInPicture
          />
        ) : (
          <Image source={{ uri: mediaUri }} style={styles.image} resizeMode="contain" />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: { padding: 16, zIndex: 10 },
  closeBtn: { alignSelf: 'flex-start', backgroundColor: '#222', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 8 },
  closeText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  image: { width: width, height: height * 0.8 },
  video: { width: width, height: height * 0.7 },
});