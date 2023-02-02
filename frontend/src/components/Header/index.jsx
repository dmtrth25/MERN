import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout, isAuthSelector } from '../../redux/slices/auth';

import styles from './Header.module.scss';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

export const Header = () => {
  const dispatch = useDispatch();
  const isAuth = useSelector(isAuthSelector);

  const onClickLogout = () => {
    if (window.confirm('Ви дійсно хочете вийти ?')) {
      dispatch(logout());
      window.localStorage.removeItem('token'); // видаляємо токен при logout
    }
  };

  return (
    <div className={styles.root}>
      <Container maxWidth="lg">
        <div className={styles.inner}>
          <div className={styles.buttons}>
            {isAuth ? (
              <>
                <Link to="/create-post">
                  <Button variant="contained">Написати статтю</Button>
                </Link>
                <Button onClick={onClickLogout} variant="contained" color="error">
                  Вийти
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outlined">Увійти</Button>
                </Link>
                <Link to="/register">
                  <Button variant="contained">Створити акаунт</Button>
                </Link>
              </>
            )}
          </div>
          <Link className={styles.logo} to="/">
            <div>react blog</div>
          </Link>
        </div>
      </Container>
    </div>
  );
};
