import os

ticket_table_name = os.environ['ticket_table']
messagges_table_name = os.environ['messagges_table']

def lambda_handler(event, context):
    print("DEBUG=",event)