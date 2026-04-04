import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RolesService } from './roles.service';
import { Role } from './role.entity';

describe('RolesService', () => {
  let service: RolesService;

  // 1. MOCK DEL REPOSITORIO DE ROLES
  const mockRoleRepository = {
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOneBy: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolesService,
        {
          provide: getRepositoryToken(Role),
          useValue: mockRoleRepository,
        },
      ],
    }).compile();

    service = module.get<RolesService>(RolesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBA: CREATE ---
  describe('create', () => {
    it('debe crear y guardar un nuevo rol', async () => {
      const dto = { name: 'Admin' };
      const savedRole = { id: 1, ...dto };

      mockRoleRepository.create.mockReturnValue(dto);
      mockRoleRepository.save.mockResolvedValue(savedRole);

      const result = await service.create(dto as any);

      expect(result).toEqual(savedRole);
      expect(mockRoleRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRoleRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // --- PRUEBA: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar todos los roles', async () => {
      const roles = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'User' }
      ];
      mockRoleRepository.find.mockResolvedValue(roles);

      const result = await service.findAll();

      expect(result).toEqual(roles);
      expect(mockRoleRepository.find).toHaveBeenCalled();
    });
  });

  // --- PRUEBA: FIND BY ID ---
  describe('findById', () => {
    it('debe retornar un rol por ID', async () => {
      const role = { id: 1, name: 'Tatuador' };
      mockRoleRepository.findOneBy.mockResolvedValue(role);

      const result = await service.findById(1);

      expect(result).toEqual(role);
      expect(mockRoleRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // --- PRUEBA: UPDATE ---
  describe('update', () => {
    it('debe actualizar el rol y retornar el objeto actualizado', async () => {
      const id = 1;
      const dto = { name: 'SuperAdmin' };
      const updatedRole = { id, ...dto };

      mockRoleRepository.update.mockResolvedValue({ affected: 1 });
      mockRoleRepository.findOneBy.mockResolvedValue(updatedRole);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(updatedRole);
      expect(mockRoleRepository.update).toHaveBeenCalledWith(id, dto);
      expect(mockRoleRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  // --- PRUEBAS: REMOVE ---
  describe('remove', () => {
    it('debe retornar el ID si el rol fue eliminado', async () => {
      mockRoleRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockRoleRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debe retornar null si el rol no existe', async () => {
      mockRoleRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toBeNull();
    });
  });
});