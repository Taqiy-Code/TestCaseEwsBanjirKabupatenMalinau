import fs from 'fs';
import path from 'path';
import { PrismaClient, Sensor, SensorReading } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const prismaAdapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: prismaAdapter });

async function main(){
    console.log("Memulai Seeding Database...")
    
    const sensors: Sensor[] = [
        { id: 'WL-001', name: 'Sungai Malinau', location: 'Malinau Kota', siaga_threshold: 200, waspada_threshold: 250, awas_threshold: 300 },
        { id: 'WL-002', name: 'Sungai Sesayap', location: 'Mentarang', siaga_threshold: 180, waspada_threshold: 230, awas_threshold: 280 },
        { id: 'WL-003', name: 'Sungai Bahau', location: 'Bahau Hulu', siaga_threshold: 170, waspada_threshold: 220, awas_threshold: 270 },
    ];

    for (const sensor of sensors){
        await prisma.sensor.upsert(
            {
                where: { id: sensor.id },
                update: {},
                create: sensor,
            }
        )
    }

    const count: number = await prisma.sensorReading.count();
    if(count > 0){
        console.log("Data sensor reading sudah ada, melewati seeding data dummy...");
        return;
    }

    const filePath:string = path.join(process.cwd(), 'readings.json');
    const rawData: string = fs.readFileSync(filePath, 'utf-8');
    const sensorReadingsData: any[] = JSON.parse(rawData);

    const formattedSensorReadings: SensorReading[] = sensorReadingsData.map((reading: any) => ({
        id: reading.id,
        sensor_id: reading.sensor_id,
        timestamp: new Date(reading.timestamp),
        value: reading.value,
        unit: reading.unit
    }));

    await prisma.sensorReading.createMany({
        data: formattedSensorReadings,
    });
    console.log("Seeding Database Selesai...")
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
  }).finally(async () => {
    await prisma.$disconnect();
  });