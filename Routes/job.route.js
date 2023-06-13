const express = require("express");
const { JobModel } = require("../Models/job.models");
const jobRouter = express.Router();

jobRouter.get("/", async (req, res) => {
  const queryObj = {};
  const sortObj = {};
  const { sort, order, role, limit, page } = req.query;
  if (sort) {
    if (order == "asc") {
      sortObj[sort] = 1;
    }
    if (order == "desc") {
      sortObj[sort] = -1;
    }
  }
  if (role) {
    queryObj.role = { $in: role };
    // { $regex: brand_name, $options: "i" }
  }
  let Limit = 10;
  if (limit) {
    Limit = limit;
  }

  try {
    let userdata = await JobModel.find(queryObj)
      .sort(sortObj)
      .skip((page - 1) * Limit)
      .limit(Limit);
    res.status(200).send(userdata);
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

jobRouter.post("/add", async (req, res) => {
  try {
    const data = await JobModel(req.body);
    await data.save();
    res.status(200).send({ msg: "Created Job" });
  } catch (error) {
    res.status(400).send({ msg: error.message });
  }
});

module.exports = { jobRouter };
