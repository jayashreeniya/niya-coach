// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mock from 'react-native-permissions/mock';
configure({ adapter: new Adapter() });

jest.mock('react-native-permissions', () => {
    return mock;
});


jest.mock('react-native/Libraries/Utilities/Platform', () => ({
    OS: 'macos',
    select: () => null
}));