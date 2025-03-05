import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import pool from '../db/connection';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    await pool.query<ResultSetHeader>(
      'UPDATE users SET name = ? WHERE id = ?',
      [name, user.id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        ...user,
        name
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating profile'
    });
  }
};

export const changePassword = async (req: Request, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    const [users] = await pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE id = ?',
      [user.id]
    );
    
    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    const dbUser = users[0];
    
    const isPasswordValid = await bcrypt.compare(currentPassword, dbUser.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }
    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    await pool.query<ResultSetHeader>(
      'UPDATE users SET password = ? WHERE id = ?',
      [hashedPassword, user.id]
    );
    
    return res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while changing password'
    });
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }
    
    await pool.query(
      'DELETE FROM users WHERE id = ?',
      [user.id]
    );
    
    res.clearCookie('token');
    
    return res.status(200).json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while deleting account'
    });
  }
};