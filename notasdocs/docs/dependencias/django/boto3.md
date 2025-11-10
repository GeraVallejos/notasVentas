Boto3 es el SDK (Software Development Kit) oficial de Amazon Web Services (AWS) para Python. Permite interactuar con los servicios de AWS desde código, como S3, DynamoDB, EC2, Lambda, SQS, SNS y muchos otros.

## ¿Para qué sirve?

Boto3 se usa para automatizar, administrar e integrar servicios de AWS en aplicaciones Python. Algunos casos comunes:

- Subir, descargar y gestionar archivos en S3 (almacenamiento en la nube)

- Guardar y consultar datos en DynamoDB

- Ejecutar funciones AWS Lambda

- Enviar mensajes con SNS o SQS

- Crear o administrar servidores EC2

## ¿Cómo funciona?

Boto3 trabaja con dos enfoques principales:

### Clientes

```python
    import boto3
    s3 = boto3.client('s3')
    s3.list_buckets()
```

### Recursos

```python
import boto3
s3 = boto3.resource('s3')
for bucket in s3.buckets.all():
    print(bucket.name)
```

### Autenticación (credenciales)

Boto3 necesita credenciales de AWS, usualmente definidas en:

- Variables de entorno:

```python
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
```

- O en ~/.aws/credentials

- O mediante roles IAM (cuando se usa en AWS directamente)

#### Nota
En este proyecto se uso Boto3 para utilizar el R2 de Cloudflare (el cual es muy similar a S3 de AWS pero mucho más barato)

---