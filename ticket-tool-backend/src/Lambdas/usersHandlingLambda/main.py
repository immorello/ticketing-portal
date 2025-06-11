import os

user_pool_name = os.environ['user_pool_name']

def lambda_handler(event, context):
    print("DEBUG=",event)