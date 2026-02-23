import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../src/generated/prisma/client.js'
import { products } from '@/config/mockProducts.js';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({ adapter })

async function main() {
  for (const product of products) {
    const createdProduct = await prisma.product.create({
      data: {
        productId: product.productId,
        productName: product.productName,
        slug: product.productName.toLowerCase().replace(/\s+/g, '-'),
        description: product.description,
        productPrice: product.productPrice,
        originalPrice: product.originalPrice,
        quantity: product.quantity,
        inStock: product.inStock,
        label: product.label,
        customizations: product.customizations ? product.customizations : undefined,
        createdAt: product.createdAt ? new Date(product.createdAt) : undefined, 
        updatedAt: new Date(),
        productImages: {
          create: product.productImages.map(url => ({ url }))
        }
      }
    });
    console.log(`Inserted product: ${createdProduct.productName}`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
