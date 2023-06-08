import nodemailer from 'nodemailer';
import handler from '../../../src/handlers/registration/handler';
import { dataSourceMethodsMocks } from '../../helpers/typeorm';
import { fixtures } from './fixtures';
import BadRequest from '../../../src/exceptions/bad-request';
import { ExceptionCodes } from '../../../src/exceptions/exception-codes';

describe('Handler - registration', () => {
  const sendMailMock = jest.spyOn(nodemailer.createTransport(), 'sendMail');

  beforeEach(() => {
    dataSourceMethodsMocks.execute.mockImplementation(() => ({
      raw: [fixtures.user],
    }));

    sendMailMock.mockImplementation(jest.fn());
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    jest.restoreAllMocks();
  });

  it('should return response', async () => {
    const result = await handler({
      ...fixtures.user,
      password: fixtures.password,
    });

    expect(result).toMatchSnapshot('handler result');
    expect(sendMailMock.mock.calls).toMatchSnapshot('send mail calls');
  });

  it(`should throw ${ExceptionCodes.BAD_REQUEST} exception if no arguments provided`, async () => {
    await expect(handler({} as Parameters<typeof handler>[0])).rejects.toThrow(
      BadRequest,
    );
  });
});
