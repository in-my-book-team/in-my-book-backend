import handler from '../../../src/handlers/health-check';
import { handlerName } from '../../../src/handlers/health-check/handler';

describe(`Handler - ${handlerName} - HTTP`, () => {
  it('should return response', async () => {
    const result = await handler();

    expect(result).toMatchSnapshot();
  });
});
