import axios from 'axios';

export namespace Mock {
  export namespace API {
    export namespace Success {
      export function OK(method: 'post' | 'get' | 'delete', data?: any[]) {
        let spy = jest.spyOn(axios, method);

        if (data && data.length > 1) {
          data.forEach(datum => (spy = spy.mockResolvedValueOnce({ status: 200, data: datum })));
        } else if (data && data.length === 1) {
          spy.mockResolvedValue({ status: 200, data: data[0] });
        } else {
          spy.mockResolvedValue({ status: 200 });
        }
      }

      export function CreatedResource(method: 'post' | 'get' | 'delete', data?: any[]) {
        let spy = jest.spyOn(axios, method);

        if (data && data.length > 1) {
          data.forEach(datum => (spy = spy.mockResolvedValueOnce({ status: 201, data: datum })));
        } else if (data && data.length === 1) {
          spy.mockResolvedValue({ status: 201, data: data[0] });
        } else {
          spy.mockResolvedValue({ status: 201 });
        }
      }
    }

    export namespace Error {
      export function BadRequest(
        method: 'post' | 'get' | 'delete',
        data: any[] = [{ reason: 'Bad request' }]
      ) {
        let spy = jest.spyOn(axios, method);

        if (data && data.length > 1) {
          data.forEach(
            datum => (spy = spy.mockRejectedValueOnce({ response: { status: 400, data: datum } }))
          );
        } else if (data && data.length === 1) {
          spy.mockRejectedValue({ response: { status: 400, data: data[0] } });
        } else {
          spy.mockRejectedValue({ response: { status: 400 } });
        }
      }

      export function Unauthorized(
        method: 'post' | 'get' | 'delete',
        data: any[] = [{ reason: 'User is unauthorized to perform this action' }]
      ) {
        let spy = jest.spyOn(axios, method);

        if (data && data.length > 1) {
          data.forEach(
            datum => (spy = spy.mockRejectedValueOnce({ response: { status: 401, data: datum } }))
          );
        } else if (data && data.length === 1) {
          spy.mockRejectedValue({ response: { status: 401, data: data[0] } });
        } else {
          spy.mockRejectedValue({ response: { status: 401 } });
        }
      }

      export function NotFound(
        method: 'post' | 'get' | 'delete',
        data: any[] = [{ reason: 'Resource could not be found' }]
      ) {
        let spy = jest.spyOn(axios, method);

        if (data && data.length > 1) {
          data.forEach(
            datum => (spy = spy.mockRejectedValueOnce({ response: { status: 404, data: datum } }))
          );
        } else if (data && data.length === 1) {
          spy.mockRejectedValue({ response: { status: 404, data: data[0] } });
        } else {
          spy.mockRejectedValue({ response: { status: 404 } });
        }
      }

      export function InternalServerError(
        method: 'post' | 'get' | 'delete',
        data: any[] = [{ reason: 'Internal server error' }]
      ) {
        let spy = jest.spyOn(axios, method);

        if (data && data.length > 1) {
          data.forEach(
            datum => (spy = spy.mockRejectedValueOnce({ response: { status: 500, data: datum } }))
          );
        } else if (data && data.length === 1) {
          spy.mockRejectedValue({ response: { status: 500, data: data[0] } });
        } else {
          spy.mockRejectedValue({ response: { status: 500 } });
        }
      }
    }
  }
}
