import type { Request, Response } from 'express';
import Exception from '../exceptions';
import { StatusCodes } from '../constants/status-codes';

const cookieOptions = {
  maxAge: 30 * 24 * 60 * 60 * 1000,
  httpOnly: true,
};

export type HandlerEvent<TBody, TQuery, TParams, TCookies> = {
  headers: Request['headers'];
  query: TQuery;
  params: TParams;
  body: TBody;
  method: string;
  path: string;
  cookies: TCookies;
};
export type HandlerResponse<Body, Cookie> =
  | {
      status: {
        code: StatusCodes;
      };
      body: Body;
      cookie?: Cookie;
      redirect?: {
        link?: string;
      };
    }
  | Exception;

const handleRequest =
  <
    TRequestBody,
    TRequestQuery,
    TRequestParams,
    TResponseBody,
    TRequestCookie,
    TResponseCookie,
  >(
    handler: (
      request: HandlerEvent<
        TRequestBody,
        TRequestQuery,
        TRequestParams,
        TRequestCookie
      >,
    ) => Promise<HandlerResponse<TResponseBody, TResponseCookie>>,
  ) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const request: HandlerEvent<any, any, any, any> = {
        headers: req.headers,
        query: req.query,
        params: req.params,
        body: req.body,
        method: req.method,
        path: req.path,
        cookies: req.cookies,
      };

      const response = await handler({
        ...request,
      });

      if (response instanceof Exception) {
        res
          .status(response.status.code ?? StatusCodes.INTERNAL_SERVER_ERROR)
          .send(response.obj);

        return;
      }

      if (response.cookie) {
        Object.keys(response.cookie)
          .reduce(
            (acc) =>
              // acc.push([key, response.cookie[key]]);
              acc,
            [] as [string, string][],
          )
          .map((cookies) => res.cookie(...cookies, cookieOptions));
      }

      if (response.redirect && response.redirect.link) {
        res.redirect(response.redirect.link);
      }

      res.status(response.status.code ?? StatusCodes.OK).send(response.body);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(
          error instanceof Error ? error?.message : 'INTERNAL SERVER ERROR',
        );
    }
  };

export default handleRequest;
