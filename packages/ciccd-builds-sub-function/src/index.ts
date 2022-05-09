import { app } from "./app";

const PORT = parseInt(process.env.PORT || "8080");

app.listen(PORT, () => {
  console.log("CICCD service is listening on Port", PORT);
});
