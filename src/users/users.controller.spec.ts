import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  // 1. Definimos el Mock del Servicio
  // Aquí ponemos los nombres de los métodos que tiene tu UsersService
  const mockUsersService = {
    create: jest.fn((dto) => {
      return { id: 1, ...dto };
    }),
    findAll: jest.fn(() => {
      return [{ id: 1, email: 'test@test.com' }];
    }),
    findById: jest.fn((id) => {
      return { id, email: 'test@test.com' };
    }),
    update: jest.fn((id, dto) => {
      return { id, ...dto };
    }),
    remove: jest.fn((id) => {
      return { affected: 1 };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          // "Cuando el controlador pida UsersService, dale el mockUsersService"
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // --- TEST: CREATE ---
  describe('create', () => {
    it('debe llamar al servicio para crear un usuario', async () => {
      const dto = { email: 'nuevo@test.com', password: '123' };
      const result = await controller.create(dto as any);

      expect(result).toEqual({ id: 1, ...dto });
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  // --- TEST: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar un arreglo de usuarios', async () => {
      const result = await controller.findAll();
      
      expect(result).toEqual([{ id: 1, email: 'test@test.com' }]);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  // --- TEST: FIND BY ID ---
  describe('findOne', () => {
    it('debe retornar un usuario por su ID', async () => {
      const id = "1";
      const result = await controller.findById(+id); // Usamos + para convertir a número si es necesario

      expect(result).toEqual({ id: 1, email: 'test@test.com' });
      expect(service.findById).toHaveBeenCalled();
    });
  });

  // --- TEST: REMOVE ---
  describe('remove', () => {
    it('debe llamar al servicio para eliminar un usuario', async () => {
      const id = "1";
      await controller.remove(+id);
      
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});