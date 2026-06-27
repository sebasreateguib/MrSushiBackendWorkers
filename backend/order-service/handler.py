import json
import boto3
import os
import uuid
from datetime import datetime, timezone

dynamodb = boto3.resource('dynamodb')
eventbridge = boto3.client('events')
table_name = os.environ.get('ORDERS_TABLE', 'order-service-dev-OrdersTable')
table = dynamodb.Table(table_name)

def create_order(event, context):
    try:
        body = json.loads(event.get('body', '{}'))
        tenant_id = body.get('tenant_id', 'SUCURSAL#DEFAULT')
        pedido_id = f"PEDIDO#{str(uuid.uuid4())}"
        
        # 1. Guardar en DynamoDB
        order_item = {
            'tenant_id': tenant_id,
            'pedido_id': pedido_id,
            'estado': 'CREADO',
            'fecha': datetime.now(timezone.utc).isoformat(),
            'items': body.get('items', [])
        }
        table.put_item(Item=order_item)
        
        # 2. Emitir evento a EventBridge
        eventbridge.put_events(
            Entries=[
                {
                    'Source': 'mrsushi.orders',
                    'DetailType': 'OrderCreated',
                    'Detail': json.dumps({'pedido_id': pedido_id, 'tenant_id': tenant_id}),
                    'EventBusName': 'default'
                }
            ]
        )
        
        return {
            "statusCode": 201,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({
                "message": "Pedido creado e insertado en cola de despacho",
                "pedido_id": pedido_id
            })
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }
