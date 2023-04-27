import express, {NextFunction, Response, Request} from 'express';
import {auth} from '../middlewares/auth'
import {v4 as uuidv4} from 'uuid'
import { MovieInstance } from '../model/movieModel';
import { UserInstance } from '../model/userModel';



const router = express.Router();

// Pages

router.get('/', async(req:Request, res:Response) => {
    try {
        // const limit = req.query?.limit as number | undefined;
        // const offset = req.query?.offset as number | undefined;
    // sequelize findAll or findAndCountAll

    // const getAllMovies = await MovieInstance.findAll();
    const getAllMovies = await MovieInstance.findAndCountAll({
        // limit:limit,
        // offset:offset
    });

    return res.render("layout", {movielist: getAllMovies.rows})

    } catch (error) {
        console.log(error)
    }

})

router.get('/register', (req:Request, res:Response, next:NextFunction) => {
    res.render('Register')
})

//Display Home page
router.get('/dashboard', auth, async(req:Request | any, res:Response)=>{
    try{
       const { id } = req.user
       const {movie} = await UserInstance.findOne({where:{id}, include:{
        model:MovieInstance,
        as:"movie"
       }}) as unknown as any

       return res.render("user", {
        movielist :movie,
        user: res.locals.user
       })

   
    }catch(err){
     console.log(err)
    }
   } )

router.get('/login', (req:Request, res:Response, next:NextFunction) => {
    res.render('Login')
})

// api Create movie with ejs
router.post('/dashboard', auth , async(req:Request | any, res:Response)=>{
    try{
       const verified = req.user;
   
       const id = uuidv4()
       // const { description,  completed} = req.body;
   
       const movieRecord =  await MovieInstance.create({
        id,
        ...req.body,
        userId: verified.id
       })
   
      return res.redirect("/dashboard")
   
    }catch(err){
     console.log(err)
    }
   } )

   router.get("/dashboard/:id", auth, async (req: Request, res: Response) => {
    try {
        const {id} = req.params;
        const record = await MovieInstance.findOne({where:{id}})
        if(!record){
            return res.render("user", {error: "Cannot find any movie"})
        }
       await record.destroy();
        return res.redirect('/dashboard')
    } catch (error) {
        console.log(error)
        
    }
  })

    // Get movie owned by a user
//    router.get('/dashboard', auth,  async(req:Request | any, res:Response)=>{
//     try{
//        const { id } = req.user
//        const {movie} = await UserInstance.findOne({where:{id}, include:{
//         model:MovieInstance,
//         as:"movie"
//        }}) as unknown as any

//        res.status(200).json(movie);

//        return res.render("Home", {
//         movielist :movie
//        })

   
//     }catch(err){
//      console.log(err)
//     }
//    } )



export default router
