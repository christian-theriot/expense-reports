import { Response } from 'express';

export namespace Success {
  export const Message = <HTTP = 200>(res: Response, data: any) => res.status(200).send(data);

  export const CreatedResource = <HTTP = 201>(res: Response, resource: any) =>
    res.status(201).send(resource);
}

export namespace Error {
  export const InvalidArgument = <T, HTTP = 400>(
    res: Response,
    name: string,
    value: T,
    type: string
  ) => {
    if (!value || typeof value !== type) {
      res.status(400).send({ reason: `${name} must be provided as a ${type}` });
    }

    return !value || typeof value !== type;
  };

  export const InternalServerError = <HTTP = 500>(res: Response) =>
    res.status(500).send({ reason: 'Internal server error' });

  export const Unauthorized = <HTTP = 401>(res: Response) =>
    res.status(401).send({ reason: 'User is unauthorized to perform this action' });

  export const NotFound = <HTTP = 404>(res: Response, name: string) =>
    res.status(404).send({ reason: `${name} could not be found` });
}
