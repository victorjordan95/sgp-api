import { Router } from 'express';

import UserController from './app/controllers/UserController';

import RoleController from './app/controllers/RoleController';

const routes = new Router();

routes.post('/users', UserController.store);

routes.post('/roles', RoleController.store);

export default routes;
