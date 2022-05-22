import { User, Event } from "./schema";

async function createEvent(userId, text, id, start_date, end_date,evType) {
  const dbEvent = new Event({
    user: userId,
    text: text,
    _id: id,
    startDateTime: start_date,
    endDateTime: end_date,
    evType:evType,
  });
  await dbEvent.save();

  const user = await User.findOne({ _id: userId });
  user.events.push(dbEvent._id);
  await user.save();

  return dbEvent;
}

async function getEvents(userId) {
  const events = await Event.find({ user: userId });
  return events;
}

async function updateEvent(text, id, start_date, end_date, evType) {
  const events = await Event.find({ _id: id }).updateOne({
    text: text,
    startDateTime: start_date,
    endDateTime: end_date,
    evType:evType,
  });
  return events;
}

async function deleteEvent(id, userId) {
  const user = await User.findById(userId);
  user.events = user.events.filter((event) => {
    return event!== id;
  });
  await user.save();
  const events = Event.deleteOne({ _id: id });
  return events;
}

export { createEvent, updateEvent, getEvents, deleteEvent };
