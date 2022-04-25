import { Avatar, AvatarProps, Link } from '@mui/material';
import { AxiosResponse } from 'axios';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { api } from '../util/api';
import { ImageType, UserType } from '../util/types';

export interface UserAvatarProps extends AvatarProps {
  user?: UserType;
}

export default function UserAvatar({ user, ...rest }: UserAvatarProps) {
  const [imageUrl, setImageUrl] = useState(user?.image?.url);
  const [imageError, setImageError] = useState(false);
  const cloudfrontUrl = process.env.REACT_APP_CLOUDFRONT_URL || setImageError(true);

  const {
    data: imageData,
    isSuccess: isImageSuccess,
    isError: isImageError
  } = useQuery<AxiosResponse<ImageType>>('getUserImage', () => api.get(`/images/user/${user?.id}`), {
    enabled: !imageUrl && !imageError
  });
  useEffect(() => {
    if (isImageSuccess && imageData) {
      setImageUrl(imageData.data.url);
    } else if (isImageError) {
      setImageError(true);
    }
  }, [isImageSuccess, imageData, isImageError]);

  const [thumbnailUrl, setThumbnailurl] = useState<string>();
  const {
    data: thumbnailData,
    isSuccess: isThumbnailSuccess,
    isError: isThumbnailError
  } = useQuery<string>(
    ['getUserThumbnail', cloudfrontUrl, imageUrl],
    async ({ queryKey }) => {
      const [, cfUrl, imgUrl] = queryKey;
      return new Promise<string>((resolve, reject) => {
        if (cfUrl && imgUrl) {
          const thumbnailUrl = `${imgUrl}`.replace(/\.[^/.]+$/, '').concat('_thumbnail.jpeg');
          const img = new Image();
          img.src = `${cfUrl}/${imgUrl}`;
          img.onload = () => resolve(thumbnailUrl);
          img.onerror = () => reject(`Thumbnail does not exist ${img.src}`);
        } else {
          reject('Missing Cloudfront or image url');
        }
      });
    },
    { enabled: !!imageUrl && !thumbnailUrl && !imageError }
  );
  useEffect(() => {
    if (isThumbnailSuccess && thumbnailData) {
      setThumbnailurl(thumbnailData);
    } else if (isThumbnailError) {
      setImageError(true);
    }
  }, [isThumbnailSuccess, thumbnailData, isThumbnailError]);

  return (
    <Link href={`/profile/${user?.id}`} sx={{ textDecoration: 'none' }}>
      <Avatar
        {...rest}
        sx={{ border: `2px solid #d0c3e8` }}
        src={thumbnailUrl ? `${cloudfrontUrl}/${thumbnailUrl}` : `${cloudfrontUrl}/${imageUrl}`}
      >
        <Avatar sx={{ backgroundColor: '#d46294' }}>{user?.firstName.at(0)}</Avatar>
      </Avatar>
    </Link>
  );
}
