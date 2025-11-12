// test-setup.js
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import mockAsyncStorage from '@react-native-async-storage/async-storage/jest/async-storage-mock';


jest.mock('@react-native-async-storage/async-storage', () => mockAsyncStorage);
jest.mock('react-native-responsive-screen', () => {
   function widthPercentageToDP(){};
    function heightPercentageToDP(){};
    return{
        widthPercentageToDP,
        heightPercentageToDP
    }
});
jest.mock('react-native-drawer', () => () => <></>);
jest.mock('react-native-star-rating',()=>jest.mock())
jest.mock('react-native-responsive-fontsize', () => {});
jest.mock('react-native-linear-gradient', () => {});
jest.mock('react-native-elements', () => {
    function normalize(){

    }
    return {
        normalize
    }
});
jest.mock('@videosdk.live/react-native-incallmanager', () => {});
jest.mock('react-native-modal-datetime-picker',()=>{})
jest.mock('react-native-datepicker', () => 'DatePickerIOs');
jest.mock('react-native-video', ()=>{})
jest.mock('react-native-easy-toast',()=>'Toast')
const moment = jest.fn(() => {
    return {
      isValid: jest.fn(() => true),
      isBefore: jest.fn(() => false),
      format: jest.fn(() => '2023-06-25'),
      add: jest.fn().mockReturnThis(),
    };
  });
  

configure({ adapter: new Adapter() });
