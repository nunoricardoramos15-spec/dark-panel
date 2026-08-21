const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Sem token, acesso negado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido' });
  }
};

const adminOnly = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'Acesso negado - apenas admins' });
  }
  next();
};

module.exports = { auth, adminOnly };
