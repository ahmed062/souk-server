import express from 'express';
import {
    addCopon,
    deleteCopon,
    editCopon,
    getAllCopons,
    getCoponById,
    getMyCopons,
} from '../controllers/Copon/copon.js';
import { admin, protect, seller } from '../middlewares/authMiddleware.js';

const router = express.Router();

router
    .route('/')
    .post(protect, seller, addCopon)
    .get(protect, admin, getAllCopons);
router.route('/mycopons').get(protect, seller, getMyCopons);
router
    .route('/:id')
    .get(protect, seller, getCoponById)
    .put(protect, seller, editCopon)
    .delete(protect, seller, deleteCopon);

export default router;
