export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      content_chapters: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          mode: Database["public"]["Enums"]["mode"]
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          mode: Database["public"]["Enums"]["mode"]
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          mode?: Database["public"]["Enums"]["mode"]
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      content_lectures: {
        Row: {
          chapter_id: number
          content: string
          created_at: string | null
          id: number
          sort_order: number
          title: string
          updated_at: string | null
        }
        Insert: {
          chapter_id: number
          content: string
          created_at?: string | null
          id?: number
          sort_order?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          chapter_id?: number
          content?: string
          created_at?: string | null
          id?: number
          sort_order?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_lectures_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "content_chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      db_version: {
        Row: {
          updated_at: string
          version: string
        }
        Insert: {
          updated_at?: string
          version: string
        }
        Update: {
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      quiz_options: {
        Row: {
          id: number
          option_text: string
          question_id: number
          updated_at: string | null
        }
        Insert: {
          id?: number
          option_text: string
          question_id: number
          updated_at?: string | null
        }
        Update: {
          id?: number
          option_text?: string
          question_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_questions: {
        Row: {
          created_at: string | null
          id: number
          lecture_id: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          lecture_id: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          lecture_id?: number
          question_text?: string
          question_type?: Database["public"]["Enums"]["question_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_questions_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "content_lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_reference_answers: {
        Row: {
          answer_text: string | null
          answer_type: string
          created_at: string | null
          id: number
          option_id: number | null
          question_id: number
          updated_at: string | null
        }
        Insert: {
          answer_text?: string | null
          answer_type: string
          created_at?: string | null
          id?: number
          option_id?: number | null
          question_id: number
          updated_at?: string | null
        }
        Update: {
          answer_text?: string | null
          answer_type?: string
          created_at?: string | null
          id?: number
          option_id?: number | null
          question_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_reference_answers_option_id_fkey"
            columns: ["option_id"]
            isOneToOne: false
            referencedRelation: "quiz_options"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_reference_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_user_answers: {
        Row: {
          answer_text: string | null
          chosen_option_ids: number[] | null
          created_at: string | null
          id: number
          is_correct: boolean | null
          profile_id: string
          question_id: number
          updated_at: string | null
        }
        Insert: {
          answer_text?: string | null
          chosen_option_ids?: number[] | null
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          profile_id: string
          question_id: number
          updated_at?: string | null
        }
        Update: {
          answer_text?: string | null
          chosen_option_ids?: number[] | null
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          profile_id?: string
          question_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_user_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      system_events: {
        Row: {
          chapter_id: number | null
          created_at: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id: number
          lecture_id: number | null
          metadata: Json | null
          profile_id: string
          quiz_question_id: number | null
          updated_at: string | null
        }
        Insert: {
          chapter_id?: number | null
          created_at?: string | null
          event_type: Database["public"]["Enums"]["event_type"]
          id?: number
          lecture_id?: number | null
          metadata?: Json | null
          profile_id: string
          quiz_question_id?: number | null
          updated_at?: string | null
        }
        Update: {
          chapter_id?: number | null
          created_at?: string | null
          event_type?: Database["public"]["Enums"]["event_type"]
          id?: number
          lecture_id?: number | null
          metadata?: Json | null
          profile_id?: string
          quiz_question_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "system_events_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "content_chapters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_events_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "content_lectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_events_quiz_question_id_fkey"
            columns: ["quiz_question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      users_feedback: {
        Row: {
          created_at: string | null
          description: string
          id: number
          profile_id: string | null
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: number
          profile_id?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: number
          profile_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_feedback_profile"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "users_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      users_profiles: {
        Row: {
          about: string | null
          birthdate: string | null
          clinical_semester: number | null
          created_at: string | null
          gender: Database["public"]["Enums"]["gender"] | null
          id: string
          name: string | null
          overall_semester: number | null
          role: Database["public"]["Enums"]["user_role"] | null
          updated_at: string | null
        }
        Insert: {
          about?: string | null
          birthdate?: string | null
          clinical_semester?: number | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id: string
          name?: string | null
          overall_semester?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Update: {
          about?: string | null
          birthdate?: string | null
          clinical_semester?: number | null
          created_at?: string | null
          gender?: Database["public"]["Enums"]["gender"] | null
          id?: string
          name?: string | null
          overall_semester?: number | null
          role?: Database["public"]["Enums"]["user_role"] | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      chapter_get_summary: {
        Args: {
          user_id?: string
          chapter_mode?: Database["public"]["Enums"]["mode"]
        }
        Returns: {
          id: number
          title: string
          description: string
          mode: Database["public"]["Enums"]["mode"]
          sort_order: number
          lecture_count: number
          lectures_completed: number
        }[]
      }
      lecture_get_by_id: {
        Args: { p_lecture_id: number }
        Returns: {
          id: number
          title: string
          content: string
          chapter_id: number
          chapter_title: string
          chapter_mode: Database["public"]["Enums"]["mode"]
          sort_order: number
          is_completed: boolean
        }[]
      }
      lecture_get_completion_counts: {
        Args: { user_id?: string }
        Returns: {
          total_lectures: number
          completed_lectures: number
        }[]
      }
      lecture_get_with_completion: {
        Args: { p_chapter_id: number }
        Returns: {
          id: number
          title: string
          chapter_id: number
          sort_order: number
          is_completed: boolean
        }[]
      }
      lecture_mark_completed: {
        Args: { p_lecture_id: number }
        Returns: number
      }
      quiz_check_completion: {
        Args: { p_lecture_id: number; user_id?: string }
        Returns: boolean
      }
      quiz_get_results: {
        Args: { p_lecture_id: number; user_id?: string }
        Returns: {
          question_id: number
          question_text: string
          question_type: Database["public"]["Enums"]["question_type"]
          answer_text: string
          chosen_option_ids: number[]
          correct_option_ids: number[]
          correct_answer_text: string
          is_correct: boolean
          answered_at: string
        }[]
      }
      quiz_mark_completed: {
        Args: { p_lecture_id: number; p_passed: boolean }
        Returns: boolean
      }
      quiz_record_user_answer: {
        Args: {
          p_question_id: number
          p_answer_text?: string
          p_chosen_option_ids?: number[]
        }
        Returns: number
      }
      quiz_set_reference_option: {
        Args: { p_question_id: number; p_correct_option_id: number }
        Returns: number
      }
      quiz_set_reference_text: {
        Args: { p_question_id: number; p_reference_answer: string }
        Returns: number
      }
      system_record_event: {
        Args: {
          p_event_type: Database["public"]["Enums"]["event_type"]
          p_lecture_id?: number
          p_chapter_id?: number
          p_quiz_question_id?: number
          p_metadata?: Json
        }
        Returns: number
      }
      user_get_completion_stats: {
        Args: { user_id?: string }
        Returns: {
          total_chapters: number
          completed_chapters: number
          total_lectures: number
          completed_lectures: number
          completion_percentage: number
        }[]
      }
    }
    Enums: {
      event_type:
        | "LECTURE_VIEWED"
        | "LECTURE_COMPLETED"
        | "LECTURE_SKIPPED"
        | "QUIZ_STARTED"
        | "QUIZ_COMPLETED"
        | "QUIZ_PASSED"
        | "QUIZ_FAILED"
        | "QUESTION_ANSWERED"
        | "PAGE_VIEWED"
        | "SEARCH_PERFORMED"
        | "USER_REGISTERED"
        | "USER_LOGGED_IN"
        | "USER_LOGGED_OUT"
        | "PROFILE_UPDATED"
        | "ERROR_OCCURRED"
        | "FEEDBACK_SUBMITTED"
      gender: "MALE" | "FEMALE" | "OTHER"
      mode: "THEORETICAL" | "PRACTICAL"
      question_type: "OPEN" | "MULTIPLE_CHOICE"
      user_role: "ADMIN" | "MEDICAL_PROFESSIONAL" | "STUDENT" | "STUDENT_TESTER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      event_type: [
        "LECTURE_VIEWED",
        "LECTURE_COMPLETED",
        "LECTURE_SKIPPED",
        "QUIZ_STARTED",
        "QUIZ_COMPLETED",
        "QUIZ_PASSED",
        "QUIZ_FAILED",
        "QUESTION_ANSWERED",
        "PAGE_VIEWED",
        "SEARCH_PERFORMED",
        "USER_REGISTERED",
        "USER_LOGGED_IN",
        "USER_LOGGED_OUT",
        "PROFILE_UPDATED",
        "ERROR_OCCURRED",
        "FEEDBACK_SUBMITTED",
      ],
      gender: ["MALE", "FEMALE", "OTHER"],
      mode: ["THEORETICAL", "PRACTICAL"],
      question_type: ["OPEN", "MULTIPLE_CHOICE"],
      user_role: ["ADMIN", "MEDICAL_PROFESSIONAL", "STUDENT", "STUDENT_TESTER"],
    },
  },
} as const

