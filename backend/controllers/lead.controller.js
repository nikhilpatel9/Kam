
import Lead from '../models/lead.model.js';
import { errorHandler } from '../utils/error.js';
import { incrementCount } from './count.controller.js';

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, 'You are not allowed to create a Lead'));
  }
  if (!req.body.title || !req.body.content||!req.body.category ) {
    return next(errorHandler(400, 'Please provide all required fields'));
  }
  const slug = req.body.title
    .split(' ')
    .join('-')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, '');
  const newLead = new Lead({
    ...req.body,
    slug,
    userId: req.user.id,
  });

  try {
    const savedLead = await newLead.save();
    await incrementCount('leads');

    const sendSSEUpdate = req.app.get('sendSSEUpdate');
    if (sendSSEUpdate) {
      sendSSEUpdate({ type: 'leads' });
    }
    res.status(201).json(savedLead);
  } catch (error) {
    next(error);
  }
};

export const getleads = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const sortDirection = req.query.order === 'asc' ? 1 : -1;
    const leads = await Lead.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.leadId && { _id: req.query.leadId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: 'i' } },
          { content: { $regex: req.query.searchTerm, $options: 'i' } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalLeads = await Lead.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthLeads = await Lead.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      leads,
      totalLeads,
      lastMonthLeads,
    });
  } catch (error) {
    next(error);
  }
};

export const deletelead = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this post'));
  }
  try {
    await Lead.findByIdAndDelete(req.params.leadId);
    res.status(200).json('The lead has been deleted');
  } catch (error) {
    next(error);
  }
};

export const updatelead = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this post'));
  }
  try {
    const updatedPost = await Lead.findByIdAndUpdate(
      req.params.leadId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};