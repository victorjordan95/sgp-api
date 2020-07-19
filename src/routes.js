import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import AppointmentController from './app/controllers/AppointmentController';
import CidController from './app/controllers/CidController';
import DoctorController from './app/controllers/DoctorController';
import EmployeeController from './app/controllers/EmployeeController';
import FileController from './app/controllers/FileController';
import PatientController from './app/controllers/PatientController';
import RoleController from './app/controllers/RoleController';
import ScheduleController from './app/controllers/ScheduleController';
import SessionController from './app/controllers/SessionController';
import UserController from './app/controllers/UserController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/session', SessionController.store);
routes.post('/sessionToken', SessionController.index);
routes.post('/users', UserController.store);

routes.use(authMiddleware);

routes.get('/cid', CidController.index);

routes.post('/files', upload.single('file'), FileController.store);
routes.put('/files', upload.single('file'), FileController.update);

routes.get('/patients', PatientController.index);
routes.get('/employees', EmployeeController.index);
routes.get('/doctors', DoctorController.index);

routes.get('/users/:id', UserController.index);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.get('/appointments', AppointmentController.index);
routes.post('/appointments', AppointmentController.store);

routes.get('/schedule', ScheduleController.index);
routes.get('/notification-requests', ScheduleController.countRequests);
routes.get('/schedule-requests', ScheduleController.indexRequests);
routes.put('/schedule-requests', ScheduleController.approveRequest);

routes.post('/roles', RoleController.store);

export default routes;
