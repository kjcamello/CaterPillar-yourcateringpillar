import express from "express";
import cors from "cors";
import { sample_catering, sample_tags } from "./data";


const app = express();
app.use(cors({
    credentials:true,
    origin: ["http.//localhost:4200"]
}));

app.get("/api/foods", (req, res) => {
    res.send(sample_catering);
})

app.get("/api/foods/search/:searchTerm", (req, res) =>{
    const searchTerm = req.params.searchTerm;
    const foods = sample_catering
    .filter(Catering => Catering.name.toLowerCase()
    .includes(searchTerm.toLowerCase()))
    res.send(foods);
})     

app.get("/api/foods/tags", (req, res) => {
    res.send(sample_tags);
})

app.get("/api/foods/tag/:tagName", (req, res) => {
    const tagName = req.params.tagName;
    const foods = sample_catering
    .filter(Catering => Catering.tags?.includes(tagName));
    res.send(foods);
})

app.get("/api/foods/:cateringID", (req, res) => {
    const cateringID = req.params.cateringID;
    const catering = sample_catering
    .find(Catering => Catering.id == cateringID)
    res.send(catering);
})


const port = 5000;
app.listen(port, () => {
    console.log("Website served on http://localhost:" + port);  
})


