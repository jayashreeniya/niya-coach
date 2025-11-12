// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

configure({ adapter: new Adapter() });

jest.mock("react-native-linear-gradient", () => () => <></>);
jest.mock("react-native-elements", () => ({
    normalize: jest.fn()
}));
jest.mock("react-native-gifted-chat", () => ({
    GiftedChat: () => <></>, 
    Bubble: () => <></>, 
    Send: () => <></>,  
    InputToolbar: () => <></>, 
}))

jest.mock("react-native-responsive-fontsize", () => ({
    RFValue: jest.fn()
}))

