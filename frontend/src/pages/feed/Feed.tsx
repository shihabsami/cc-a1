import { useContext, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Container, Divider, Link, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GlobalContext } from '../../components/GlobalContext';
import { FetchPostsType } from '../../util/types';
import { api } from '../../util/api';
import FeedPost from '../../components/FeedPost';
import AddPost from '../../components/AddPost';

const initialFeedState: FetchPostsType = {
  posts: [],
  page: -1,
  hasMore: true
};

export default function Feed() {
  const { user, isLoading, isSignedIn } = useContext(GlobalContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isSignedIn()) {
      return navigate('/sign-in');
    }
  }, [isLoading, isSignedIn, navigate]);

  const [feedState, setFeedState] = useState<FetchPostsType>(initialFeedState);
  const { isLoading: isFeedLoading, refetch: fetchMorePosts } = useQuery(
    'fetchMorePosts',
    async () => {
      const nextPage = feedState.page + 1;
      await api
        .get<FetchPostsType>('/posts', {
          params: {
            page: nextPage
          }
        })
        .then((response) => {
          setFeedState({
            posts: feedState.posts.concat(response.data.posts),
            page: nextPage,
            hasMore: response.data.hasMore
          });
        });
    },
    { enabled: false }
  );
  useEffect(() => {
    if (feedState.page === -1) {
      fetchMorePosts();
    }
  }, [feedState.page, fetchMorePosts]);

  return (
    <Container
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {user ? (
        <>
          <AddPost
            user={user}
            onSuccess={() => {
              setFeedState(initialFeedState);
            }}
          />
          <Divider sx={{ pt: 4 }} />
          {isFeedLoading ? (
            <Box sx={{ p: 4 }} display='flex' justifyContent='center'>
              <CircularProgress size={24} color='primary' />
            </Box>
          ) : (
            <InfiniteScroll
              next={fetchMorePosts}
              hasMore={feedState.hasMore}
              endMessage={
                <Box sx={{ py: 4 }} display='flex' flexDirection='column' alignItems='center' justifyContent='center'>
                  {feedState.posts.length > 0 ? (
                    <>
                      <Typography variant='body1'>That&apos;s all for now.</Typography>
                      <Link
                        sx={{ p: 0, m: 0 }}
                        component='button'
                        variant='body1'
                        onClick={() => {
                          document.body.scrollIntoView({ behavior: 'smooth' });
                        }}
                      >
                        Back to top.
                      </Link>
                    </>
                  ) : (
                    <Typography variant='body1'>No posts yet. Now&apos;s your chance to create history.</Typography>
                  )}
                </Box>
              }
              loader={
                <Box sx={{ p: 4 }} display='flex' justifyContent='center'>
                  <CircularProgress size={24} color='primary' />
                </Box>
              }
              dataLength={feedState.posts.length}
            >
              {feedState.posts.map((p) => (
                <FeedPost post={p} key={p.id} />
              ))}
            </InfiniteScroll>
          )}
        </>
      ) : (
        <Box sx={{ p: 4 }} display='flex' justifyContent='center'>
          <CircularProgress size={24} color='primary' />
        </Box>
      )}
    </Container>
  );
}
