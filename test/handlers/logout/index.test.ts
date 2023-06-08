import bcrypt from 'bcrypt';
import handler from '../../../src/handlers/logout/handler';
import { fixtures } from './fixtures';
import BadRequest from '../../../src/exceptions/bad-request';
import { ExceptionCodes } from '../../../src/exceptions/exception-codes';

describe('Handler - logout', () => {
  const compareMock = jest.spyOn(bcrypt, 'compare');

  beforeEach(() => {
    compareMock.mockImplementation(jest.fn(() => true));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should return response', async () => {
    const result = await handler(fixtures.refreshToken);

    expect(result).toEqual(undefined);
  });

  it(`should throw ${ExceptionCodes.BAD_REQUEST} exception if no arguments provided`, async () => {
    await expect(handler('' as Parameters<typeof handler>[0])).rejects.toThrow(
      BadRequest,
    );
  });
});
