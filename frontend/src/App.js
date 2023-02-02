import { useEffect } from "react";
import Container from "@mui/material/Container";
import { Header } from "./components";
import { useDispatch, useSelector } from "react-redux";
import { Routes, Route } from "react-router-dom";
import { fetchMeData, isAuthSelector } from "./redux/slices/auth";
import { Home, FullPost, Registration, AddPost, Login } from "./pages";

function App() {
  // Тепер додатку потрібно зрозуміти авторизований користувач або ні
  const dispatch = useDispatch()
  const isAuth = useSelector(isAuthSelector) // авторизовані чи ні перевіряємо в першу чергу

  useEffect(() => {
    dispatch(fetchMeData())
  }, [])
  return (
    <>
      <Header />
      <Container maxWidth="lg">
        <Routes> {/*використовуючи routes прикрутимо компоненти*/}
          <Route path='/' element={<Home />} /> {/*на головній сторінці рендеримо Home*/}
          <Route path='/posts/:id' element={<FullPost />} />
          <Route path='/posts/:id/edit' element={<AddPost />} />
          <Route path='/create-post' element={<AddPost />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Registration />} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
