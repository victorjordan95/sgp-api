import { Router } from 'express';

import AppointmentController from './app/controllers/AppointmentController';
import UserController from './app/controllers/UserController';
import RoleController from './app/controllers/RoleController';
import ScheduleController from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/session', SessionController.store);
routes.post('/sessionToken', SessionController.index);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.get('/users/:id', UserController.index);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.get('/schedule', ScheduleController.index);

routes.post('/roles', RoleController.store);

export default routes;
