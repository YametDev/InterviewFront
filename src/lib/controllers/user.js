import { User } from "../models";
import dbConnect from "../mongodb";

export const lookup = async (req, res) => {
  await dbConnect();

  const find = req.body;
  User.countDocuments(find).then((count) => {
    User.find(find)
      .then((users) => {
        if (users) {
          res.send({ result: true, data: users, count });
        } else {
          res.send({ result: false, message: "Users not found." });
        }
      })
      .catch((error) =>
        res.send({ result: false, message: "Error :" + error })
      );
  });
};

export const create = async (req, res) => {
  await dbConnect();
  
  const newUser = new User(req.body);
  newUser
    .save()
    .then((record) => {
      res.send({ result: true, data: record });
    })
    .catch((error) => {
      res.send({
        result: false,
        message: "Error : " + error,
      });
    });
};

export const update = async (req, res) => {
  await dbConnect();
  
  User.findOneAndUpdate(req.body.find, req.body.update)
    .then((user) => {
      res.send({ result: true, data: user });
    })
    .catch((error) => res.send({ result: false, message: "Error : " + error }));
};

export const _delete = async (req, res) => {
  await dbConnect();
  
  User.deleteOne(req.body)
    .then((user) => {
      res.send({ result: true, data: user });
    })
    .catch((error) => res.send({ result: false, message: "Error : " + error }));
};
