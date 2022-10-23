const Service = require('../models/Service');
const { ObjectId } = require('mongodb');

class ServiceController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortTitle = req.body.sortTitle;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      title: { $regex: `.*${req.body.title}.*`, $options: 'i' },
      active: true,
    };

    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$createdId', // Name of array (origin)
          connectFromField: 'createdId', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'createdId', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$updatedId', // Name of array (origin)
          connectFromField: 'updatedId', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'updatedId', // Add or replace field in origin collection
        },
      },
    ];

    if (sortTitle) {
      if (sortTitle) sort.title = sortTitle;
      aggregateQuery.push({ $sort: sort });
    }

    Service.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((services) => res.json(services))
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }

  // Get by id
  getById(req, res) {
    const myQuery = { _id: ObjectId(req.params._id), active: true };
    let aggregateQuery = [
      { $match: myQuery },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$createdId', // Name of array (origin)
          connectFromField: 'createdId', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'createdId', // Add or replace field in origin collection
        },
      },
      {
        $graphLookup: {
          from: 'users', // Match with to collection what want to search
          startWith: '$updatedId', // Name of array (origin)
          connectFromField: 'updatedId', // Field of array
          connectToField: '_id', // from which field it will match
          as: 'updatedId', // Add or replace field in origin collection
        },
      },
    ];
    Service.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((services) => res.json(services[0]))
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }

  // Create
  create(req, res) {
    let service;
    Service.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        const _id = ObjectId(req.body.updatedId);
        service = new Service({
          id: newId,
          title: req.body.title,
          thumbnail: req.body.thumbnail,
          content: req.body.content,
          createdId: _id,
          updatedId: _id,
          listNameImages: req.body.listNameImages,
        });
        service.save((err, service) => {
          if (err) {
            return res.status(400).json('Cannot save!');
          } else {
            return res
              .status(200)
              .json('Created successful with service: ' + service.title);
          }
        });
      });
  }

  // update
  async update(req, res) {
    Service.findOne({ _id: ObjectId(req.body._id) })
      .then((service) => {
        if (!service)
          return res.status(404).json({ message: 'Service not founded!' });
        service.title = req.body.title;
        service.content = req.body.content;
        service.thumbnail = req.body.thumbnail;
        service.createdId = ObjectId(req.body.createdId);
        service.updatedId = ObjectId(req.body.updatedId);
        service.listNameImages = req.body.listNameImages;
        service.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ message: 'Updated successful!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Cannot find' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Service.findOne(myQuery)
      .then((service) => {
        if (service) {
          service.active = false;
          service.save((err) => {
            if (err) return res.status(400).json('Error deleting service');
            else
              return res
                .status(200)
                .json(`Successfully deleted service: ${service.title}`);
          });
        } else return res.status(404).json('Service not found');
      })
      .catch((err) => res.status(404).json(`Error!!!`));
  }
}

module.exports = new ServiceController();
