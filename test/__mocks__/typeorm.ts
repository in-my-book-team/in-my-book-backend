// eslint-disable-next-line import/no-import-module-exports
import { dataSourceMethodsMocks } from '../helpers/typeorm';

const typeorm: any = jest.requireActual('typeorm');

const mockConstructor = jest.fn(() => dataSourceMethodsMocks);

module.exports = {
  ...typeorm,
  DataSource: jest.fn().mockImplementation(mockConstructor),
};
