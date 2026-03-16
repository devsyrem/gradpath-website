/**
 * GradPath — Placement Service
 * Business logic for placement CRUD and lifecycle.
 */

const { Placement } = require('../database');
const logger = require('../logging/logger');

class PlacementService {
  /**
   * Create a new placement.
   */
  async create(data, createdBy) {
    const placement = await Placement.create({
      ...data,
      createdBy,
      status: 'pending',
    });
    logger.info('Placement created', { placementId: placement._id, createdBy });
    return placement;
  }

  /**
   * Get all placements with optional filters.
   * Respects role-based visibility.
   */
  async getAll({ role, userId, status, company, page = 1, limit = 20 }) {
    const filter = {};

    // Role-based filtering
    if (role === 'student') {
      filter.student = userId;
    } else if (role === 'placement_supervisor') {
      filter.supervisor = userId;
    }
    // academic_staff and admin see all

    if (status) filter.status = status;
    if (company) filter.company = new RegExp(company, 'i');

    const skip = (page - 1) * limit;
    const [placements, total] = await Promise.all([
      Placement.find(filter)
        .populate('student', 'firstName lastName email')
        .populate('supervisor', 'firstName lastName email')
        .populate('academicAdvisor', 'firstName lastName email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Placement.countDocuments(filter),
    ]);

    return {
      placements,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * Get a single placement by ID (with access control).
   */
  async getById(id, { role, userId }) {
    const placement = await Placement.findById(id)
      .populate('student', 'firstName lastName email studentId')
      .populate('supervisor', 'firstName lastName email')
      .populate('academicAdvisor', 'firstName lastName email')
      .populate('feedback.author', 'firstName lastName role');

    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }

    // Access control
    if (role === 'student' && placement.student._id.toString() !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }
    if (role === 'placement_supervisor' && placement.supervisor?._id?.toString() !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }

    return placement;
  }

  /**
   * Update a placement.
   */
  async update(id, data, { role, userId }) {
    const placement = await Placement.findById(id);
    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }

    // Only admin/academic staff can update any; supervisor can update assigned
    if (role === 'placement_supervisor' && placement.supervisor?.toString() !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }
    if (role === 'student') {
      throw Object.assign(new Error('Students cannot modify placements'), { statusCode: 403 });
    }

    Object.assign(placement, data);
    await placement.save();

    logger.info('Placement updated', { placementId: id, updatedBy: userId });
    return placement;
  }

  /**
   * Update placement status.
   */
  async updateStatus(id, status, userId) {
    const placement = await Placement.findById(id);
    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }

    const oldStatus = placement.status;
    placement.status = status;
    await placement.save();

    logger.info('Placement status updated', {
      placementId: id,
      oldStatus,
      newStatus: status,
      updatedBy: userId,
    });

    return placement;
  }

  /**
   * Add a milestone to a placement.
   */
  async addMilestone(placementId, milestoneData, userId) {
    const placement = await Placement.findById(placementId);
    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }

    placement.milestones.push(milestoneData);
    await placement.save();

    logger.info('Milestone added', { placementId, userId });
    return placement;
  }

  /**
   * Update a milestone's status.
   */
  async updateMilestone(placementId, milestoneId, data, userId) {
    const placement = await Placement.findById(placementId);
    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }

    const milestone = placement.milestones.id(milestoneId);
    if (!milestone) {
      throw Object.assign(new Error('Milestone not found'), { statusCode: 404 });
    }

    Object.assign(milestone, data);
    if (data.status === 'completed') milestone.completedDate = new Date();
    await placement.save();

    logger.info('Milestone updated', { placementId, milestoneId, userId });
    return placement;
  }

  /**
   * Add feedback to a placement.
   */
  async addFeedback(placementId, { content, rating }, { userId, role }) {
    const placement = await Placement.findById(placementId);
    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }

    placement.feedback.push({
      author: userId,
      authorRole: role,
      content,
      rating,
    });
    await placement.save();

    logger.info('Feedback added', { placementId, userId });
    return placement;
  }

  /**
   * Delete a placement (admin only).
   */
  async delete(id, userId) {
    const placement = await Placement.findByIdAndDelete(id);
    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }
    logger.info('Placement deleted', { placementId: id, deletedBy: userId });
  }
}

module.exports = new PlacementService();
