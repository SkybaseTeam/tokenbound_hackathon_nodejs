import { Context, Next } from "koa";
import { validate, ValidationError } from "class-validator";

const validationMiddleware = async (ctx: Context, next: Next) => {
   if (ctx.request.body) {
      const validationResult: Array<ValidationError> = await validate(
         ctx.request.body
      );
      if (validationResult.length > 0) {
         ctx.status = 400;
         ctx.body = validationResult;
         console.log("-----------------------------------------")
         return;
      }
   }
   await next();
};

export default validationMiddleware;
