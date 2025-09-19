const Lead = require('../models/Lead');
const mongoose = require('mongoose');

const parseFilters = (query) => {
  const filters = {};
  // string equals/contains
  ['email', 'company', 'city'].forEach(f => {
    if (query[`${f}_eq`]) filters[f] = query[`${f}_eq`];
    if (query[`${f}_contains`]) filters[f] = { $regex: query[`${f}_contains`], $options: 'i' };
  });

  // enums
  ['status', 'source'].forEach(f => {
    if (query[`${f}_eq`]) filters[f] = query[`${f}_eq`];
    if (query[`${f}_in`]) {
      filters[f] = { $in: String(query[`${f}_in`]).split(',') };
    }
  });

  // numbers
  if (query.score_eq) filters.score = Number(query.score_eq);
  if (query.score_gt || query.score_lt || query.score_between) {
    filters.score = filters.score || {};
    if (query.score_gt) filters.score.$gt = Number(query.score_gt);
    if (query.score_lt) filters.score.$lt = Number(query.score_lt);
    if (query.score_between) {
      const [a, b] = String(query.score_between).split(',').map(Number);
      filters.score.$gte = a;
      filters.score.$lte = b;
    }
  }
  if (query.lead_value_eq) filters.lead_value = Number(query.lead_value_eq);
  if (query.lead_value_gt || query.lead_value_lt || query.lead_value_between) {
    filters.lead_value = filters.lead_value || {};
    if (query.lead_value_gt) filters.lead_value.$gt = Number(query.lead_value_gt);
    if (query.lead_value_lt) filters.lead_value.$lt = Number(query.lead_value_lt);
    if (query.lead_value_between) {
      const [a, b] = String(query.lead_value_between).split(',').map(Number);
      filters.lead_value.$gte = a;
      filters.lead_value.$lte = b;
    }
  }

  // dates: created_at, last_activity_at -> on, before, after, between (ISO strings)
  ['created_at', 'last_activity_at'].forEach(f => {
    if (query[`${f}_on`]) {
      const d = new Date(query[`${f}_on`]);
      const next = new Date(d);
      next.setDate(next.getDate() + 1);
      filters[f] = { $gte: d, $lt: next };
    }
    if (query[`${f}_before`]) filters[f] = { ...(filters[f] || {}), $lt: new Date(query[`${f}_before`]) };
    if (query[`${f}_after`]) filters[f] = { ...(filters[f] || {}), $gt: new Date(query[`${f}_after`]) };
    if (query[`${f}_between`]) {
      const [a, b] = String(query[`${f}_between`]).split(',');
      filters[f] = { $gte: new Date(a), $lte: new Date(b) };
    }
  });

  // boolean
  if (query.is_qualified_eq !== undefined) {
    const val = String(query.is_qualified_eq).toLowerCase();
    filters.is_qualified = (val === 'true' || val === '1');
  }

  return filters;
};

exports.createLead = async (req, res) => {
  try {
    const data = req.body;
    data.owner = req.user._id; // ensure lead belongs to logged-in user
    const lead = await Lead.create(data);
    res.status(201).json(lead);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.getLeads = async (req, res) => {
  try {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limitRaw = Number(req.query.limit) || 20;
    const limit = Math.min(100, Math.max(1, limitRaw));
    const filters = parseFilters(req.query);

    // only fetch current user leads
    filters.owner = req.user._id;

    const total = await Lead.countDocuments(filters);
    const totalPages = Math.ceil(total / limit);
    const leads = await Lead.find(filters)
      .sort({ created_at: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    res.json({ data: leads, page, limit, total, totalPages });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getLead = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Not found' });

  const lead = await Lead.findOne({ _id: id, owner: req.user._id });
  if (!lead) return res.status(404).json({ message: 'Not found' });

  res.json(lead);
};

exports.updateLead = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Not found' });

  const lead = await Lead.findOneAndUpdate(
    { _id: id, owner: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!lead) return res.status(404).json({ message: 'Not found' });

  res.json(lead);
};

exports.deleteLead = async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).json({ message: 'Not found' });

  const lead = await Lead.findOneAndDelete({ _id: id, owner: req.user._id });
  if (!lead) return res.status(404).json({ message: 'Not found' });

  res.json({ message: 'Deleted' });
};
