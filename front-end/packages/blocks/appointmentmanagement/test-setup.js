// test-setup.js
import { configure } from 'enzyme';
import { Alert } from 'react-native';
import Adapter from 'enzyme-adapter-react-16';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';

jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-datepicker', () => 'DatePicker');
jest.mock('@ptomasroos/react-native-multi-slider', () => 'MultiSlider');
jest.mock('react-native-calendar-strip', () => 'CalendarStrip');
jest.spyOn(Alert, 'alert')

jest.mock('react-native-modal-datetime-picker',()=>{})
jest.mock('react-native-responsive-fontsize',()=>{})

configure({ adapter: new Adapter() });
