# The project have created using MVC template

## Creating backend part was used:

- **express** 
- **mongoose** 
- **multer** for uploading the image to blog
- **cors** protected connection and our routes with controllers
- using {body} from **express-validator** for validations

## Model:

**For models was used mongoose and created Schemas**
- **Post**
- **User**

## Controllers:

- **PostController**: 
- used CRUD operations for posts and for get a single post
- **UserController**:
- register and login and checkUser used findById for check
- used jwt for creating token
- bcrypt for hashing

## Middleware:

- **checkAuthUser** - for permissions
- **handleError** - used express-validator - if there was an error - the validation didn't pass then the request is not executed