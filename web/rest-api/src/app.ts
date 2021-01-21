import express from 'express';
import bodyParser from 'body-parser';

import * as locationController from './controller/locationController';

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/locations', locationController.addLocation);
app.get('/locations/:id', locationController.getLocation);
app.get('/locations', locationController.getAllWithOrder);
app.patch('/locations/:id', locationController.editLocation);
app.delete('/locations/:id', locationController.deleteLocation);

export default app;
