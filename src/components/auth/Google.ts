import fs from "fs/promises";
import { ICredentialsType } from "./interface";
import { google } from "googleapis";
import { OAuth2Client } from "google-auth-library";
import readline from "readline";

export class Google {
  private CREDENTIALS_PATH: string;
  private TOKEN_PATH: string;

  constructor(
    credentials_path: string,
    token_path: string,
    private SCOPES?: string[]
  ) {
    this.CREDENTIALS_PATH = credentials_path;
    this.TOKEN_PATH = token_path;
  }

  async readCredentials(): Promise<ICredentialsType | void> {
    try {
      const credentials = await fs.readFile(this.CREDENTIALS_PATH);
      return (await JSON.parse(credentials.toString())) as ICredentialsType;
    } catch (error) {
      console.log(`Error loading client secret file: ${error}`);
    }
  }

  async authorize(credentials: ICredentialsType): Promise<OAuth2Client> {
    const { client_secret, client_id, redirect_uris } = credentials.web;
    const oAuth2Client = new google.auth.OAuth2(
      client_id,
      client_secret,
      redirect_uris[0]
    );

    try {
      const token = await fs.readFile(this.TOKEN_PATH);
      await oAuth2Client.setCredentials(JSON.parse(token.toString()));
      return oAuth2Client;
    } catch (error) {
      return await this.getAccessToken(oAuth2Client)!;
    }
  }

  async getAccessToken(oAuth2Client: OAuth2Client): Promise<OAuth2Client> {
    const authUrl = await oAuth2Client.generateAuthUrl({
      access_type: "offline",
      scope: this.SCOPES,
    });

    console.log(`Authorize this app by visiting this url: ${authUrl}`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    rl.question("Enter the code from that page here:", async (code) => {
      rl.close();
      const token = await oAuth2Client.getToken(code);
      await oAuth2Client.setCredentials(token.tokens);
      await fs.writeFile(this.TOKEN_PATH, JSON.stringify(token));
      console.log(`Token stored in ${this.TOKEN_PATH}`);
      return oAuth2Client;
    });
    return oAuth2Client;
  }
}
