import Koa from 'koa';
import Router from '@koa/router';
import cors from '@koa/cors';
import serve from 'koa-static';
import koaBody from 'koa-body';

const app = new Koa();
const router = new Router();
const port = 3011;
	
app.use(cors({origin: '*'}));
app.use(serve("./views",{extensions:["html"]}))
app.use(koaBody())

router.post('/find', (ctx) => {	
	let breed = ctx.request.body.breed.toLowerCase().replace(' ', '-');
	if (breed) {
		ctx.response.redirect("/gallery?breed="+breed);
	}
});

app.use(async (ctx, next) => {
	await next();
	const rt = ctx.response.get('X-Response-Time');
	console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next) => {
	const start = Date.now();
	await next();
	const ms = Date.now() - start;
	ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(router.routes());

app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
