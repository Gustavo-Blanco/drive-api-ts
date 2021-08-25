import { OAuth2Client } from "google-auth-library";
import {google} from 'googleapis';

export class Drive {

    constructor(private auth : OAuth2Client) {
        
    }
    
    list = async () => {
        try {
            const drive = await google.drive({version:'v3',auth: this.auth});
            const list = await drive.files.list();
            return list;
        } catch (error) {
            
        }
    }
}