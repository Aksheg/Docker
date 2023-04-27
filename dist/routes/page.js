"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const uuid_1 = require("uuid");
const movieModel_1 = require("../model/movieModel");
const userModel_1 = require("../model/userModel");
const router = express_1.default.Router();
// Pages
router.get('/', async (req, res) => {
    try {
        // const limit = req.query?.limit as number | undefined;
        // const offset = req.query?.offset as number | undefined;
        // sequelize findAll or findAndCountAll
        // const getAllMovies = await MovieInstance.findAll();
        const getAllMovies = await movieModel_1.MovieInstance.findAndCountAll({
        // limit:limit,
        // offset:offset
        });
        return res.render("layout", { movielist: getAllMovies.rows });
    }
    catch (error) {
        console.log(error);
    }
});
router.get('/register', (req, res, next) => {
    res.render('Register');
});
//Display Home page
router.get('/dashboard', auth_1.auth, async (req, res) => {
    try {
        const { id } = req.user;
        const { movie } = await userModel_1.UserInstance.findOne({ where: { id }, include: {
                model: movieModel_1.MovieInstance,
                as: "movie"
            } });
        return res.render("user", {
            movielist: movie,
            user: res.locals.user
        });
    }
    catch (err) {
        console.log(err);
    }
});
router.get('/login', (req, res, next) => {
    res.render('Login');
});
// api Create movie with ejs
router.post('/dashboard', auth_1.auth, async (req, res) => {
    try {
        const verified = req.user;
        const id = (0, uuid_1.v4)();
        // const { description,  completed} = req.body;
        const movieRecord = await movieModel_1.MovieInstance.create({
            id,
            ...req.body,
            userId: verified.id
        });
        return res.redirect("/dashboard");
    }
    catch (err) {
        console.log(err);
    }
});
router.get("/dashboard/:id", auth_1.auth, async (req, res) => {
    try {
        const { id } = req.params;
        const record = await movieModel_1.MovieInstance.findOne({ where: { id } });
        if (!record) {
            return res.render("user", { error: "Cannot find any movie" });
        }
        await record.destroy();
        return res.redirect('/dashboard');
    }
    catch (error) {
        console.log(error);
    }
});
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
exports.default = router;
