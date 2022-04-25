import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Divider, Link, Typography } from '@mui/material';
import InfiniteScroll from 'react-infinite-scroll-component';
import { GlobalContext } from '../../components/GlobalContext';
import { FetchPostsType } from '../../util/types';
import { api } from '../../util/api';
import FeedPost from '../../components/FeedPost';
import AddPost from '../../components/AddPost';
import CenteredCircularProgress from '../../components/CenteredCircularProgress';

const initialFeedState: FetchPostsType = {
  posts: [],
  page: -1,
  hasMore: true
};

export default function Feed() {
  const { user, isContextLoading: isLoading, isSignedIn } = useContext(GlobalContext);
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
  const onPostSuccess = useCallback(() => {
    setFeedState(initialFeedState);
  }, []);
  const containerRef = useRef(null);

  return (
    <Container
      ref={containerRef}
      maxWidth='sm'
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      {user ? (
        <>
          <AddPost user={user} onSuccess={onPostSuccess} />
          <Divider sx={{ pt: 4 }} />
          {isFeedLoading ? (
            <CenteredCircularProgress />
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
              loader={<CenteredCircularProgress />}
              dataLength={feedState.posts.length}
            >
              {feedState.posts.map((p) => (
                <FeedPost post={p} key={p.id} />
              ))}
            </InfiniteScroll>
          )}
        </>
      ) : (
        <CenteredCircularProgress />
      )}
    </Container>
  );
}
