const adminModel = require('../models/admin.model')
const mongoose = require('mongoose')

module.exports = function requiredRole(roleName) {
  return async function (req, res, next) {
    try {
      const adminId = req.adminId
      if (!adminId || !mongoose.Types.ObjectId.isValid(adminId)) {
        return res.status(403).json({ message: 'You are not authorized for this role. Please login with the correct role.' })
      }

      const admin = await adminModel.findById(adminId).select('role').lean()
      if (!admin) return res.status(403).json({ message: 'You are not authorized for this role. Please login with the correct role.' })

      if (Array.isArray(roleName)) {
        if (!roleName.includes(admin.role)) return res.status(403).json({ message: 'You are not authorized for this role. Please login with the correct role.' })
      } else {
        if (admin.role !== roleName) return res.status(403).json({ message: 'You are not authorized for this role. Please login with the correct role.' })
      }

      req.admin = admin
      next()
    } catch (err) {
      console.error('requireRole error', err)
      return res.status(403).json({ message: 'You are not authorized for this role. Please login with the correct role.' })
    }
  }
}


const { isValidObjectId } = require('mongoose');

module.exports = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Verify adminId is set by verifyToken middleware
      if (!req.adminId) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. Please login first.'
        });
      }

      // Validate ObjectId format
      if (!isValidObjectId(req.adminId)) {
        return res.status(401).json({
          success: false,
          message: 'Invalid authentication token.'
        });
      }

      // Fetch admin with role
      const adminUser = await adminModel.findById(req.adminId).select('role');

      if (!adminUser) {
        return res.status(401).json({
          success: false,
          message: 'Admin account not found. Please login again.'
        });
      }

      // Check if admin has required role
      if (!allowedRoles.includes(adminUser.role)) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized for this role. Please login with the correct role.'
        });
      }

      // Attach admin info to request
      req.admin = adminUser;
      req.adminRole = adminUser.role;

      next();
    } catch (error) {
      console.error('RBAC Middleware Error:', error);
      return res.status(500).json({
        success: false,
        message: 'Authentication error occurred.'
      });
    }
  };
};
