import dotenv from "dotenv";

dotenv.config();

const { default: connectDB } = await import("./src/db/db.js");
const { default: app } = await import("./src/app.js");

connectDB();

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
