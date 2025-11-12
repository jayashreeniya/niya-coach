export default {
  openPicker: jest
  .fn(() => Promise.resolve(result)) // default implementation
  .mockImplementationOnce(() => Promise.reject(result)) // first time is called
  .mockImplementationOnce(() => Promise.resolve(result)), // second time is called
  };