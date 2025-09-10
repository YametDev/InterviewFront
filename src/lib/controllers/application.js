import { Application } from "../models";
import { DateTime } from "luxon";
import dbConnect from "../mongodb";

export const lookup = async (req, res) => {
  await dbConnect();

  const { date, offset, from, count, ...others } = req.body;

  // Find query
  let find = { ...others };

  if (date !== undefined) {
    const clientStartDate = DateTime.fromFormat(
      date,
      "yyyy-MM-dd"
    ).startOf("day");
    const clientEndDate = DateTime.fromFormat(
      date,
      "yyyy-MM-dd"
    ).endOf("day");

    // Adjust client date range to UTC using the provided timezone offset
    const startOfDayUTC = clientStartDate
      .minus({ minutes: offset })
      .toJSDate();
    const endOfDayUTC = clientEndDate
      .minus({ minutes: offset })
      .toJSDate();

    if (!(date.length === 0 || date === "0000-00-00")) {
      find = { ...find, createdAt: { $gte: startOfDayUTC, $lte: endOfDayUTC } };
    }
  }

  try {
    const countDocuments = await Application.countDocuments(find);
    console.log(countDocuments);

    const applications = await Application.find(find)
      .skip(from)
      .limit(count)
      .sort({ createdAt: -1 });

    if (applications && applications.length > 0) {
      console.log(applications[0].createdAt);

      res.send({
        result: true,
        data: applications.map((record) => {
          const utcDate = new Date(record.createdAt);
          const localDate = new Date(
            utcDate.getTime() - offset * 60000
          );

          return {
            ...record.toObject(),
            createdAt: localDate.toISOString().split("T")[0],
          };
        }),
        count: countDocuments,
      });
    } else {
      res.send({ result: true, data: [], count: 0 });
    }
  } catch (error) {
    res.send({ result: false, message: "Error: " + error });
  }
};

export const create = async (req, res) => {
  await dbConnect();

  const newApplication = new Application(req.body);
  newApplication
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

  Application.findByIdAndUpdate(req.body.id, req.body.update)
    .then((application) => {
      res.send({ result: true, data: application });
    })
    .catch((error) => res.send({ result: false, message: "Error : " + error }));
};

export const _delete = async (req, res) => {
  await dbConnect();

  Application.deleteOne(req.body)
    .then((application) => {
      res.send({ result: true, data: application });
    })
    .catch((error) => res.send({ result: false, message: "Error : " + error }));
};

export const deleteMany = (req, res) => {
  return {};
};
