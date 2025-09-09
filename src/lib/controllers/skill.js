import { Skill } from "../models";
import dbConnect from "../mongodb";

export const lookup = async (req, res) => {
  await dbConnect();

  const find = req.body || {};
  try {
    const count = await Skill.countDocuments(find);
    const skills = await Skill.find(find).sort({ name: 1 });
    if (skills) {
      return res.send({ result: true, data: skills, count });
    }
    return res.send({ result: true, data: [], count: 0 });
  } catch (error) {
    return res.send({ result: false, message: "Error : " + error });
  }
};

export const create = async (req, res) => {
  await dbConnect();

  try {
    // Ensure unique by name (case-insensitive)
    const name = (req.body?.name || "").trim();
    if (!name.length) {
      return res.send({ result: false, message: "Name is required" });
    }

    const exists = await Skill.findOne({ name: {$regex: `^${name}$`, $options:'i'} });
    if (exists) {
      return res.send({ result: true, data: exists });
    }

    const newSkill = new Skill({ name });
    const record = await newSkill.save();
    return res.send({ result: true, data: record });
  } catch (error) {
    return res.send({ result: false, message: "Error : " + error });
  }
};

export const update = async (req, res) => {
  await dbConnect();
  try {
    const skill = await Skill.findOneAndUpdate(req.body.find, req.body.update);
    return res.send({ result: true, data: skill });
  } catch (error) {
    return res.send({ result: false, message: "Error : " + error });
  }
};

export const _delete = async (req, res) => {
  await dbConnect();
  try {
    const skill = await Skill.deleteOne(req.body);
    return res.send({ result: true, data: skill });
  } catch (error) {
    return res.send({ result: false, message: "Error : " + error });
  }
};