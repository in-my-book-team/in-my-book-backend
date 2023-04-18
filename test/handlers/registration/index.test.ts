describe('Handler - registration - HTTP', () => {
  it('should return response', async () => {
    const result = await handler();

    expect(result).toMatchSnapshot();
  });
});
