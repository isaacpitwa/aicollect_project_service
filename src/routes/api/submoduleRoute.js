import verify from '../../middleware/auth';
import method from '../../utils/method';
import Access from '../../middleware/userRoles';
import SubmoduleController from '../../controllers/submoduleController';
const router = express.Router();

/** Submodule ROUTES */
router
  .route('/create')
  .post(verify, SubmoduleController.create)
  .all(method);

  export default router;