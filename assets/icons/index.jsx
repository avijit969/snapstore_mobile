import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Home from './Home'
import ArrowLeft from './ArrowLeft'
import ArrowRight from './ArrowRight'
import { theme } from '../../constants/theme'
import Mail from './Email'
import Lock from './Lock'
import User from './User'
import Sign from './Sign'
import Learn from './Learn'
import Practice from './Practice'
import Setting from './Settings'
import Edit from './Edit'
import Fire from './Fire'
import Star from './Star'
import Image from './Image'
import Folder from './Folder'
import library from './Library'
import cloudUpload from './CloudUpload'
import Add from './Add'
import AlbumImages from './AlbumImages'
import Share from './Share'
import Invite from './Invite'
import MoreBar from './MoreBar'
import AlbumAdd from './AlbumAdd'
import Delete from './Delete'
import CameraLense from './CameraLense'
import Message from './Message'
import AddImage from './AddImage'
const icons = {
  home: Home,
  arrowLeft: ArrowLeft,
  arrowRight: ArrowRight,
  email: Mail,
  lock: Lock,
  user: User,
  sign: Sign,
  learn: Learn,
  practice: Practice,
  setting: Setting,
  edit: Edit,
  fire: Fire,
  star: Star,
  image: Image,
  folder: Folder,
  library: library,
  cloudUpload: cloudUpload,
  add: Add,
  albumImages: AlbumImages,
  share: Share,
  invite: Invite,
  more: MoreBar,
  albumAdd: AlbumAdd,
  delete: Delete,
  cameraLense: CameraLense,
  message: Message,
  addImage: AddImage
}

export default function Icon({ name, ...props }) {
  const IconComponent = icons[name]
  return (
    <IconComponent
      height={props.height || 24}
      width={props.width || 24}
      strokeWidth={props.strokeWidth || 1.9}
      color={theme.colors.textLight}
      {...props}
    />
  )
}

const styles = StyleSheet.create({})