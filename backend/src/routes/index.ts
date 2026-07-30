import { Router } from 'express';
import authRoutes from './auth.js';
import experienceRoutes from './experiences.js';
import bookingRoutes from './bookings.js';
import likeRoutes from './likes.js';
import passportRoutes from './passport.js';
import guideRoutes from './guides.js';
import configRoutes from './config.js';
import adminRoutes from './admin.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/experiences', experienceRoutes);
router.use('/bookings', bookingRoutes);
router.use('/likes', likeRoutes);
router.use('/passport', passportRoutes);
router.use('/guides', guideRoutes);
router.use('/config', configRoutes);
router.use('/admin', adminRoutes);

router.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
