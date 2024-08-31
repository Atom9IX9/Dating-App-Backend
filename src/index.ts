import app from "./app";

const PORT = process.env.PORT || 5000;

const runServer = async () => {
  app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}`);
  });
};

runServer();