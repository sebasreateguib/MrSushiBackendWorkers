import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
stepfunctions = boto3.client('stepfunctions')
table_name = os.environ.get('FULFILLMENT_TABLE', 'fulfillment-service-dev-FulfillmentTable')
table = dynamodb.Table(table_name)

def save_token(event, context):
    """ Lambda invocada por Step Functions para guardar el token temporalmente """
    tenant_id = event.get('tenant_id')
    pedido_id = event.get('pedido_id')
    task_token = event.get('taskToken')
    estado = event.get('estado')

    # IMPORTANTE: No usar try/except que swallow el error aquí.
    # Si falla al guardar en DynamoDB, hay que propagar la excepción
    # para que Step Functions marque la tarea como FAILED y se pueda reintentar.
    table.put_item(Item={
        'tenant_id': tenant_id,
        'pedido_id': pedido_id,
        'taskToken': task_token,
        'estado': estado
    })

    # Integración externa: Aquí se llamaría al webhook de GCP para simular Rappi
    # import requests; requests.post('URL_GCP/actualizar-estado', json={"estado": estado})

    return {"status": "Token guardado en DynamoDB", "pedido_id": pedido_id}

def complete_task(event, context):
    """ API llamada por el trabajador cuando termina la comida o la empaca """
    try:
        body = json.loads(event.get('body', '{}'))
        task_token = body.get('taskToken')
        
        if not task_token:
            return {"statusCode": 400, "body": json.dumps({"error": "Falta taskToken"})}
            
        # Enviamos el token de regreso a Step Functions para continuar el flujo
        stepfunctions.send_task_success(
            taskToken=task_token,
            output=json.dumps({
                "resultado": "Tarea completada",
                "pedido_id": body.get('pedido_id'),
                "tenant_id": body.get('tenant_id')
            })
        )
        
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"message": "Flujo de Step Functions reanudado con éxito"})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"error": str(e)})
        }
