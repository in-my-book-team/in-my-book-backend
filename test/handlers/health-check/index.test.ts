import handler from '../../../src/handlers/health-check';

describe('Handler - health-check', () => {
  it('should return response', async () => {
    const result = await handler();

    expect(result).toMatchSnapshot();
  });
});
