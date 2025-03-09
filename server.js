const express = require("express");
const app = express();
const PORT = 3000;

const songsRouter = require("./routes/songs");

app.use(express.json()); 
app.use(express.static("public")); 

app.use("/songs", songsRouter);

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
