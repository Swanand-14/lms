import express from 'express'
import { checkHealth } from '../controllers/health.controller.js'
const Healthrouter = express.Router()
Healthrouter.get("/",checkHealth);

export default Healthrouter
