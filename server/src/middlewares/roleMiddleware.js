export const staffOnly = (req, res, next) => {
  if (!req.user || !["ADMIN", "SUPERVISOR"].includes(req.user.role)) {
    return res.status(403).json({ message: "Admins or supervisors only" });
  }
  next();
};

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({ message: "Admins only" });
  }
  next();
};
