import { Avatar, AvatarProps } from '@mui/material';
import { UserType } from '../util/types';

export interface UserAvatarProps extends AvatarProps {
  user?: UserType;
}

export default function UserAvatar({ user, ...rest }: UserAvatarProps) {
  return (
    <Avatar
      {...rest}
      src={user?.image?.url
        .replace(/\.[^/.]+$/, '')
        .replace('images', 'thumbnails')
        .concat('_64x64.jpeg')}
    >
      <Avatar sx={{ backgroundColor: '#d46294' }} src={user?.image?.url}>
        {user?.firstName.at(0)}
      </Avatar>
    </Avatar>
  );
}
