import { Router } from 'express';

import UserController from './app/controllers/UserController';

import RoleController from './app/controllers/RoleController';

const routes = new Router();

routes.get('/users/:id', UserController.findById);
routes.get('/users', UserController.index);
routes.post('/users', UserController.store);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.post('/roles', RoleController.store);

export default routes;
