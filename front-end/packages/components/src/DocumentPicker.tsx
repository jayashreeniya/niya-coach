import DocumentPicker, { DocumentPickerResponse } from "react-native-document-picker";

export const selectDocument = async (): Promise<false | DocumentPickerResponse> => {
  try {
    const document = await DocumentPicker.pickSingle({
      type: [DocumentPicker.types.images, DocumentPicker.types.pdf],
      copyTo: "cachesDirectory"
    })
    return document;
  } catch(err) {
    console.log("Doc Err: ", err);
  }
  return false;
}