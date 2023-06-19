import express from "express";
import FileSystemHelper from "./helpers/file-system-helper";
import AuthHelper from "./helpers/auth-helper";

const app = express();

const PORT = FileSystemHelper.getAuthListenerPort();

let authHelper = AuthHelper.getInstance();

console.log(
  "Go to this link to authorize the app: " + authHelper.generateAuthLink()
);

app.get("/", async (req, res) => {
  const authHelper = AuthHelper.getInstance();
  FileSystemHelper.saveAuthToken(
    await authHelper.exchangeAuthCodeForTokens(req.query.code as string)
  );

  res.send("Authentication Successful!");
});

app.listen(PORT, () => {
  console.log(`⚡Server is running here 👉 http://localhost:${PORT}`);
});
