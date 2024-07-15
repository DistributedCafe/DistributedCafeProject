import express from "express";
import menuRouter from './routes/menu';

let app = express()
app.use(express.json())

//menu route
app.use('/menu', menuRouter)

// start server
let PORT = 8085

export const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
