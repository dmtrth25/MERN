import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserData, isAuthSelector } from '../../redux/slices/auth';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

import styles from './Login.module.scss';

export const Login = () => {
  const isAuth = useSelector(isAuthSelector); // ми повинні зрозуміти чи авторизований користувач чи ні
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    // витягуємо register - він дозволить зареєструвати поля TextField - щоб хукформ розуміла що вони наявні
    defaultValues: {
      email: 'admin@gmail.com',
      password: 'admin',
    }, // первинні параметри
    mode: 'onChange', // валідація тільки в тому випадку якщо ці поля змінилися
  }); // створюємо запит на те, щоб робити авторизацію

  const onSubmit = async (values) => {
    const data = await dispatch(fetchUserData(values));

    if (!data.payload) {
      return alert('Не вдалося авторизуватися'); // якщо буде невірний пароль
    }

    if ('token' in data.payload) {
      window.localStorage.setItem('token', data.payload.token); // якщо є токен то користувач авторизований і нам потрібно зберегти в localStorage token
    }
  }; // функція спрацює якщо react hook form зрозумів що валідація коректна, всі запити виконалися добре

  if (isAuth) {
    // якщо ми авторизованіто перекидаємо користувача на головну сторінку
    return <Navigate to="/" />;
  }
  return (
    <Paper classes={{ root: styles.root }}>
      <Typography classes={{ root: styles.title }} variant="h5">
        Вход в аккаунт
      </Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*використаємо handleSubmit і в нього передаємо нашу функцію onSubmit - вони виконуються тільки тоді, коли поля провалідуються (TextField) */}
        <TextField
          className={styles.field}
          label="E-Mail"
          error={Boolean(errors.email?.message)} // якщо інформація отримана і вона true - то буде підсвічуватися червоним
          helperText={errors.email?.message} // ?. - якщо email нема в списку помилок то не треба message and errors from above we get from formState
          // тепер ці поля потрібно зареєструвати для реакт хук форми
          type="email" // браузерна проста валідація
          {...register('email', { required: 'Вкажіть пошту' })} // назва полю email
          // якщо воно не заповнено то вкажіть пошту бо воно є required
          fullWidth
        />
        <TextField
          className={styles.field}
          label="Пароль"
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message} // те саме для паролю
          {...register('password', { required: 'Вкажіть пароль' })}
          // якщо ці два поля будуть рендеритися то ми їх реєструємо в useForm і він їх буде обробляти
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Увійти
        </Button>
        {/*якщо поле не валідне то disabled*/}
      </form>
    </Paper>
  );
};
