import express from "express";
import OtaController from "../controllers/ota.controller";
import upload from "../middlewares/multer.config";

const router = express.Router();

router.post("", upload.single("firmware"), OtaController.addNewVersion);
router.delete("", OtaController.remove);
router.post("/find", OtaController.getDetails);
router.get("/perform", OtaController.download);

export default router;
