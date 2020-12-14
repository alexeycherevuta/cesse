import { Request, Response, NextFunction } from 'express'
export default (req: Request, res: Response, next: NextFunction): any => {
  console.info('This is a middleware example')
  next()
}
