import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding books...');

  const books = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      description:
        'The Great Gatsby is a novel by American writer F. Scott Fitzgerald.',
      price: 50000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/61EtTpQI3vL._SL1360_.jpg',
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      description:
        'To Kill a Mockingbird is a novel by Harper Lee published in 1960.',
      price: 45000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/51tDHl8Z7cL.jpg',
    },
    {
      title: 'Enamórate de ti',
      author: 'Walter Riso',
      description:
        'Desde pequeños nos enseñan conductas de cuidado personal respecto al físico: lavarnos los dientes, bañarnos, arreglarnos las uñas, comer, aprender a vestirnos...',
      price: 45000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/719fMYMMSiL._SL1500_.jpg',
    },
    {
      title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
      author: 'Robert C. Martin',
      description:
        'Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees.',
      price: 145000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/81KpjloJJZL._SL1500_.jpg',
    },
    {
      title: 'The Pragmatic Programmer',
      author: 'David Thomas',
      description:
        'The Pragmatic Programmer is one of those rare tech audiobooks you’ll listen, re-listen, and listen to again over the years.',
      price: 95000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/91WFb-PpoNL._SL1500_.jpg',
    },
    {
      title: 'El Alquimista',
      author: 'Paulo Coelho',
      description:
        'TCuando una persona desea realmente algo, el Universo entero conspira para que pueda realizar su sueño. Basta con aprender a escuchar los dictados del corazón y a descifrar el lenguaje que está más allá de las palabras.',
      price: 75000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/71uljqFndcL._SL1500_.jpg',
    },
    {
      title: 'Cien años de soledad (50 Aniversario)',
      author: 'Gabriel García Márquez ',
      description:
        'En ocasión del 50 aniversario de la publicación de Cien años de soledad, llega una edición con ilustraciones inéditas de la artista chilena Luisa Rivera y con una tipografía creada por el hijo del autor, Gonzalo García Barcha.',
      price: 99000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/81QvZFjaI+L._SL1500_.jpg',
    },
    {
      title: 'El amor en los tiempos del cólera (Edición ilustrada)',
      author: 'Gabriel García Márquez ',
      description:
        'Una edición conmemorativa de El amor en los tiempos del cólera, un gran clásico de Gabriel García Márquez y una novela imprescindible de la literatura contemporánea.',
      price: 99000,
      stock: 100,
      image_url: 'https://m.media-amazon.com/images/I/91IxbReQwhL._SL1500_.jpg',
    },
  ];

  await prisma.products.createMany({ data: books });

  console.log('Books seeded successfully.');
}

main()
  .catch((e) => {
    console.error('Error seeding data:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
