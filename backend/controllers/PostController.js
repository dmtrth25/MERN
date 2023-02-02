import PostSchema from '../models/Post.js'

export const getTags = async (req, res) => {
  try {
    const posts = await PostSchema.find().limit(5).exec()

    const tags = posts.map((obj) => obj.tags).flat().slice(0, 5) // отримаємо останні 5 статей
    res.json(tags)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не вдалося отримати теги'
    })
  }
} // отримуємо теги

export const getAllPosts = async (req, res) => {
  try {
    const posts = await PostSchema.find().populate('user').exec() // populate - список користувачів у статті передаємо або масив зв'язків або один зв'язок в populate. в нашому випадку один зв'язок exec виконеємо наш запит
    res.json(posts)
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не вдалося отримати статті'
    })
  }
} // отримуємо всі статті

export const getSinglePost = async (req, res) => {
  try {
    // потрібно витягнути id статті тому що ми будемо його витягувати :id
    const postId = req.params.id

    // будемо отримувати статтю і оновлювати її калькість переглядів
    PostSchema.findOneAndUpdate({
      _id: postId
    },
      {
        $inc: { viewsCount: 1 } // що саме інкрементувати (viewsCount на 1)
        // другим параметром передаємо що саме ми хочемо оновити, зробити
      },
      {
        // третій параметр пояснює, що ми не просто хочемо отримати статтю та оновити але й повернути оновлювальний результат
        returnDocument: 'after' // після оновлення повернути вже актуальний документ
      },
      // четвертий параметр функція, котра вже буде виконуватися (чи є помилка або вже прийшов документ)
      (err, doc) => {
        // коли відбудеться отримання та оновлення статті що робити далі (повернути помилку чи сам документ)
        if (err) {
          console.log(err)
          return res.status(500).json({
            message: 'Не вдалося повернути статтю'
          })
        }

        // якщо помилки немає ми перевіряємо чи є взагалі такий документ може повернутися undefined з помилкою просто
        if (!doc) {
          return res.status(404).json({
            message: 'Стаття не знайдена'
          })
        }
        // якщо помилок немає просто повернемо документ
        res.json(doc)
      }
    ).populate('user')
  } catch (error) {
    console.log(error)
    res.status(500).json({
      message: 'Не вдалося отримати статті'
    })
  }
} // отримуємо одну статтю

export const createPost = async (req, res) => {
  try {
    // body те що нам передає користувач
    const doc = new PostSchema({
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      tags: req.body.tags.split(','),
      user: req.userId // коли ми будемо робити перевірку на авторизацію в req він нам передає з частини checkAuthUser req.userId = decoded._id та його ми витягуємо
    })

    // коли документ підготовлений його необхідно створити
    const post = await doc.save()

    // і повертаємо відповідь
    res.json(post)

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося створити статтю'
    })
  }
} // створити статтю

export const removePost = async (req, res) => {
  try {
    // потрібно витягнути id статтію тому що ми будемо його витягувати :id
    const postId = req.params.id

    PostSchema.findOneAndDelete({
      _id: postId // знаходити по принципу
    }, (err, doc) => {
      if (err) {
        console.log(err)
        return res.status(500).json({
          message: 'Не вдалося видалити статтю'
        })
      } // Якщо помилка

      if (!doc) {
        return res.status(404).json({
          message: 'Статтю не знайдено'
        })
      } // Якщо небуло помилки і стаття не знайшлася

      res.json({
        success: true
      }) // Якщо стаття знайшлася, не було помилок і вона видалилася - просто повертаємо відповідь
    }) // другий параметр вкузаує чи після видалення була помилка або ні?

  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося отримати статті'
    })
  }
}

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id

    await PostSchema.updateOne({
      _id: postId // Будемо шукати за допомогою id
    }, {
      title: req.body.title,
      text: req.body.text,
      imageUrl: req.body.imageUrl,
      user: req.userId,
      tags: req.body.tags.split(','),
      // Другий параметр що саме ми хочемо оновити (яку інформацію)
    })

    res.json({
      success: true
    })
  } catch (err) {
    console.log(err)
    res.status(500).json({
      message: 'Не вдалося оновити статтю'
    })
  }
}
