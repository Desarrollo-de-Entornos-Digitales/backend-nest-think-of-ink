import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersService', () => {
  let service: UsersService;

  // 1. MOCK DEL REPOSITORIO DE USUARIOS
  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBA: CREATE ---
  describe('create', () => {
    it('debe crear y guardar un nuevo usuario', async () => {
      const dto = { email: 'user@test.com', password: '123' };
      const savedUser = { id: 1, ...dto };

      mockUserRepository.create.mockReturnValue(dto);
      mockUserRepository.save.mockResolvedValue(savedUser);

      const result = await service.create(dto as any);

      expect(result).toEqual(savedUser);
      expect(mockUserRepository.create).toHaveBeenCalledWith(dto);
      expect(mockUserRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // --- PRUEBA: FIND BY EMAIL ---
  describe('findByEmail', () => {
    it('debe retornar un usuario si el email coincide', async () => {
      const email = 'test@gmail.com';
      const mockUser = { id: 1, email };
      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail(email);

      expect(result).toEqual(mockUser);
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({ where: { email } });
    });
  });

  // --- PRUEBA: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar una lista de usuarios', async () => {
      const users = [{ id: 1, email: 'a@a.com' }];
      mockUserRepository.find.mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(mockUserRepository.find).toHaveBeenCalled();
    });
  });

  // --- PRUEBA: FIND BY ID ---
  describe('findById', () => {
    it('debe retornar un usuario por ID', async () => {
      const user = { id: 1, email: 'b@b.com' };
      mockUserRepository.findOneBy.mockResolvedValue(user);

      const result = await service.findById(1);

      expect(result).toEqual(user);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // --- PRUEBA: UPDATE ---
  describe('update', () => {
    it('debe actualizar el usuario y devolver el nuevo objeto', async () => {
      const id = 1;
      const dto = { email: 'new@test.com' };
      const updatedUser = { id, ...dto };

      mockUserRepository.update.mockResolvedValue({ affected: 1 });
      mockUserRepository.findOneBy.mockResolvedValue(updatedUser);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.update).toHaveBeenCalledWith(id, dto);
    });
  });

  // --- PRUEBA: REMOVE ---
  describe('remove', () => {
    it('debe llamar al método delete con el ID correcto', async () => {
      mockUserRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ affected: 1 });
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });
  });
});