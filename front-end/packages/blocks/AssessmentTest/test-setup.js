// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

configure({ adapter: new Adapter() });
jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);

jest.mock('react-native-speedometer', () => 'RNSpeedometer');
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: jest.fn(), }));
jest.mock('react-native-elements', () => ({ normalize: jest.fn(), }));

