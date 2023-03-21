import type { Request, Response } from 'express';
import Exception from '../exceptions';
import { StatusCodes } from '../constants/status-codes';

export type HandlerEvent = {
  headers: Request['headers'];
  query: Request['query'];
  params: Request['params'];
  body: string;
  method: string;
  path: string;
  cookies: any;
};

export type HandlerResponse =
  | {
      status: {
        code: StatusCodes;
      };
      body: any;
      cookie?: { refreshToken: string };
      redirect?: boolean;
    }
  | Exception;

const handleRequest =
  (handler: (request: HandlerEvent) => Promise<HandlerResponse>) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      const request: HandlerEvent = {
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

      if (!(response instanceof Exception)) {
        if (response.cookie) {
          res.cookie(
            String(Object.getOwnPropertyNames(response.cookie)[0]),
            response.cookie.refreshToken,
            {
              maxAge: 30 * 24 * 60 * 60 * 1000,
              httpOnly: true,
            },
          );
        }
        if (response.redirect) {
          res.redirect(String(process.env.CLIENT_URL));
        }
        res.status(response.status.code ?? StatusCodes.OK).send(response.body);
      } else
        res
          .status(response.status.code ?? StatusCodes.INTERNAL_SERVER_ERROR)
          .send(response.obj);
    } catch (error) {
      res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .send(
          error instanceof Error ? error?.message : 'INTERNAL SERVER ERROR',
        );
    }
  };

export default handleRequest;
