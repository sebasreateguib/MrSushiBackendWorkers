import json
import boto3
import os

dynamodb = boto3.resource('dynamodb')
table_name = os.environ.get('MENU_TABLE', 'menu-service-dev-MenuTable')
table = dynamodb.Table(table_name)

def get_menu(event, context):
    try:
        # Obtener todos los productos del catálogo mediante un Scan
        response = table.scan()
        items = response.get('Items', [])
        
        body = {
            "message": "Catálogo obtenido exitosamente",
            "items": items
        }
        
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps(body)
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": {
                "Access-Control-Allow-Origin": "*"
            },
            "body": json.dumps({"error": str(e)})
        }
