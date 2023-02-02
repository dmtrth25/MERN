import React, { useState, useRef, useEffect } from 'react';
import axios from '../../axios';
import { useSelector } from 'react-redux';

import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import styles from './AddPost.module.scss';
import { isAuthSelector } from '../../redux/slices/auth';
import { useNavigate, Navigate, useParams } from 'react-router-dom';

export const AddPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(isAuthSelector);
  const [isLoading, setIsLoading] = useState(false);
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const fileRef = useRef(null);
  const isEdit = Boolean(id);

  const handleChangeFile = async (e) => {
    try {
      const formData = new FormData(); // спеціальний формат який дозволить завантажувати картинку та відправляти її на бекенд
      const file = e.target.files[0];
      formData.append('image', file); // formData повинен прийняти особливий параметр image та витягуємо її з file -> e.target.files першим елементом - тобто [0]
      const { data } = await axios.post('/upload', formData); // відправ файл з formData на /upload
      // коли повернеться відповідь - тобто data - скажи мені яка ссилка у цього файлу
      setImageUrl(data.url); // передаємо картинку в стейт
    } catch (err) {
      console.warn(err);
      alert('Помилка при завантажені файлу');
    }
  }; // буде перевіряти чи змінилося в інпуті щось чи ні
  // якщо щось змінится при onChange ти повинен мені ці інформацію дати та щось з нею зробити
  // витягнути файл який передається та відправити його на сервак

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    // useCallback - тому що вимога бібліотеки
    setText(value);
  }, []); // керований редактор

  const onSubmit = async () => {
    try {
      setIsLoading(true); // ми на сервак відправляємо статтю - завантаження

      const fields = {
        // поля для відправлення на сервер
        title,
        text,
        tags, // : tags.split(','), цілу строку розбиваємо в один єдиний масив
        imageUrl,
      };

      // ми повинні вказати - що якщо створення статті - post
      // якщо оновлення - то patch
      const { data } = isEdit
        ? await axios.patch(`/posts/${id}`, fields) // якщо оновлення то patch
        : await axios.post('/posts', fields); // передаємо в запит fields
      // тепер потрібно зрозуміти чи повернуся нам id
      // коли створюється стаття потрібно витягнути id і якщо стаття створена то перевести користувача в середину цієї статті

      // По факту виходить що якщо редагування в нас - то відповідь (data) не повернеться
      // зробимо тернаркою
      const _id = isEdit ? id : data._id; // витягуємо цю статтю

      navigate(`/posts/${_id}`); // потрібно зробити перехід на конкретну статтю якщо вона створена
    } catch (error) {
      // якщо стаття не створена
      console.warn(error);
      alert('Помилка при створенні статті');
    }
  };

  useEffect(() => {
    if (id) {
      // якщо id є - то ми її витягуємо
      axios
        .get(`/posts/${id}`) // робимо запит на отримання
        .then(({ data }) => {
          setTitle(data.title);
          setText(data.text);
          setTags(data.tags.join(',')); // перетворив у строчку
          setImageUrl(data.imageUrl); // отримуємо інформацію та зберігаємо її у виді окремих значень
        })
        .catch((err) => {
          console.warn(err);
          alert('Помилка при отриманні статі');
        });
    }
  }, []);

  const options = React.useMemo(
    // базові настройки для редактора
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введіть текст...',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    // якщо токена не буде в localStorage - то ми не можемо знаходиться на цій сторінці
    // якщо незалогінений і токен відсутній в принципі (при оновленні сторінки для створення статті воно перекидувало на головну - але тепер якщо користучав залогінений після оновлення сторінки залишиться на ній, а не перекине)
    return <Navigate to="/" />;
  } // якщо я буду незалогігений користувач мене просто перекинить на головну

  // console.log({ title, tags, value });
  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => fileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={fileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
          <Button variant="contained" color="error" onClick={onClickRemoveImage}>
            Удалить
          </Button>
          <img className={styles.image} src={`http://localhost:4444${imageUrl}`} alt="Uploaded" />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Заголовок статті..."
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        variant="standard"
        placeholder="Теги"
        fullWidth
      />
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdit ? 'Зберегти' : 'Опублікувати'} {/*якщо редагування - умова*/}
        </Button>
        <a href="/">
          <Button size="large">Скасувати</Button>
        </a>
      </div>
    </Paper>
  );
};
