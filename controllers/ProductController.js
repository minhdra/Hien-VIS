const Product = require('../models/Product');
const { ObjectId } = require('mongodb');

class ProductController {
  // Get all
  search(req, res) {
    // let page = req.body.page || 1;
    // let pageSize = req.body.pageSize || 10;
    let sortName = req.body.sortName;
    let sort = {};
    const myQuery = {
      id: { $exists: true },
      name: { $regex: `.*${req.body.name}.*`, $options: 'i' },
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

    if (sortName) {
      if (sortName) sort.name = sortName;
      aggregateQuery.push({ $sort: sort });
    }

    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => res.json(products))
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
    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => res.json(products[0]))
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }

  // Get by path
  getByPath(req, res) {
    const myQuery = { path: req.params.path, active: true };
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
    Product.aggregate(aggregateQuery)
      // .skip(page * pageSize - pageSize)
      // .limit(pageSize)
      .then((products) => res.json(products[0]))
      .catch((err) => res.status(400).json('Error: ' + err.message));
  }

  // Create
  create(req, res) {
    let product;
    Product.find()
      .sort({ id: -1 })
      .limit(1)
      .then((data) => {
        const newId = data.length > 0 ? data[0].id + 1 : 1;
        const _id = ObjectId(req.body.updatedId);
        product = new Product({
          id: newId,
          name: req.body.name,
          path: req.body.path,
          thumbnail: req.body.thumbnail,
          content: req.body.content,
          createdId: _id,
          updatedId: _id,
        });
        product.save((err, product) => {
          if (err) {
            return res.status(400).json('Cannot save!');
          } else {
            return res
              .status(200)
              .json('Created successful with product: ' + product.name);
          }
        });
      });
  }

  // update
  async update(req, res) {
    Product.findOne({ _id: ObjectId(req.body._id) })
      .then((product) => {
        if (!product)
          return res.status(404).json({ message: 'Product not founded!' });
        product.name = req.body.name;
        product.path = req.body.path;
        product.content = req.body.content;
        product.thumbnail = req.body.thumbnail;
        product.createdId = ObjectId(req.body.createdId);
        product.updatedId = ObjectId(req.body.updatedId);
        product.save((err) => {
          if (err) return res.status(500).json({ message: err.message });
          else res.status(200).json({ message: 'Updated successful!' });
        });
      })
      .catch((err) => res.status(422).json({ message: 'Cannot find' }));
  }

  // Delete
  delete(req, res) {
    const myQuery = { id: req.body.id, active: true };
    Product.findOne(myQuery)
      .then((product) => {
        if (product) {
          product.active = false;
          product.save((err) => {
            if (err) return res.status(400).json('Error deleting product');
            else
              return res
                .status(200)
                .json(`Successfully deleted product: ${product.name}`);
          });
        } else return res.status(404).json('Product not found');
      })
      .catch((err) => res.status(404).json(`Error!!!`));
  }
}

module.exports = new ProductController();
