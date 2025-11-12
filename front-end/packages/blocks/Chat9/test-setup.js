// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Linking } from "react-native"

configure({ adapter: new Adapter() });

jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'macos',
    select: () => null
}));

jest.mock('react-native-document-picker', () => ({ default: jest.fn(), }));

jest.mock("react-native/Libraries/Linking/Linking", () => ({
	openURL: jest.fn(() => Promise.resolve("mockResolve")),
}))


jest.mock('react-native-linear-gradient', () => 'LinearGradient');
jest.mock('react-native-responsive-fontsize', () => ({ RFValue: jest.fn(), }));

jest.mock('react-native-elements', () => ({ normalize: jest.fn(), }));

jest.mock('react-native-modal-datetime-picker', () => 'DateTimePickerModal');
jest.mock('react-native-datepicker', () => 'DatePickerIOs');
