import "dotenv/config";
import express from "express";
import cors from "cors";
import usersRoutes from "./routes/users.routes";
import postsRoutes from "./routes/posts.routes";

const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(cors());

app.use(usersRoutes);
app.use(postsRoutes);

app.use((_req, res) => {
  res.status(404).json({
    message: "endpoint not found",
  });
});

app.listen(PORT, () => {
  console.log("Server listening on PORT", PORT);
});
