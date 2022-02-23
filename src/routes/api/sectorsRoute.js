import express from 'express';
import SectorController from '../../controllers/sectorController';
import verify from '../../middleware/auth';
import method from '../../utils/method';

const router = express.Router();

router
  .route('/')
  .get(SectorController.getSectors)
  .all(method);
router
  .route('/create')
  .post(verify, SectorController.createSector)
  .all(method);

export default router;
