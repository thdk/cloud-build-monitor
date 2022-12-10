import { app } from "./app";

const PORT = parseInt(process.env.PORT || "8080");

app.listen(PORT, () => {
  console.log("Notification service is listening on Port", PORT);
});
