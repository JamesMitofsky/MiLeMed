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
      app_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: string
          id: number
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: string
          id?: number
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: string
          id?: number
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chapters: {
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
      images: {
        Row: {
          created_at: string | null
          id: number
          image_url: string
          lecture_id: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          image_url: string
          lecture_id?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          image_url?: string
          lecture_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "images_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      lecture_events: {
        Row: {
          created_at: string | null
          description: string | null
          event_type: Database["public"]["Enums"]["lecture_event_type"]
          id: number
          lecture_id: number
          profile_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          event_type: Database["public"]["Enums"]["lecture_event_type"]
          id?: number
          lecture_id: number
          profile_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          event_type?: Database["public"]["Enums"]["lecture_event_type"]
          id?: number
          lecture_id?: number
          profile_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lecture_events_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      lectures: {
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
            foreignKeyName: "lectures_chapter_id_fkey"
            columns: ["chapter_id"]
            isOneToOne: false
            referencedRelation: "chapters"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
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
      quiz_question_options: {
        Row: {
          id: number
          is_correct: boolean | null
          option_text: string
          question_id: number
          updated_at: string | null
        }
        Insert: {
          id?: number
          is_correct?: boolean | null
          option_text: string
          question_id: number
          updated_at?: string | null
        }
        Update: {
          id?: number
          is_correct?: boolean | null
          option_text?: string
          question_id?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_question_options_question_id_fkey"
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
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_sessions: {
        Row: {
          created_at: string | null
          lecture_id: number | null
          profile_id: string | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          lecture_id?: number | null
          profile_id?: string | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          lecture_id?: number | null
          profile_id?: string | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "quiz_sessions_lecture_id_fkey"
            columns: ["lecture_id"]
            isOneToOne: false
            referencedRelation: "lectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_sessions_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_answers: {
        Row: {
          answer_text: string | null
          answered_at: string | null
          chosen_option_ids: number[] | null
          id: number
          is_correct: boolean | null
          profile_id: string
          question_id: number
          session_id: string | null
          updated_at: string | null
        }
        Insert: {
          answer_text?: string | null
          answered_at?: string | null
          chosen_option_ids?: number[] | null
          id?: number
          is_correct?: boolean | null
          profile_id: string
          question_id: number
          session_id?: string | null
          updated_at?: string | null
        }
        Update: {
          answer_text?: string | null
          answered_at?: string | null
          chosen_option_ids?: number[] | null
          id?: number
          is_correct?: boolean | null
          profile_id?: string
          question_id?: number
          session_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quiz_answers_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "quiz_questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_quiz_answers_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "quiz_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_sorted_lectures: {
        Args: Record<PropertyKey, never>
        Returns: {
          lecture_id: number
          lecture_title: string
          lecture_content: string
          lecture_sort_order: number
          chapter_id: number
          chapter_title: string
          chapter_sort_order: number
          chapter_mode: Database["public"]["Enums"]["mode"]
        }[]
      }
      get_chapter_completion_counts: {
        Args: {
          user_id: string
        }
        Returns: {
          total_chapters: number
          completed_chapters: number
        }[]
      }
      get_chapter_summary: {
        Args: {
          user_id: string
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
      get_chapters_with_completion: {
        Args: {
          p_mode?: Database["public"]["Enums"]["mode"]
        }
        Returns: {
          id: number
          title: string
          total_lectures: number
          completed_lectures: number
        }[]
      }
      get_lecture_completion_counts: {
        Args: {
          user_id: string
        }
        Returns: {
          total_lectures: number
          completed_lectures: number
        }[]
      }
      get_lectures_with_completion: {
        Args: {
          p_chapter_id: number
        }
        Returns: {
          id: number
          title: string
          chapter_id: number
          sort_order: number
          is_completed: boolean
        }[]
      }
    }
    Enums: {
      gender: "MALE" | "FEMALE" | "OTHER"
      lecture_event_type:
        | "LECTURE_SKIPPED"
        | "LECTURE_MARKED_AS_READ"
        | "QUIZ_PASSED"
      mode: "THEORETICAL" | "PRACTICAL"
      question_type: "OPEN" | "MULTIPLE_CHOICE"
      quiz_event_type: "QUIZ_STARTED" | "QUESTION_ANSWERED" | "QUIZ_COMPLETED"
      user_role: "ADMIN" | "MEDICAL_PROFESSIONAL" | "STUDENT" | "STUDENT_TESTER"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

