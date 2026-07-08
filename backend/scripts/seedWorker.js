/**
 * Script de utilidad: crea un trabajador inicial en WorkersTable.
 * Correr en local una sola vez: node scripts/seedWorker.js
 *
 * Requiere las variables de entorno del .env:
 *   AWS_REGION, STAGE, JWT_SECRET
 *
 * O pasar la tabla directamente: WORKERS_TABLE=dev-mrsushi-workers node scripts/seedWorker.js
 */

require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');

const TENANT_ID     = 'mrsushi';
const WORKERS_TABLE = process.env.WORKERS_TABLE || 'dev-mrsushi-workers';

const trabajadoresSemilla = [
  { email: 'cocina@mrsushi.com',    nombre: 'Chef Sushi',    role: 'cocinero',   password: 'cocina123' },
  { email: 'empaque@mrsushi.com',   nombre: 'Empacador 1',   role: 'empacador',  password: 'empaque123' },
  { email: 'entrega@mrsushi.com',   nombre: 'Repartidor 1',  role: 'repartidor', password: 'entrega123' },
  { email: 'admin@mrsushi.com',     nombre: 'Admin MrSushi', role: 'admin',      password: 'admin123' },
];

async function seed() {
  const client    = new DynamoDBClient({ region: process.env.AWS_REGION || 'us-east-1' });
  const docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: { removeUndefinedValues: true },
  });

  for (const trabajador of trabajadoresSemilla) {
    const passwordHash = await bcrypt.hash(trabajador.password, 10);
    const item = {
      tenantId:     TENANT_ID,
      email:        trabajador.email,
      nombre:       trabajador.nombre,
      role:         trabajador.role,
      passwordHash,
      createdAt:    new Date().toISOString(),
    };

    await docClient.send(new PutCommand({ TableName: WORKERS_TABLE, Item: item }));
    console.log(`✅ Trabajador creado: ${trabajador.email} (${trabajador.role})`);
  }

  console.log('\n✅ Seed completado. Cambia las contraseñas en producción.\n');
}

seed().catch(console.error);
