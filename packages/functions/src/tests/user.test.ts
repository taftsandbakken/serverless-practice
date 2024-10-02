import * as user from '../user';
import { User } from "../../../core/src/user";
import * as helper from "../../../core/src/helper";

const mockEventWithAllFields = {
  pathParameters: { 
    userID: '123'
  },
  body: JSON.stringify({ userName: 'TJ', dob: '07/20/1985', emails: ['a@gmail.com'] }),
};

const mockEventWithMissingFields = {
  body: JSON.stringify({ dob: '07/20/1985', emails: ['a@gmail.com'] }),
};

const mockEventWithJustUserID = {
  pathParameters: { 
    userID: '123'
  },
  body: JSON.stringify({}), 
};

const mockEventWithTooManyEmails = {
  body: JSON.stringify({ userName: 'TJ', dob: '07/20/1985', emails: ['1@gmail.com','2@gmail.com','3@gmail.com','4@gmail.com'] }),
};

let getBodyPropertiesHelperMock;
let getUniqueStringsFromListHelperMock;
let isValidEmailLengthHelperMock;
let getUserResponseHelperMock;
let getErrorHelperMock;
let isValidQueryParamsMock;
let getUniqueStringsFromListMock;

let createUserMock;
let getUserMock;
let updateUserMock;
let deleteUserMock;

beforeEach(() => {
  getBodyPropertiesHelperMock = jest.spyOn(helper, 'getBodyProperties');
  getBodyPropertiesHelperMock.mockImplementation((arg: any) => { return { userName: '', dob: '', emails: [] }});

  getUniqueStringsFromListHelperMock = jest.spyOn(helper, 'getUniqueStringsFromList');
  getUniqueStringsFromListHelperMock.mockImplementation((arg: any) => { return ['']});

  isValidEmailLengthHelperMock = jest.spyOn(helper, 'isValidEmailLength');
  isValidEmailLengthHelperMock.mockImplementation((arg: any) => { return true });

  isValidQueryParamsMock = jest.spyOn(helper, 'isValidQueryParams');
  isValidQueryParamsMock.mockImplementation((arg: any) => { return true });

  getUniqueStringsFromListMock = jest.spyOn(helper, 'getUniqueStringsFromList');
  getUniqueStringsFromListMock.mockImplementation((arg: any) => { return [''] });

  getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
  getUserResponseHelperMock.mockImplementation((arg: any) => { return {} as any });

  getErrorHelperMock = jest.spyOn(helper, 'getError');
  getErrorHelperMock.mockImplementation((arg: any) => { return {} as any });

  createUserMock = jest.spyOn(User, 'createUser');
  createUserMock.mockImplementation((arg: any) => { return {} as any });

  getUserMock = jest.spyOn(User, 'getUser');
  getUserMock.mockImplementation((arg: any) => { return {} as any });

  updateUserMock = jest.spyOn(User, 'updateUser');
  updateUserMock.mockImplementation((arg: any) => { return {} as any });

  deleteUserMock = jest.spyOn(User, 'deleteUser');
  deleteUserMock.mockImplementation((arg: any) => { return {} as any });
});

describe('createUser Tests', () => {
  test('should handle too many emails', async () => {
    isValidEmailLengthHelperMock = jest.spyOn(helper, 'isValidEmailLength');
    isValidEmailLengthHelperMock.mockImplementation((arg: any) => { return false });
    
    const result: any = await user.createUser(mockEventWithTooManyEmails as any, {} as any, () => null);
    expect(result.statusCode).toBe(helper.TOO_MANY_EMAILS_RESPONSE.statusCode);
    expect(result.body).toBe(helper.TOO_MANY_EMAILS_RESPONSE.body);
  });

  test('should handle happy case', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.createUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getUserResponseHelperMock).toHaveBeenCalled();
  });

  test('should handle exception', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { throw '' });

    getErrorHelperMock = jest.spyOn(helper, 'getError');
    getErrorHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.createUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getErrorHelperMock).toHaveBeenCalled();
  });
});

describe('getUser Tests', () => {
  test('should handle missing userID', async () => {
    const result: any = await user.getUser(mockEventWithMissingFields as any, {} as any, () => null);
    expect(result.statusCode).toBe(helper.USERID_IS_REQUIRED_RESPONSE.statusCode);
    expect(result.body).toBe(helper.USERID_IS_REQUIRED_RESPONSE.body);
  });

  test('should handle happy case', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.getUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getUserResponseHelperMock).toHaveBeenCalled();
  });

  test('should handle exception', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { throw '' });

    getErrorHelperMock = jest.spyOn(helper, 'getError');
    getErrorHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.getUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getErrorHelperMock).toHaveBeenCalled();
  });
});

describe('updateUser Tests', () => {
  test('should handle missing userID', async () => {
    const result: any = await user.updateUser(mockEventWithMissingFields as any, {} as any, () => null);
    expect(result.statusCode).toBe(helper.MISSING_REQUIRED_PARAMS_RESPONSE.statusCode);
    expect(result.body).toBe(helper.MISSING_REQUIRED_PARAMS_RESPONSE.body);
  });

  test('should handle missing fields', async () => {
    isValidQueryParamsMock = jest.spyOn(helper, 'isValidQueryParams');
    isValidQueryParamsMock.mockImplementation((arg: any) => { return false });

    const result: any = await user.updateUser(mockEventWithJustUserID as any, {} as any, () => null);
    expect(result.statusCode).toBe(helper.MISSING_REQUIRED_PARAMS_RESPONSE.statusCode);
    expect(result.body).toBe(helper.MISSING_REQUIRED_PARAMS_RESPONSE.body);
  });

  test('should handle too many emails', async () => {
    isValidEmailLengthHelperMock = jest.spyOn(helper, 'isValidEmailLength');
    isValidEmailLengthHelperMock.mockImplementation((arg: any) => { return false });

    const result: any = await user.updateUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(result.statusCode).toBe(helper.TOO_MANY_EMAILS_RESPONSE.statusCode);
    expect(result.body).toBe(helper.TOO_MANY_EMAILS_RESPONSE.body);
  });

  test('should handle happy case', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.updateUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getUserResponseHelperMock).toHaveBeenCalled();
  });

  test('should handle exception', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { throw '' });

    getErrorHelperMock = jest.spyOn(helper, 'getError');
    getErrorHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.updateUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getErrorHelperMock).toHaveBeenCalled();
  });
});

describe('deleteUser Tests', () => {
  test('should handle missing userID', async () => {
    const result: any = await user.deleteUser(mockEventWithMissingFields as any, {} as any, () => null);
    expect(result.statusCode).toBe(helper.USERID_IS_REQUIRED_RESPONSE.statusCode);
    expect(result.body).toBe(helper.USERID_IS_REQUIRED_RESPONSE.body);
  });

  test('should handle happy case', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.deleteUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getUserResponseHelperMock).toHaveBeenCalled();
  });

  test('should handle exception', async () => {    
    getUserResponseHelperMock = jest.spyOn(helper, 'getUserResponse');
    getUserResponseHelperMock.mockImplementation((arg: any) => { throw '' });

    getErrorHelperMock = jest.spyOn(helper, 'getError');
    getErrorHelperMock.mockImplementation((arg: any) => { return {} as any });

    await user.deleteUser(mockEventWithAllFields as any, {} as any, () => null);
    expect(getErrorHelperMock).toHaveBeenCalled();
  });
});
