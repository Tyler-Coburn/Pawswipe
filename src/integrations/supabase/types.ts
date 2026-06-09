export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      adoption_applications: {
        Row: {
          applicant_name: string
          availability: string | null
          children_in_home: string | null
          city: string | null
          consent: boolean
          created_at: string
          current_pets: string | null
          email: string
          housing_type: string | null
          id: string
          is_synced_listing: boolean
          landlord_permission: boolean | null
          pet_experience: string | null
          pet_id: string
          pet_name: string | null
          phone: string | null
          preferred_contact: string | null
          reason: string | null
          rent_or_own: string | null
          session_id: string | null
          shelter_id: string | null
          shelter_name: string | null
          source: string | null
          source_pet_id: string | null
          source_url: string | null
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          applicant_name: string
          availability?: string | null
          children_in_home?: string | null
          city?: string | null
          consent?: boolean
          created_at?: string
          current_pets?: string | null
          email: string
          housing_type?: string | null
          id?: string
          is_synced_listing?: boolean
          landlord_permission?: boolean | null
          pet_experience?: string | null
          pet_id: string
          pet_name?: string | null
          phone?: string | null
          preferred_contact?: string | null
          reason?: string | null
          rent_or_own?: string | null
          session_id?: string | null
          shelter_id?: string | null
          shelter_name?: string | null
          source?: string | null
          source_pet_id?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          applicant_name?: string
          availability?: string | null
          children_in_home?: string | null
          city?: string | null
          consent?: boolean
          created_at?: string
          current_pets?: string | null
          email?: string
          housing_type?: string | null
          id?: string
          is_synced_listing?: boolean
          landlord_permission?: boolean | null
          pet_experience?: string | null
          pet_id?: string
          pet_name?: string | null
          phone?: string | null
          preferred_contact?: string | null
          reason?: string | null
          rent_or_own?: string | null
          session_id?: string | null
          shelter_id?: string | null
          shelter_name?: string | null
          source?: string | null
          source_pet_id?: string | null
          source_url?: string | null
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          preferred_city: string | null
          preferred_species: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          preferred_city?: string | null
          preferred_species?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          preferred_city?: string | null
          preferred_species?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      saved_pets: {
        Row: {
          created_at: string
          id: string
          image_url: string | null
          pet_id: string
          pet_name: string | null
          session_id: string
          shelter_id: string | null
          shelter_name: string | null
          source: string | null
          source_pet_id: string | null
          source_url: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          image_url?: string | null
          pet_id: string
          pet_name?: string | null
          session_id: string
          shelter_id?: string | null
          shelter_name?: string | null
          source?: string | null
          source_pet_id?: string | null
          source_url?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          image_url?: string | null
          pet_id?: string
          pet_name?: string | null
          session_id?: string
          shelter_id?: string | null
          shelter_name?: string | null
          source?: string | null
          source_pet_id?: string | null
          source_url?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      sync_logs: {
        Row: {
          created_at: string
          id: string
          message: string | null
          pets_count: number | null
          provider: string
          result: string
          shelters_count: number | null
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          pets_count?: number | null
          provider: string
          result: string
          shelters_count?: number | null
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          pets_count?: number | null
          provider?: string
          result?: string
          shelters_count?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      adoption_applications_health: {
        Args: never
        Returns: {
          last_submitted_at: string
          total: number
        }[]
      }
      list_recent_applications_redacted: {
        Args: { _limit?: number }
        Returns: {
          applicant_initials: string
          city: string
          created_at: string
          id: string
          is_synced_listing: boolean
          pet_name: string
          shelter_name: string
          status: string
        }[]
      }
      my_profile_stats: {
        Args: never
        Returns: {
          application_count: number
          saved_count: number
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
