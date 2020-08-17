import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import AvailableController from './app/controllers/AvailableController';
import AppointmentController from './app/controllers/AppointmentController';
import CidController from './app/controllers/CidController';
import CityController from './app/controllers/CityController';
import DoctorController from './app/controllers/DoctorController';
import EmployeeController from './app/controllers/EmployeeController';
import EstablishmentController from './app/controllers/EstablishmentController';
import FileController from './app/controllers/FileController';
import PatientController from './app/controllers/PatientController';
import PaymentController from './app/controllers/PaymentController';
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
routes.get('/city', CityController.index);

routes.use(authMiddleware);

routes.get('/cid', CidController.index);

routes.post('/files', upload.single('file'), FileController.store);
routes.put('/files', upload.single('file'), FileController.update);

routes.get('/patients', PatientController.index);
routes.get('/employees', EmployeeController.index);

routes.get('/doctors', DoctorController.index);
routes.get('/doctor/:doctorId/available', AvailableController.index);

routes.get('/users/:id', UserController.index);
routes.get('/users', UserController.index);
routes.put('/users', UserController.update);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

routes.get('/appointments', AppointmentController.index);
routes.get('/my-appointments-today', AppointmentController.indexToday);
routes.get('/my-position', AppointmentController.queueAppointment);
routes.post('/appointments', AppointmentController.store);

routes.get('/schedule', ScheduleController.index);
routes.put('/schedule', ScheduleController.approveRequest);
routes.get('/notification-requests', ScheduleController.countRequests);
routes.get('/schedule-requests', ScheduleController.indexRequests);

routes.post('/roles', RoleController.store);

// ROTAS PARA ADMIN
// CRIAR UM MIDDLE
routes.get('/establishment', EstablishmentController.index);
routes.get('/establishment/:id', EstablishmentController.index);
routes.post('/establishment', EstablishmentController.store);
routes.put('/establishment', EstablishmentController.update);
routes.delete('/establishment/:id', EstablishmentController.delete);

routes.post('/payment', PaymentController.store);

export default routes;
