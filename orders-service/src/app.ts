import express from "express";
import ordersRouter from './routes/orders';

let app = express()
app.use(express.json())

//orders route
app.use('/orders', ordersRouter)

// start server
let PORT = 8090

export const server = app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});

