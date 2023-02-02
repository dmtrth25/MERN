import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
// import axios from 'axios';

export const Home = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.auth.data); // авторизовані чи ні (інформація про користувача)
  const { posts, tags } = useSelector((state) => state.posts); // чому posts, тому що в store я вказав назву posts
  const isPostsLoading = posts.status === 'loading';
  const isTagsLoading = tags.status === 'loading';

  useEffect(() => {
    // axios.get('/posts'); // axios прикрутить url - перервірка
    // useDisaptch для відправки асинхроного екшену
    dispatch(fetchPosts());
    dispatch(fetchTags());
  }, []);

  return (
    <>
      <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
        <Tab label="Статті" />
      </Tabs>
      <Grid container spacing={4}>
        <Grid xs={8} item>
          {(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
            isPostsLoading ? (
              <Post key={index} isLoading={true} />
            ) : (
              // фейкові 5 статтей
              <Post
                id={obj._id}
                title={obj.title}
                imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : ''} // якщо є imageUrl
                user={obj.user}
                createdAt={obj.createdAt}
                viewsCount={obj.viewsCount}
                commentsCount={3}
                tags={obj.tags}
                isEditable={userInfo?._id === obj.user._id} // id авторизованого користувача чи співпадає з id цього посту
                // userInfo?._id - якщо userInfo є - т ми витягуємо звідти _id і порівнюємо його з obj.user.id
              />
            ),
          )}
        </Grid>
        <Grid xs={4} item>
          <TagsBlock items={tags.items} isLoading={isTagsLoading} />
        </Grid>
      </Grid>
    </>
  );
};
