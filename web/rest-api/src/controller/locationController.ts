import { Request, Response } from 'express';

import { Location } from '../model/location';

function addLocation(request: Request, response: Response): void {
  Location.create({
    name: request.body.name,
    city: request.body.city,
    country: request.body.country,
    description: request.body.description
  })
    .then(location => response.status(201).send(location.get()))
    .catch(() => response.sendStatus(504));
}

function getLocation(request: Request, response: Response): void {
  Location.findByPk(request.params.id)
    .then(location =>
      location !== null ? response.status(200).send(location.get()) : response.sendStatus(404)
    )
    .catch(() => response.sendStatus(504));
}

function getAllWithOrder(request: Request, response: Response): void {
  const order = request.query.order || 'createdAt';
  const startPage = request.query.page || 1;
  const limit = request.query.limit || 5;

  Location.findAll({ order: [order] })
    .then(data => response.status(200).send(data.slice((startPage - 1) * limit, startPage * limit)))
    .catch(() => response.sendStatus(504));
}

function editLocation(request: Request, response: Response): void {
  Location.findByPk(request.params.id)
    .then(location => {
      if (location !== null) {
        location.update({
          city: request.body.city,
          country: request.body.country,
          description: request.body.description,
          visited: request.body.visited
        });

        response.status(200).send(location.get());
      } else {
        response.sendStatus(404);
      }
    })
    .catch(() => response.sendStatus(504));
}

function deleteLocation(request: Request, response: Response): void {
  Location.destroy({ where: { id: request.params.id } })
    .then(success => response.sendStatus(success ? 200 : 404))
    .catch(() => response.sendStatus(504));
}

export { addLocation, getLocation, getAllWithOrder, editLocation, deleteLocation };
