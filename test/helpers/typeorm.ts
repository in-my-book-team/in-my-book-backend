export const dataSourceMethodsMocks = {
  createQueryBuilder: jest.fn().mockReturnThis(),
  getRepository: jest.fn().mockReturnThis(),
  findOne: jest.fn(),
  insert: jest.fn().mockReturnThis(),
  into: jest.fn().mockReturnThis(),
  values: jest.fn().mockReturnThis(),
  returning: jest.fn().mockReturnThis(),
  execute: jest.fn(),
  select: jest.fn().mockReturnThis(),
  from: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  getOne: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  manager: {
    save: jest.fn().mockReturnThis(),
  },
};
