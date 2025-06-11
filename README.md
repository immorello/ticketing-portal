# ticketing-portal
This repository contains the backend and frontend infrastructure of the Ticket Tool Portal, provisioned using AWS CloudFormation. It is designed to support the Angular-based frontend by providing secure, scalable AWS resources and APIs.

## Overview
The backend is defined via infrastructure-as-code using the CloudFormation template. The supporting Lambda are still to be written:
ticket-tool-backend/template.yaml

The frontend is still work in progress but it has functioning code for the realization of a portal with authentication. 
The frontend was developed with angular and it available here:
ticket-tool/

## Main AWS Services (to be confirmed/adapted)
- Amazon API Gateway – Exposes RESTful APIs to the frontend for ticket operations.
- AWS Lambda – Handles backend logic and processes requests.
- Amazon DynamoDB – Stores ticket data and user information.
- Amazon Cognito – Manages authentication and user pools.
- IAM Roles & Policies – Securely controls permissions for all services.
- Amazon S3 (optional) – For storing attachments or files related to tickets.