import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Studio } from './studio.entity';

const SEED_STUDIOS = [
  {
    name: 'Ink Starter Studio',
    description:
      'Estudio especializado en blackwork y fine line. Especialidades: blackwork, línea fina, geométrico. Instagram: @inkstartercali',
    city: 'Cali',
    address: 'San Fernando',
    logoUrl: '/images/logos/ink-starter-studio.png',
    rating: 4.5,
    priceRange: '$30k - $80k',
    latitude: 3.451,
    longitude: -76.531,
  },
  {
    name: 'Mini Tattoo Cali',
    description:
      'Expertos en mini tatuajes con máximo detalle. Especialidades: neotradicional, floral, miniaturas. Instagram: @minitattoo_cali',
    city: 'Cali',
    address: 'Granada',
    logoUrl: '/images/logos/mini-tattoo-cali.png',
    rating: 4.3,
    priceRange: '$20k - $60k',
    latitude: 3.452,
    longitude: -76.532,
  },
  {
    name: 'Fine Line Studio',
    description:
      'Especialistas en línea fina, lettering y geométrico. Especialidades: fine line, lettering, puntillismo. Instagram: @fineline_studio',
    city: 'Cali',
    address: 'Ciudad Jardín',
    logoUrl: '/images/logos/fine-line-studio.png',
    rating: 4.7,
    priceRange: '$50k - $150k',
    latitude: 3.453,
    longitude: -76.533,
  },
  {
    name: 'Neo Art Studio',
    description:
      'Arte neotradicional, acuarela y realismo a color. Especialidades: acuarela, neotradicional, color. Instagram: @neoart_studio',
    city: 'Cali',
    address: 'El Peñón',
    logoUrl: '/images/logos/neo-art-studio.png',
    rating: 4.6,
    priceRange: '$40k - $120k',
    latitude: 3.454,
    longitude: -76.534,
  },
  {
    name: 'Black House Tattoo',
    description:
      'Estudio oscuro especializado en blackwork y horror. Especialidades: blackwork, horror, geometría. Instagram: @blackhouse_tattoo',
    city: 'Cali',
    address: 'San Antonio',
    logoUrl: '/images/logos/black-house-tattoo.png',
    rating: 4.2,
    priceRange: '$35k - $90k',
    latitude: 3.455,
    longitude: -76.535,
  },
  {
    name: 'Real Ink Tattoo',
    description:
      'Realismo y retratos con alta fidelidad. Especialidades: realismo, retratos, hiperrealismo. Instagram: @realink_tattoo',
    city: 'Cali',
    address: 'Norte',
    logoUrl: '/images/logos/real-ink-tattoo.png',
    rating: 4.8,
    priceRange: '$60k - $200k',
    latitude: 3.456,
    longitude: -76.536,
  },
  {
    name: 'Ink Master',
    description:
      'Estudio líder en tatuaje tradicional, blackwork y neo tradicional. Especialidades: blackwork, tradicional, neo tradicional. Instagram: @inkmaster_cali',
    city: 'Cali',
    address: 'Centro',
    logoUrl: '/images/logos/ink-master.png',
    rating: 4.6,
    priceRange: '$40k - $120k',
    latitude: 3.457,
    longitude: -76.537,
  },
  {
    name: 'Black Ink Studio',
    description:
      'Especialistas en blackwork, realismo y estilo oscuro. Especialidades: blackwork, realismo, retratos. Instagram: @blackink_studio',
    city: 'Cali',
    address: 'Sur',
    logoUrl: '/images/logos/black-ink.png',
    rating: 4.4,
    priceRange: '$30k - $100k',
    latitude: 3.458,
    longitude: -76.538,
  },
];

@Injectable()
export class StudioService implements OnModuleInit {
  constructor(
    @InjectRepository(Studio)
    private readonly studioRepository: Repository<Studio>,
  ) {}

  async onModuleInit() {
    const count = await this.studioRepository.count();
    if (count === 0) {
      await this.studioRepository.save(SEED_STUDIOS);
    }
  }

  async findAll(): Promise<Studio[]> {
    return this.studioRepository.find({ order: { name: 'ASC' } });
  }

  async findById(id: number): Promise<Studio> {
    const studio = await this.studioRepository.findOneBy({ id });
    if (!studio) {
      throw new NotFoundException(`Estudio ${id} no encontrado`);
    }
    return studio;
  }

  async findByPriceRange(min: number, max: number): Promise<Studio[]> {
    const all = await this.studioRepository.find({ order: { name: 'ASC' } });
    return all.filter((s) => {
      const range = s.priceRange;
      if (!range) return false;
      const nums = range.match(/\d+/g);
      if (!nums || nums.length < 2) return false;
      const rangeMin = parseInt(nums[0], 10) * 1000;
      const rangeMax = parseInt(nums[1], 10) * 1000;
      return rangeMin >= min && rangeMax <= max;
    });
  }

  async findByLocation(
    city?: string,
    lat?: number,
    lng?: number,
  ): Promise<Studio[]> {
    if (city) {
      return this.studioRepository.find({
        where: { city },
        order: { name: 'ASC' },
      });
    }
    const all = await this.studioRepository.find({ order: { name: 'ASC' } });
    if (lat !== undefined && lng !== undefined) {
      return all
        .map((s) => ({
          ...s,
          _distance: Math.sqrt(
            Math.pow((s.latitude ?? 0) - lat, 2) +
              Math.pow((s.longitude ?? 0) - lng, 2),
          ),
        }))
        .sort((a, b) => (a as any)._distance - (b as any)._distance)
        .map(({ _distance, ...s }) => s as Studio);
    }
    return all;
  }
}
