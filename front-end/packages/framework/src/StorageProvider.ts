import AsyncStorage from '@react-native-async-storage/async-storage';

export default class StorageProvider {
  static async set(key: string, value: any) {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.log(error);
    }
  }

  static async get(key: string): Promise<string> {
    try {
      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        return value;
      }
    } catch (error) {
      console.log(error);
    }
    return '';
  }

  static async remove(key: string) {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log(error);
    }
  }
}
