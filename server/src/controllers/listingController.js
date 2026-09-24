import { Listing } from '../models/Listing.js';
import Joi from 'joi';

// TODO: write a validation schema for create/update per README.md section 2.
// Validation schema for creating a listing
const createListingSchema = Joi.object({
  price: Joi.number().min(0).required()
});

// Validation schema for updating a listing
const updateListingSchema = Joi.object({
  price: Joi.number().min(0)
});

// GET /api/listings
// TODO: implement per README.md section 3.
export async function getAllListings(req, res, next) {
  try {
    // TODO
    const includeRemoved = req.query.includeRemoved === 'true';

    const filter = includeRemoved
      ? {}
      : { status: { $ne: 'removed' } };

    const listings = await Listing.find(filter);

    res.status(200).json(listings);
  } catch (err) { next(err); }
}

// GET /api/listings/:id
// TODO: implement per README.md sections 3 and 5.
export async function getListing(req, res, next) {
  try {
    // TODO
    const includeRemoved = req.query.includeRemoved === 'true';

    const filter = {
      _id: req.params.id
    };

    if (!includeRemoved) {
      filter.status = { $ne: 'removed' };
    }

    const listing = await Listing.findOne(filter);

    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

    res.status(200).json(listing);
  } catch (err) { next(err); }
}

// POST /api/listings
// TODO: implement per README.md section 3.
export async function createListing(req, res, next) {
  try {
    const { error } = createListingSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const listing = await Listing.create(req.body);

    res.status(201).json(listing);
  } catch (err) { next(err); }
}

// PATCH /api/listings/:id
// TODO: implement per README.md sections 3 and 5.
export async function updateListing(req, res, next) {
  try {
    // TODO
    const { error } = updateListingSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const listing = await Listing.findOneAndUpdate(
      {
        _id: req.params.id,
        status: { $ne: 'removed' }
      },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

    res.status(200).json(listing);
  } catch (err) { next(err); }
}

// DELETE /api/listings/:id
// TODO: implement per README.md sections 4 and 5.
export async function deleteListing(req, res, next) {
  try {
    // TODO
    const listing = await Listing.findOneAndUpdate(
      {
        _id: req.params.id,
        status: { $ne: 'removed' }
      },
      {
        status: 'removed'
      },
      {
        new: true
      }
    );

    if (!listing) {
      return res.status(404).json({
        error: 'Listing not found'
      });
    }

    res.status(200).json(listing);
  } catch (err) { next(err); }
}
