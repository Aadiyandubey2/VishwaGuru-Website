import { Request, Response } from 'express';
import { NumerologyReading } from '../models/NumerologyReading';
import { 
  calculateDestinyNumber, 
  calculateSoulUrgeNumber, 
  calculatePersonalityNumber, 
  calculateLifePathNumber, 
  calculateBirthdayNumber 
} from '../../src/utils/numerologyCalculator';

export const saveReading = async (req: Request, res: Response) => {
  try {
    const { name, birthdate } = req.body;
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const destinyNumber = calculateDestinyNumber(name);
    const soulUrgeNumber = calculateSoulUrgeNumber(name);
    const personalityNumber = calculatePersonalityNumber(name);
    const lifePathNumber = calculateLifePathNumber(birthdate);
    const birthdayNumber = calculateBirthdayNumber(birthdate);
    
    const reading = new NumerologyReading({
      userId: user.id,
      name,
      birthdate,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      lifePathNumber,
      birthdayNumber
    });
    
    await reading.save();
    
    return res.status(201).json({
      success: true,
      message: 'Reading saved successfully',
      reading: {
        id: reading._id,
        name,
        birthdate,
        destinyNumber,
        soulUrgeNumber,
        personalityNumber,
        lifePathNumber,
        birthdayNumber
      }
    });
  } catch (error) {
    console.error('Save reading error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while saving reading'
    });
  }
};

export const getUserReadings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const readings = await NumerologyReading.find({ userId: user.id })
      .sort({ createdAt: -1 });
    
    const formattedReadings = readings.map(reading => ({
      id: reading._id,
      name: reading.name,
      date: new Date(reading.birthdate).toISOString().split('T')[0],
      result: {
        destinyNumber: reading.destinyNumber,
        soulUrgeNumber: reading.soulUrgeNumber,
        personalityNumber: reading.personalityNumber,
        lifePathNumber: reading.lifePathNumber,
        birthdayNumber: reading.birthdayNumber
      },
      createdAt: reading.createdAt
    }));
    
    return res.status(200).json({
      success: true,
      readings: formattedReadings
    });
  } catch (error) {
    console.error('Get readings error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching readings'
    });
  }
};

export const deleteReading = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const reading = await NumerologyReading.findOne({
      _id: id,
      userId: user.id
    });
    
    if (!reading) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found or not authorized'
      });
    }
    
    await reading.deleteOne();
    
    return res.status(200).json({
      success: true,
      message: 'Reading deleted successfully'
    });
  } catch (error) {
    console.error('Delete reading error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting reading'
    });
  }
};