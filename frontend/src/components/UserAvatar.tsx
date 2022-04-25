import { Avatar, AvatarProps, Link } from '@mui/material';
import { UserType } from '../util/types';

export interface UserAvatarProps extends AvatarProps {
  user?: UserType;
}

export default function UserAvatar({ user, ...rest }: UserAvatarProps) {
  const cloudfrontUrl = process.env.REACT_APP_CLOUDFRONT_URL;

  return (
    <Link href={`/profile/${user?.id}`} sx={{ textDecoration: 'none' }}>
      <Avatar
        {...rest}
        sx={{ border: `2px solid #d0c3e8` }}
        src={
          user?.image?.url &&
          cloudfrontUrl?.concat('/', user.image.url.replace(/\.[^/.]+$/, '').concat('_thumbnail.jpeg'))
        }
      >
        <Avatar sx={{ backgroundColor: '#d46294' }} src={user?.image?.url && cloudfrontUrl?.concat(user?.image?.url)}>
          {user?.firstName.at(0)}
        </Avatar>
      </Avatar>
    </Link>
  );
}
