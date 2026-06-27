# Sistema de Gestión de Pedidos - Mr Sushi (Backend)

Este repositorio contiene la implementación del Backend Serverless para el Sistema de Gestión de Pedidos de comida rápida (Mr Sushi). 
Cumple con los requisitos del Proyecto Final del curso Cloud Computing, utilizando una arquitectura Multi-tenancy, Serverless y orientada a eventos (EDA).

## Arquitectura y Microservicios

El sistema está dividido en 3 microservicios independientes, orquestados mediante **Serverless Framework** y escritos en **Python 3.11**.

### 1. Menu Service (`/backend/menu-service`)
Microservicio encargado de gestionar el catálogo de productos de Mr Sushi.
- **Endpoint:** `GET /menu`
- **Flujo:** API Gateway -> Lambda -> DynamoDB (`MenuTable`)
- **Propósito:** Alimentar la Aplicación Web para Clientes con los productos disponibles.

### 2. Order Service (`/backend/order-service`)
Microservicio encargado de la recepción inicial de pedidos.
- **Endpoint:** `POST /orders`
- **Flujo:** API Gateway -> Lambda -> DynamoDB (`OrdersTable`) -> EventBridge
- **Propósito:** Recibe el pedido, lo almacena usando un diseño de base de datos Multi-tenant (Particionado por `sucursal_id`), y emite un evento asíncrono `OrderCreated` al bus de eventos de EventBridge.

### 3. Fulfillment Service (`/backend/fulfillment-service`)
Microservicio operativo encargado de orquestar el flujo de preparación y entrega (Workflow).
- **Endpoint:** `POST /tasks/complete`
- **Flujo:** EventBridge -> Step Functions -> Lambda -> DynamoDB (`FulfillmentTable`)
- **Propósito:** Se dispara al escuchar el evento `OrderCreated`. Ejecuta una máquina de estados (Step Functions) que utiliza el patrón **"Wait for Callback with Task Token"** para pausar el flujo mientras los trabajadores humanos (cocinero, empacador, repartidor) hacen su trabajo, reanudando la ejecución automáticamente cuando reciben la confirmación.

## Servicios de AWS Utilizados

| Servicio AWS | Propósito en el Proyecto |
| :--- | :--- |
| **AWS Lambda** | Ejecuta el código de negocio sin necesidad de aprovisionar servidores. |
| **Amazon API Gateway** | Expone las rutas HTTP/REST para que las aplicaciones Frontend se comuniquen con las funciones Lambda. |
| **Amazon DynamoDB** | Base de datos NoSQL donde se guardan el catálogo, los pedidos (multi-tenant) y los tokens de estado temporales. |
| **Amazon EventBridge** | Permite una arquitectura orientada a eventos. Desacopla la creación de un pedido (Order Service) de su preparación (Fulfillment Service). |
| **AWS Step Functions** | Orquesta el "Flujo de Trabajo" del pedido de principio a fin, gestionando tareas que pueden durar minutos u horas gracias a los *Task Tokens*. |
| **AWS IAM** | Se utiliza explícitamente el `LabRole` (propio de cuentas de AWS Academy) para otorgar permisos a los servicios sin romper las políticas universitarias. |

## Instrucciones de Despliegue (AWS Academy / Learner Lab)

Dado que se utiliza una cuenta de estudiante, todos los `serverless.yml` están configurados para usar obligatoriamente el `LabRole`.

1. Instalar Serverless Framework de manera global (si no lo tienes):
   ```bash
   npm install -g serverless
   ```

2. Instalar dependencias locales del Fulfillment Service (requiere plugin de Step Functions):
   ```bash
   cd backend/fulfillment-service
   npm init -y
   npm install --save-dev serverless-step-functions
   ```

3. Desplegar cada microservicio de manera independiente:
   ```bash
   cd backend/[nombre-del-microservicio]
   serverless deploy
   ```
