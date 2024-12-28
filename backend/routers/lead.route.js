import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { create, deletelead, getleads, updatelead } from '../controllers/lead.controller.js';

const router = express.Router();

router.post('/create', verifyToken, create)
router.get('/getleads', getleads)
router.delete('/deletelead/:leadId/:userId', verifyToken, deletelead)
router.put('/updatelead/:leadId/:userId', verifyToken, updatelead)


export default router;