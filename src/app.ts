import { Google } from "./components/auth/Google";
import { OAuth2Client } from "google-auth-library";

const google = new Google("./credentials.json", "./token.json", [
  "https://www.googleapis.com/auth/drive.metadata.readonly",
]);

export const auth = async (): Promise<OAuth2Client> => {
  const credentials = await google.readCredentials();
  const oAuth2Client = await google.authorize(credentials!);
  return oAuth2Client;
};
