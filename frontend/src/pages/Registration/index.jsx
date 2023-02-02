import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { fetchRegisterData, isAuthSelector } from '../../redux/slices/auth';

import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';

import styles from './Login.module.scss';

export const Registration = () => {
  const isAuth = useSelector(isAuthSelector); // ми повинні зрозуміти чи авторизований користувач чи ні
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    // витягуємо register - він дозволить зареєструвати поля TextField - щоб хукформ розуміла що вони наявні
    defaultValues: {
      fullName: 'Іван Іванов',
      email: '121212@gmail.com',
      password: 'password',
    }, // первинні параметри
    mode: 'onChange', // валідація тільки в тому випадку якщо ці поля змінилися
  }); // створюємо запит на те, щоб робити авторизацію

  const onSubmit = async (values) => {
    const data = await dispatch(fetchRegisterData(values));

    if (!data.payload) {
      return alert('Не вдалося зареєструватися'); // якщо буде невірний пароль
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
      <form onSubmit={handleSubmit(onSubmit)}>
        <Typography classes={{ root: styles.title }} variant="h5">
          Створення акаунту
        </Typography>
        <div className={styles.avatar}>
          <Avatar sx={{ width: 100, height: 100 }} />
        </div>
        <TextField
          error={Boolean(errors.fullName?.message)}
          helperText={errors.fullName?.message} // те саме для fullName
          {...register('fullName', { required: "Вкажіть повне ім'я" })}
          // якщо ці два поля будуть рендеритися то ми їх реєструємо в useForm і він їх буде обробляти
          className={styles.field}
          label="Повне ім'я"
          fullWidth
        />
        <TextField
          error={Boolean(errors.email?.message)}
          helperText={errors.email?.message} // те саме для email
          {...register('email', { required: 'Вкажіть email' })}
          // якщо ці два поля будуть рендеритися то ми їх реєструємо в useForm і він їх буде обробляти
          className={styles.field}
          label="E-Mail"
          fullWidth
        />
        <TextField
          error={Boolean(errors.password?.message)}
          helperText={errors.password?.message} // те саме для паролю
          {...register('password', { required: 'Вкажіть пароль' })}
          // якщо ці два поля будуть рендеритися то ми їх реєструємо в useForm і він їх буде обробляти
          className={styles.field}
          label="Пароль"
          fullWidth
        />
        <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
          Зареєструватись
        </Button>{' '}
        {/*якщо поле не валідне то disabled*/}
      </form>
    </Paper>
  );
};
