const PORT = process.env.PORT || 5000;
import app from "./app";

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", PORT);
});

module.exports = app;
