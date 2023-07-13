import express from 'express'; // Recursos WEB
import {allRoutes} from './routes.js'; // Importa as rotas existentes
import cors from 'cors'; // "Permissão" para rodar em navegadores

const app = express();

app.use(cors());
app.use(express.urlencoded({extended: true}));// Suporta JSON
app.use(express.json());
app.use(allRoutes);

app.listen(3333, () => {
    
    console.log("                                                                                ");
    console.log("                                                                                ");
    console.log("   ___                                                                          ");
    console.log("   MM                                                                           ");
    console.log("   7M                                                                           ");
    console.log("   MM                                                                           ");
    console.log("   MMpMMMb.   .gPeYa  `7Mb,od8  `7MMpMMMb.pMMMb.   .gPeYa   ,pPeYbd             ");
    console.log("   MM    MM  ,M'   Yb   MM'  e'   MM    MM    MM  ,M    Yb  8I                  ");
    console.log("   MM    MM  8M''''''   MM        MM    MM    MM  8M''''''  YMMMa.              ");
    console.log("   MM    MM  YM.    ,   MM        MM    MM    MM  YM.    ,  L.   I8     80b     ");
    console.log(" .JMML  JMML. `Mbmmd' .JMML.    .JMML  JMML  JMML. `Mbmmd'  M9mmmP'     e80     ");
    console.log("                                                                                ");
    console.log("                                                                                ");
    console.log("                                                                                ");
    console.log("                                                                                ");
    console.log("[INFO] System operation logs:");
})

