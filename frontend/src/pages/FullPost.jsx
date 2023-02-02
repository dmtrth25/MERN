import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { useParams } from 'react-router-dom';
import axios from '../axios';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';

export const FullPost = () => {
  const [data, setData] = useState();
  const [isLoading, setIsLoading] = useState(true);

  const { id } = useParams();
  // нема сенсу в редаксі зберігати одну статтю - будемо зберігати локально

  useEffect(() => {
    async function fetchData() {
      // робимо async тому що не можна писати в useEffect
      try {
        const { data } = await axios.get('/posts/' + id);
        setData(data);
        setIsLoading(false); // якщо запит успішний
      } catch (error) {
        alert('Помилка при отриманні постів');
      }
    }

    fetchData();
  }, []);

  if (isLoading) {
    // якщо йде завантаження то рендеримо <Post/>
    return <Post isLoading={isLoading} isFullPost />; // isFullPost - повний запис
  }

  return (
    <>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl ? `http://localhost:4444${data.imageUrl}` : ''}
        // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        commentsCount={3}
        tags={data.tags}
        isFullPost>
        <ReactMarkdown children={data.text} />
      </Post>
    </>
  );
};
