import * as ImagePicker from 'expo-image-picker'
import { useEffect, useState } from 'react'
import { Alert, Button, Image, StyleSheet, View } from 'react-native'
import { downloadAvatar } from '../../application/downloadAvatar'
import { uploadAvatarFile } from '../../application/uploadAvatar'

interface Props {
  size: number
  url: string | null
  onUpload: (filePath: string) => void
}

export default function AvatarView({ url, size = 150, onUpload }: Props) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const avatarSize = { height: size, width: size }

  useEffect(() => {
    if (url) downloadImage(url)
  }, [url])

  async function downloadImage(path: string) {
    try {
      const avatar = await downloadAvatar(path)
      setAvatarUrl(avatar)
    } catch (error) {
      console.log('Error downloading avatar:', error)
    }
  }

  async function uploadImage(imageUri: string, mimeType?: string) {
    try {
      const path = await uploadAvatarFile(imageUri, mimeType)
      onUpload(path)
    } catch (error) {
      Alert.alert('Error', (error as Error).message)
    }
  }

  return (
    <View>
      {avatarUrl ? (
        <Image
          source={{ uri: avatarUrl }}
          accessibilityLabel="Avatar"
          style={[avatarSize, styles.avatar, styles.image]}
        />
      ) : (
        <View style={[avatarSize, styles.avatar, styles.noImage]} />
      )}
      <View>
        <Button
          title={uploading ? 'Uploading ...' : 'Upload'}
          onPress={async () => {
            try {
              setUploading(true)
              const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
              })
              if (!result.canceled && result.assets && result.assets.length > 0) {
                await uploadImage(result.assets[0].uri, result.assets[0].mimeType)
              }
            } finally {
              setUploading(false)
            }
          }}
          disabled={uploading}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 100,
    overflow: 'hidden',
    maxWidth: '100%',
  },
  image: {
    objectFit: 'cover',
    paddingTop: 0,
  },
  noImage: {
    backgroundColor: '#333',
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: 'rgb(200, 200, 200)',
    borderRadius: 5,
  },
})