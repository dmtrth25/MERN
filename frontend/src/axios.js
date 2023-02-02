import axios from "axios";

const example = axios.create({ // axios повинен створити свою оболонку
  baseURL: 'http://localhost:4444' // завжди запити на цю адресу
})

// це робимо для того щоб ми не писали потім весь запит
// axios.get('http://localhost:4444/posts')
// axios.get('/posts') // тепер можемо записати так - axios сам докруте url

// створиво middleware котрий буде при кожному запиті перевіряти авторизований користувач чи ні та завжди відправляти його в запит
example.interceptors.request.use((config) => { // config - конфігурація axios завжди потрібно перевіряти на токен та вшивати цю інформацію сюди config.headers.Authorization на кожен запит (запрос)
  config.headers.Authorization = window.localStorage.getItem('token')// потрібно прикрутити те, що є в localStorage
  return config; // повернули змінену конфігурацію
})
// middleware на запрос та use() використовувати

export default example
