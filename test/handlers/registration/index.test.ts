import handler from '../../../src/handlers/registration/handler';
import { fixtures } from './fixtures';

describe('Handler - registration - HTTP', () => {
  it('should return response', async () => {
    const result = await handler(fixtures);

    expect(result).toMatchSnapshot();
  });
});
