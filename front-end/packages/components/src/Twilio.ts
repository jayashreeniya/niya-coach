// @ts-nocheck
import { DocumentPickerResponse } from "react-native-document-picker";

const TWILIO_ACCOUNT_SID: string = "AC37a04cc7815e437bf8b59b331c3cc71f";
const TWILIO_AUTH_TOKEN: string = "1f07273dfab478e6ba22f6efe9288f02";

type RequestParams = {
  endpoint: string;
  method?: "GET" | "POST";
  body?: string | any;
  headers?: Record<string, string>;
}

class Twilio {

  baseURL: string;
  conversationId: string;
  chatId: string;
  meta: Record<string, any>;

  constructor(){
    this.baseURL = "https://conversations.twilio.com/v1";
  }

  request = async ({ endpoint, method, body, headers }: RequestParams) => {
    const requestHeaders = new Headers();
    const token = btoaEncoder(TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN);
    requestHeaders.append("Authorization", "Basic " + token);
    if(headers){
      Object.keys(headers).map(key => requestHeaders.append(key, headers[key]));
    }
    const url = endpoint.startsWith("https")? endpoint: `${this.baseURL}${endpoint}`;

    const options: Record<string, any> = {};
    options.headers = requestHeaders;
    options.method = method || "GET";
    if(method === "POST"){
      options.body = body;
    }

    try {
      const resp = await fetch(url, options);
      if(resp.status < 205){
        const data = await resp.json();
        return data;
      }
    } catch(e) {
      console.log("Errr: ", JSON.stringify(e));
      return {
        success: false,
        error: e
      }
    }
  }

  getMessages = async () => {
    try {
      const resp = await this.request({ endpoint: `/Conversations/${this.conversationId}/Messages` });
      if(resp.meta){
        this.meta = resp.meta;
      }
      return {
        success: true,
        ...resp
      };
    } catch(e) {}
    return {
      success: false
    }
  }

  sendMessage = async (body: string) => {
    if(!this.conversationId) return;
    try {
      const resp = await this.request({
        endpoint: `/Conversations/${this.conversationId}/Messages`,
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body
      });
      return {
        success: true,
        ...resp
      };
    } catch(e) {}
    return {
      success: false
    }
  }

  fileUpload = async (file: DocumentPickerResponse) => {
    const data = new FormData();
    data.append(file.name, {
      //@ts-ignore
      name: file.name,
      type: file.type || "image/jpeg",
      uri: file.fileCopyUri
    });
    const headers = {
      "Content-Type": file.type || "image/jpeg",
      "Content-Size": `${file.size}` || "0"
    }
    const resp = await this.request({
      endpoint: `https://mcs.us1.twilio.com/v1/Services/${this.chatId}/Media?Filename=${file.name}`,
      method: "POST",
      headers,
      body: file
    });
    return resp;
  }

  getMedia = async (mId: string): Promise<string> => {
    const data = await this.request({ endpoint: `https://mcs.us1.twilio.com/v1/Services/${this.chatId}/Media/${mId}` });
    if(data.sid){
      return data?.links?.content_direct_temporary;
    }
    return "";
  }

  getFile = async (sid: string) => {
    const requestHeaders = new Headers();
    const token = btoaEncoder(TWILIO_ACCOUNT_SID + ":" + TWILIO_AUTH_TOKEN);
    requestHeaders.append("Authorization", "Basic " + token);

    try {
      const data = await fetch(
        `https://mcs.us1.twilio.com/v1/Services/IS05d6b26ffe8a4e88a3fac4386b5c804c/Media/${sid}/Content`, {
          headers: requestHeaders
        }
      );
      return {
        success: true,
        data
      };
    } catch(err){
      return {
        success: false,
        error: err
      }
    }
  }

  setConversationId = (convSId: string, chatSId: string) => {
    this.conversationId = convSId;
    this.chatId = chatSId
  }

  nextPage = async  () => {
    if(this.meta.next_page_url){
      const data = await this.request({ endpoint: this.meta.next_page_url });
      return {
        success: true,
        ...data
      }
    }
    return {
      success: false
    }
  }

  previousPage = async  () => {
    if(this.meta.previous_page_url){
      const data = await this.request({ endpoint: this.meta.previous_page_url });
      return {
        success: true,
        ...data
      }
    }
    return {
      success: false
    }
  }
}

function btoaEncoder(string: string) {
  const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  const b64re = /^(?:[A-Za-z\d+\/]{4})*?(?:[A-Za-z\d+\/]{2}(?:==)?|[A-Za-z\d+\/]{3}=?)?$/;

  string = String(string);
  let bitmap, a, b, c,
      result = "", i = 0,
      rest = string.length % 3;

  for (; i < string.length;) {
      if ((a = string.charCodeAt(i++)) > 255
              || (b = string.charCodeAt(i++)) > 255
              || (c = string.charCodeAt(i++)) > 255)
          throw new TypeError("Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range.");

      bitmap = (a << 16) | (b << 8) | c;
      result += b64.charAt(bitmap >> 18 & 63) + b64.charAt(bitmap >> 12 & 63)
              + b64.charAt(bitmap >> 6 & 63) + b64.charAt(bitmap & 63);
  }

  return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
}

export default Twilio;