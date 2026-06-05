require('dotenv').config();
const express = require('express');
const connectDB = require('./db/db');

const app = express();
const PORT = process.env.PORT || 3000;

(async function () {
    try {
        await connectDB();
    } catch (err) {
        console.error('Something went wrong while connection DB');
        process.exit(1);
    }
})();

//Middlewares
app.use(express.json());

//Import routes
const userRouter = require('./routes/user.route');
const homeRouter = require('./routes/home.route');
const adminRouter = require('./routes/admin.route');

app.use('/api/users', userRouter);
app.use('/api/home', homeRouter);
app.use('/api/admin', adminRouter);

app.listen(PORT, () => {
    console.log(`App is listening on ${PORT}`);
});
