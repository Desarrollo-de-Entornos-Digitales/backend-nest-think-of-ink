import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { permissionService } from './permission.service';
import { Permission } from './permission.entity';

describe('permissionService', () => {
  let service: permissionService;

  // 1. MOCK DEL REPOSITORIO DE PERMISOS
  const mockPermissionRepository = {
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
        permissionService,
        {
          provide: getRepositoryToken(Permission),
          useValue: mockPermissionRepository,
        },
      ],
    }).compile();

    service = module.get<permissionService>(permissionService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // --- PRUEBA: CREATE ---
  describe('create', () => {
    it('debe crear y guardar un nuevo permiso', async () => {
      const dto = { name: 'WRITE_POSTS', description: 'Permite crear nuevos posts' };
      const savedPermission = { id: 1, ...dto };

      mockPermissionRepository.create.mockReturnValue(dto);
      mockPermissionRepository.save.mockResolvedValue(savedPermission);

      const result = await service.create(dto as any);

      expect(result).toEqual(savedPermission);
      expect(mockPermissionRepository.create).toHaveBeenCalledWith(dto);
      expect(mockPermissionRepository.save).toHaveBeenCalledWith(dto);
    });
  });

  // --- PRUEBA: FIND ALL ---
  describe('findAll', () => {
    it('debe retornar un arreglo de permisos', async () => {
      const permissions = [
        { id: 1, name: 'READ_POSTS' },
        { id: 2, name: 'DELETE_POSTS' }
      ];
      mockPermissionRepository.find.mockResolvedValue(permissions);

      const result = await service.findAll();

      expect(result).toEqual(permissions);
      expect(mockPermissionRepository.find).toHaveBeenCalled();
    });
  });

  // --- PRUEBA: FIND BY ID ---
  describe('findById', () => {
    it('debe retornar un permiso por su ID', async () => {
      const permission = { id: 1, name: 'UPDATE_PROFILE' };
      mockPermissionRepository.findOneBy.mockResolvedValue(permission);

      const result = await service.findById(1);

      expect(result).toEqual(permission);
      expect(mockPermissionRepository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });
  });

  // --- PRUEBA: UPDATE ---
  describe('update', () => {
    it('debe actualizar un permiso y devolver el objeto actualizado', async () => {
      const id = 1;
      const dto = { description: 'Descripción actualizada' };
      const updatedPermission = { id, name: 'ADMIN', ...dto };

      mockPermissionRepository.update.mockResolvedValue({ affected: 1 });
      mockPermissionRepository.findOneBy.mockResolvedValue(updatedPermission);

      const result = await service.update(id, dto as any);

      expect(result).toEqual(updatedPermission);
      expect(mockPermissionRepository.update).toHaveBeenCalledWith(id, dto);
      expect(mockPermissionRepository.findOneBy).toHaveBeenCalledWith({ id });
    });
  });

  // --- PRUEBAS: REMOVE ---
  describe('remove', () => {
    it('debe retornar el ID si el permiso fue eliminado', async () => {
      mockPermissionRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.remove(1);

      expect(result).toEqual({ id: 1 });
      expect(mockPermissionRepository.delete).toHaveBeenCalledWith(1);
    });

    it('debe retornar null si el permiso a eliminar no existe', async () => {
      mockPermissionRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.remove(999);

      expect(result).toBeNull();
    });
  });
});