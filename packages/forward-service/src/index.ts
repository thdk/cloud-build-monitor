import { app } from "./app";

const PORT = parseInt(process.env.PORT || "8080");

app.listen(PORT, () => {
  console.log("Forward service is listening on Port", PORT);
});
