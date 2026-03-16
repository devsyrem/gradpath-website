/**
 * GradPath — Report Service
 * Business logic for report CRUD, review workflow, and export.
 */

const { Report, Placement } = require('../database');
const logger = require('../logging/logger');

class ReportService {
  /**
   * Create a new report.
   */
  async create(data, authorId) {
    // Verify placement exists and user has access
    const placement = await Placement.findById(data.placementId);
    if (!placement) {
      throw Object.assign(new Error('Placement not found'), { statusCode: 404 });
    }

    const report = await Report.create({
      title: data.title,
      content: data.content,
      type: data.type || 'progress',
      placement: data.placementId,
      author: authorId,
      status: 'draft',
      tags: data.tags || [],
    });

    logger.info('Report created', { reportId: report._id, authorId });
    return report;
  }

  /**
   * Get reports with role-based filtering.
   */
  async getAll({ role, userId, placementId, status, page = 1, limit = 20 }) {
    const filter = {};

    if (role === 'student') {
      filter.author = userId;
    }

    if (placementId) filter.placement = placementId;
    if (status) filter.status = status;

    // Supervisors: only reports for their placements
    if (role === 'placement_supervisor') {
      const supervisedPlacements = await Placement.find({ supervisor: userId }).select('_id');
      filter.placement = { $in: supervisedPlacements.map((p) => p._id) };
    }

    const skip = (page - 1) * limit;
    const [reports, total] = await Promise.all([
      Report.find(filter)
        .populate('author', 'firstName lastName email')
        .populate('placement', 'title company')
        .populate('reviewedBy', 'firstName lastName')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Report.countDocuments(filter),
    ]);

    return {
      reports,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  /**
   * Get single report by ID.
   */
  async getById(id, { role, userId }) {
    const report = await Report.findById(id)
      .populate('author', 'firstName lastName email')
      .populate('placement', 'title company student supervisor')
      .populate('reviewedBy', 'firstName lastName');

    if (!report) {
      throw Object.assign(new Error('Report not found'), { statusCode: 404 });
    }

    // Access control
    if (role === 'student' && report.author._id.toString() !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }

    return report;
  }

  /**
   * Update a report (only drafts can be edited by author).
   */
  async update(id, data, userId) {
    const report = await Report.findById(id);
    if (!report) {
      throw Object.assign(new Error('Report not found'), { statusCode: 404 });
    }
    if (report.author.toString() !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }
    if (report.status !== 'draft') {
      throw Object.assign(new Error('Only draft reports can be edited'), { statusCode: 400 });
    }

    Object.assign(report, data);
    await report.save();

    logger.info('Report updated', { reportId: id, userId });
    return report;
  }

  /**
   * Submit a report for review.
   */
  async submit(id, userId) {
    const report = await Report.findById(id);
    if (!report) throw Object.assign(new Error('Report not found'), { statusCode: 404 });
    if (report.author.toString() !== userId) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }
    if (report.status !== 'draft') {
      throw Object.assign(new Error('Report is not in draft state'), { statusCode: 400 });
    }

    report.status = 'submitted';
    report.submittedAt = new Date();
    await report.save();

    logger.info('Report submitted', { reportId: id, userId });
    return report;
  }

  /**
   * Review a report (approve or reject).
   */
  async review(id, { status, comments }, reviewerId) {
    if (!['approved', 'rejected'].includes(status)) {
      throw Object.assign(new Error('Status must be approved or rejected'), { statusCode: 400 });
    }

    const report = await Report.findById(id);
    if (!report) throw Object.assign(new Error('Report not found'), { statusCode: 404 });
    if (!['submitted', 'under_review'].includes(report.status)) {
      throw Object.assign(new Error('Report is not available for review'), { statusCode: 400 });
    }

    report.status = status;
    report.reviewedBy = reviewerId;
    report.reviewedAt = new Date();
    report.reviewComments = comments;
    await report.save();

    logger.info('Report reviewed', { reportId: id, status, reviewerId });
    return report;
  }

  /**
   * Delete a report (admin only, or author if draft).
   */
  async delete(id, { role, userId }) {
    const report = await Report.findById(id);
    if (!report) throw Object.assign(new Error('Report not found'), { statusCode: 404 });

    if (role !== 'admin' && (report.author.toString() !== userId || report.status !== 'draft')) {
      throw Object.assign(new Error('Access denied'), { statusCode: 403 });
    }

    await Report.findByIdAndDelete(id);
    logger.info('Report deleted', { reportId: id, deletedBy: userId });
  }

  /**
   * Generate an export-ready summary for a placement.
   */
  async exportPlacementReports(placementId) {
    const reports = await Report.find({ placement: placementId, status: 'approved' })
      .populate('author', 'firstName lastName')
      .sort({ createdAt: 1 })
      .lean();

    return reports.map((r) => ({
      title: r.title,
      type: r.type,
      author: `${r.author.firstName} ${r.author.lastName}`,
      content: r.content,
      submittedAt: r.submittedAt,
      reviewedAt: r.reviewedAt,
    }));
  }
}

module.exports = new ReportService();
