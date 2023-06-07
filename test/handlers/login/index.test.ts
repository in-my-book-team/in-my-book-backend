import bcrypt from 'bcrypt';
import handler from '../../../src/handlers/login/handler';
import { dataSourceMethodsMocks } from '../../helpers/typeorm';
import { fixtures } from './fixtures';
import BadRequest from '../../../src/exceptions/bad-request';
import { ExceptionCodes } from '../../../src/exceptions/exception-codes';

describe('Handler - login', () => {
  const compareMock = jest.spyOn(bcrypt, 'compare');

  beforeEach(() => {
    dataSourceMethodsMocks.getOne.mockImplementation(() => ({
      ...fixtures.user,
    }));

    compareMock.mockImplementation(jest.fn(() => true));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should return response', async () => {
    const result = await handler(fixtures);

    expect(result).toMatchSnapshot();
  });

  it(`should throw ${ExceptionCodes.BAD_REQUEST} exception if no arguments provided`, async () => {
    await expect(handler({} as Parameters<typeof handler>[0])).rejects.toThrow(
      BadRequest,
    );
  });
});
