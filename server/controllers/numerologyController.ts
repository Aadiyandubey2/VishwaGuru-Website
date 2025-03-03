import { Request, Response } from 'express';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';
import { 
  calculateDestinyNumber, 
  calculateSoulUrgeNumber, 
  calculatePersonalityNumber, 
  calculateLifePathNumber, 
  calculateBirthdayNumber 
} from '../../src/utils/numerologyCalculator';

// Save a numerology reading
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
    
    // Calculate numerology numbers
    const destinyNumber = calculateDestinyNumber(name);
    const soulUrgeNumber = calculateSoulUrgeNumber(name);
    const personalityNumber = calculatePersonalityNumber(name);
    const lifePathNumber = calculateLifePathNumber(birthdate);
    const birthdayNumber = calculateBirthdayNumber(birthdate);
    
    // Save reading to database
    const [result] = await pool.query<ResultSetHeader>(
      `INSERT INTO numerology_readings 
       (user_id, name, birthdate, destiny_number, soul_urge_number, personality_number, life_path_number, birthday_number) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [user.id, name, birthdate, destinyNumber, soulUrgeNumber, personalityNumber, lifePathNumber, birthdayNumber]
    );
    
    return res.status(201).json({
      success: true,
      message: 'Reading saved successfully',
      reading: {
        id: result.insertId,
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

// Get all readings for a user
export const getUserReadings = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    // Get readings from database
    const [readings] = await pool.query<RowDataPacket[]>(
      `SELECT * FROM numerology_readings WHERE user_id = ? ORDER BY created_at DESC`,
      [user.id]
    );
    
    // Format readings for response
    const formattedReadings = readings.map(reading => ({
      id: reading.id,
      name: reading.name,
      date: new Date(reading.birthdate).toISOString().split('T')[0],
      result: {
        destinyNumber: reading.destiny_number,
        soulUrgeNumber: reading.soul_urge_number,
        personalityNumber: reading.personality_number,
        lifePathNumber: reading.life_path_number,
        birthdayNumber: reading.birthday_number
      },
      createdAt: reading.created_at
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

// Delete a reading
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
    
    // Check if reading exists and belongs to user
    const [readings] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM numerology_readings WHERE id = ? AND user_id = ?',
      [id, user.id]
    );
    
    if (readings.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Reading not found or not authorized'
      });
    }
    
    // Delete reading
    await pool.query(
      'DELETE FROM numerology_readings WHERE id = ?',
      [id]
    );
    
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