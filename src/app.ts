import express from 'express';
import authRoutes from './routes/authRoute';
import fileRoutes from './routes/fileroutes';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);


app.get('/', (req, res) => {
    res.send('API is running');
});
// Error handling middleware
app.use((err: any, req: any, res: any, next: any) => {
    console.error(err.stack);
    res.status(500).send({ error: "Something went wrong" });
});

export default app;