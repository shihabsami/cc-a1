import moment from 'moment';
import { Box, Divider, Typography } from '@mui/material';
import { CommentType } from '../util/types';
import UserAvatar from './UserAvatar';

export default function Comments({ comments }: { comments?: CommentType[] }) {
  return (
    <>
      {comments?.map((comment, index) => (
        <Box key={comment.id}>
          <Box display='flex' p={2} alignItems='center'>
            <UserAvatar user={comment.user} alt='Comment User Image' />
            <Box sx={{ pl: 2 }}>
              <Box display='inline-flex'>
                <Typography sx={{ pr: 1 }} fontWeight='bold' variant='body2'>
                  {comment.user.firstName.concat(' ', comment.user.lastName)}
                </Typography>
                <Typography variant='body2' color='gray'>
                  {moment(comment.createdAt).fromNow()}
                </Typography>
              </Box>
              <Typography variant='body1'>{comment.text}</Typography>
            </Box>
          </Box>
          {index < comments.length - 1 && <Divider />}
        </Box>
      ))}
    </>
  );
}
