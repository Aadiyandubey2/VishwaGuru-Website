import { supabase } from '../lib/supabase';
import { calculateDestinyNumber, calculateSoulUrgeNumber, calculatePersonalityNumber, calculateLifePathNumber, calculateBirthdayNumber } from '../utils/numerologyCalculator';

export const numerologyService = {
  saveReading: async (name: string, birthdate: string) => {
    try {
      const user = supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const reading = {
        user_id: (await user).data.user?.id,
        name,
        birthdate,
        destiny_number: calculateDestinyNumber(name),
        soul_urge_number: calculateSoulUrgeNumber(name),
        personality_number: calculatePersonalityNumber(name),
        life_path_number: calculateLifePathNumber(birthdate),
        birthday_number: calculateBirthdayNumber(birthdate)
      };

      const { data, error } = await supabase
        .from('numerology_readings')
        .insert([reading])
        .select()
        .single();

      if (error) throw error;

      return {
        success: true,
        reading: {
          id: data.id,
          name: data.name,
          date: data.birthdate,
          result: {
            destinyNumber: data.destiny_number,
            soulUrgeNumber: data.soul_urge_number,
            personalityNumber: data.personality_number,
            lifePathNumber: data.life_path_number,
            birthdayNumber: data.birthday_number
          }
        }
      };
    } catch (error) {
      console.error('Error saving reading:', error);
      throw error;
    }
  },
  
  getUserReadings: async () => {
    try {
      const { data, error } = await supabase
        .from('numerology_readings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(reading => ({
        id: reading.id,
        name: reading.name,
        date: reading.birthdate,
        result: {
          destinyNumber: reading.destiny_number,
          soulUrgeNumber: reading.soul_urge_number,
          personalityNumber: reading.personality_number,
          lifePathNumber: reading.life_path_number,
          birthdayNumber: reading.birthday_number
        }
      }));
    } catch (error) {
      console.error('Error fetching readings:', error);
      throw error;
    }
  },
  
  deleteReading: async (id: string) => {
    try {
      const { error } = await supabase
        .from('numerology_readings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Error deleting reading:', error);
      throw error;
    }
  }
};

export const authService = {
  register: async (email: string, password: string, name: string) => {
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: authData.user.id,
            name,
            email
          }]);

        if (profileError) throw profileError;

        return {
          success: true,
          user: {
            id: authData.user.id,
            name,
            email
          }
        };
      }

      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  login: async (email: string, password: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (authError) throw authError;

      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        return {
          success: true,
          user: {
            id: user.id,
            name: userData.name,
            email: user.email
          }
        };
      }

      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  },

  getCurrentUser: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      
      if (user) {
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;

        return {
          success: true,
          user: {
            id: user.id,
            name: userData.name,
            email: user.email
          }
        };
      }

      return { success: false };
    } catch (error) {
      console.error('Get current user error:', error);
      throw error;
    }
  },

  updateProfile: async (name: string) => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) throw new Error('Not authenticated');

      const { error: updateError } = await supabase
        .from('users')
        .update({ name })
        .eq('id', user.id);

      if (updateError) throw updateError;

      return {
        success: true,
        user: {
          id: user.id,
          name,
          email: user.email
        }
      };
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  changePassword: async (newPassword: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      throw error;
    }
  },

  deleteAccount: async () => {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError) throw authError;
      if (!user) throw new Error('Not authenticated');

      const { error: deleteError } = await supabase
        .from('users')
        .delete()
        .eq('id', user.id);

      if (deleteError) throw deleteError;

      await supabase.auth.signOut();

      return { success: true };
    } catch (error) {
      console.error('Delete account error:', error);
      throw error;
    }
  }
};