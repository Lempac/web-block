<?php

namespace App\Http\Controllers;

use OpenApi\Attributes as OAT;

#[OAT\OpenApi(openapi: OAT\OpenApi::VERSION_3_1_0)]
#[OAT\Info(
    version: '1.0.0',
    title: 'Web-block openapi',
)]
#[OAT\License(name: 'MIT', identifier: 'MIT')]
#[OAT\Server(url: 'http://localhost:8000/', description: 'Backend server')]
// err: AxiosError<{
//     message: string;
//     errors: Record<string, string[]>;
// }>,
#[OAT\Schema(schema: 'ErrorObject', properties: [
    new OAT\Property(property: 'message', type: 'string', example: 'Validation failed.'),
    new OAT\Property(property: 'errors', type: 'object', additionalProperties: new OAT\AdditionalProperties(
        type: 'array', items: new OAT\Items(type: 'string', example: 'Field is required')
    )),
], required: ['message', 'errors'])]

#[OAT\Components(
    securitySchemes: [
        new OAT\SecurityScheme(
            securityScheme: 'sessionAuth',
            type: 'apiKey',
            in: 'cookie',
            name: 'web_block_session',
            description: 'This API uses session-based authentication. The session cookie is automatically handled by the 
            middleware, and clients do not need to include it in their requests.',
            flows: [
                new OAT\Flow(
                    flow: 'implicit',
                    authorizationUrl: '/api/auth/redirect',
                    scopes: ['read', 'write']
                ),
            ]
        ),
    ]
)]
class openAPI {}

abstract class Controller
{
    //
}
