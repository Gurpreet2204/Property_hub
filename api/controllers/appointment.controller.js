import Appointment from "../models/appointment.model.js";

export const getUserAppointments = async (req, res) => {
  try {
    const userId = req.query.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'userId is required'
      });
    }

    const appointments = await Appointment.find({ ownerId: userId })
      .populate('propertyId', 'name location')
      .exec();

    res.status(200).json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
};