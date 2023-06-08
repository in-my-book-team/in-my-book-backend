const v4 = jest.fn((): string => `test-id-${v4.mock.calls.length}`);

export { v4 };
