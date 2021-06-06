import { Response } from 'express';

export namespace Success {
  export function OK(res: Response, data: any) {
    res.status(200).send(data);
  }

  export function CreatedResource(res: Response, resource: any) {
    res.status(201).send(resource);
  }
}

export namespace Error {
  export function BadRequest(res: Response, reason: string) {
    res.status(400).send({ reason });
  }

  export function Unauthorized(
    res: Response,
    data: any = { reason: 'User is unauthorized to perform this action' }
  ) {
    res.status(401).send(data);
  }

  export function NotFound(res: Response, data: any) {
    res.status(404).send(data);
  }

  export function InternalServerError(
    res: Response,
    data: any = { reason: 'Internal server error' }
  ) {
    res.status(500).send(data);
  }
}
