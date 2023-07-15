import express, { Request, Response } from 'express';

(async () => {
  const app = express();
  app.get('/', (req: Request, res: Response) => {
    res.send('hello!');
  });

  const port = 9000;
  app.listen(port, () => {
    console.log(`server is running at ${port}`);
  });
})();
