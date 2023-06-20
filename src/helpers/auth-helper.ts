import { google } from "googleapis";
import { Credentials, OAuth2Client } from "google-auth-library";
import FileSystemHelper from "./file-system-helper";
import ClientData from "../types/client-data";

export default class AuthHelper {
  private oauth2Client: OAuth2Client;
  private static instance: AuthHelper;

  private constructor() {
    const clientData: ClientData = FileSystemHelper.getClientData();

    this.oauth2Client = new google.auth.OAuth2(
      clientData.clientId,
      clientData.clientSecret,
      clientData.redirectUri
    );
  }

  static getInstance = (): AuthHelper => {
    if (!this.instance) {
      this.instance = new AuthHelper();
      return this.instance;
    }
    return this.instance;
  };

  exchangeAuthCodeForTokens = async (
    authCode: string
  ): Promise<Credentials> => {
    let { tokens }: { tokens: Credentials } = await this.oauth2Client.getToken(
      authCode
    );
    return tokens;
  };

  generateAuthLink = (scopes: string[]): URL => {
    const authorizationUrl = this.oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
      include_granted_scopes: true,
    });

    return new URL(authorizationUrl);
  };
}
